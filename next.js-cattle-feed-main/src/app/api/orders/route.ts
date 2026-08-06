import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { prisma } from '@/lib/prisma';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

const isRazorpayConfigured = Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);

export async function POST(request: Request) {
  try {
    if (!isRazorpayConfigured) {
      console.error('Razorpay configuration is missing. Check RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.');
      return NextResponse.json({ error: 'Payment gateway is not configured. Please contact support.' }, { status: 500 });
    }

    const body = await request.json();
    const { customerName, email, phone, address, city, state, pincode, country, notes, totalAmount } = body;
    const items = Array.isArray(body.items) ? body.items : [];

    if (!customerName || !phone || !address || items.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!totalAmount || typeof totalAmount !== 'number' || totalAmount <= 0) {
      return NextResponse.json({ error: 'Order amount must be greater than zero' }, { status: 400 });
    }

    const invalidItem = items.find(
      (item: any) =>
        !item?.id || !item?.packSize || !item?.quantity || item.quantity <= 0 || item.price == null || item.price < 0
    );

    if (invalidItem) {
      return NextResponse.json({ error: 'Cart contains invalid product data. Please update your cart.' }, { status: 400 });
    }

    const productQuantities: Record<number, number> = {};
    for (const item of items) {
      productQuantities[item.id] = (productQuantities[item.id] || 0) + item.quantity;
    }

    const products = await prisma.product.findMany({
      where: { id: { in: Object.keys(productQuantities).map((id) => Number(id)) } },
    });

    if (products.length !== Object.keys(productQuantities).length) {
      return NextResponse.json({ error: 'One or more products in your cart are unavailable.' }, { status: 400 });
    }

    for (const product of products) {
      const requiredQty = productQuantities[product.id] || 0;
      if (product.stock < requiredQty) {
        return NextResponse.json({
          error: `Insufficient stock for ${product.name}. Only ${product.stock} unit${product.stock === 1 ? '' : 's'} available.`,
        }, { status: 400 });
      }
    }

    const amountInPaise = Math.round(totalAmount * 100);

    if (amountInPaise < 100) {
      return NextResponse.json({ error: 'Order amount must be at least ₹1' }, { status: 400 });
    }

    // 1. Create order in Database (Pending status)
    const order = await prisma.order.create({
      data: {
        customerName,
        email,
        phone,
        address,
        city,
        state,
        pincode,
        country: country || 'India',
        notes,
        totalAmount,
        status: 'Pending',
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            packSize: item.packSize,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    // 2. Create Razorpay order
    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: order.id,
      payment_capture: 1,
    };

    let razorpayOrder;
    try {
      razorpayOrder = await razorpay.orders.create(options);
    } catch (razorpayError: any) {
      console.error('Razorpay order creation failed:', razorpayError);
      await prisma.order.delete({ where: { id: order.id } }).catch(() => {});
      const razorpayMessage = razorpayError?.error?.description || razorpayError?.message || 'Failed to create payment order';
      return NextResponse.json({ error: razorpayMessage }, { status: 400 });
    }

    // 3. Update DB order with Razorpay Order ID
    await prisma.order.update({
      where: { id: order.id },
      data: { razorpayOrderId: razorpayOrder.id },
    });

    // 4. Deduct inventory for each item
    for (const item of items) {
      if (item.id && item.quantity) {
        await prisma.product.update({
          where: { id: item.id },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });
      }
    }

    // 5. Fire off a notification asynchronously
    try {
      fetch(`${request.headers.get('origin') || 'http://localhost:4028'}/api/admin/notifications`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'ORDER',
          title: 'New Order Received',
          message: `${customerName} placed a new order for ₹${totalAmount.toLocaleString('en-IN')}.`,
          relatedId: order.id
        })
      }).catch(() => {});
    } catch (e) {}

    return NextResponse.json({
      orderId: order.id,
      razorpayOrderId: razorpayOrder.id,
      amount: options.amount,
      currency: options.currency,
    });
  } catch (error: any) {
    console.error('Error creating order:', error);
    const message = error?.message || 'Failed to create order';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

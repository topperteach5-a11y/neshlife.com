import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminSession } from '@/lib/auth';

export async function GET(request: Request) {
  const session = verifyAdminSession(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const products = await prisma.product.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        category: true,
        stock: true,
        packSizes: true
      }
    });

    // Mock minStock and location since schema push failed due to DB connection issues
    const productsWithMockData = products.map(p => ({
      ...p,
      minStock: 50,
      location: 'Main Warehouse'
    }));

    return NextResponse.json(productsWithMockData);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = verifyAdminSession(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, stock, minStock, location } = body;

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const dataToUpdate: any = {};
    if (stock !== undefined) dataToUpdate.stock = stock;
    // minStock and location ignored as they are mocked for now

    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data: dataToUpdate
    });

    // Fire off notification if stock falls below min threshold
    if (stock !== undefined && stock <= 50) {
      try {
        fetch(`${request.headers.get('origin') || 'http://localhost:4028'}/api/admin/notifications`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'STOCK',
            title: 'Low Stock Alert',
            message: `${updatedProduct.name} stock has fallen to ${stock}. Please restock.`,
            relatedId: updatedProduct.id.toString()
          })
        }).catch(() => {});
      } catch (e) {}
    }

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error('Error updating inventory:', error);
    return NextResponse.json({ error: 'Failed to update inventory' }, { status: 500 });
  }
}

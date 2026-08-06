'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AppImage from '@/components/ui/Appimage';
import Icon from '@/components/ui/Appicon';
import { getCart, removeFromCart, updateQuantity, clearCart, CartItem } from '@/lib/cartStore';

interface ShippingForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  notes: string;
}

const STATES = [
  'Andaman and Nicobar Islands',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Lakshadweep',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Other',
];

// Charges removed completely

export default function CheckoutClient() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [step, setStep] = useState<'cart' | 'shipping' | 'review'>('cart');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<ShippingForm>>({});
  const [form, setForm] = useState<ShippingForm>({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', pincode: '', country: 'India', notes: '',
  });

  useEffect(() => {
    setCart(getCart());
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal;

  const handleRemove = (id: number, packSize: string) => {
    setCart(removeFromCart(id, packSize));
  };

  const handleQty = (id: number, packSize: string, qty: number) => {
    setCart(updateQuantity(id, packSize, qty));
  };

  const handleProceedToShipping = () => {
    if (cart.length === 0 || total <= 0) {
      alert('Your cart is empty. Please add items before proceeding to shipping.');
      return;
    }

    if (cart.some((item) => item.quantity < 1)) {
      alert('Please set a quantity of at least 1 for all items before proceeding.');
      return;
    }

    setStep('shipping');
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ShippingForm> = {};
    if (!form.firstName.trim()) newErrors.firstName = 'Required';
    if (!form.lastName.trim()) newErrors.lastName = 'Required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Valid email required';
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone.replace(/\s/g, ''))) newErrors.phone = '10-digit number required';
    if (!form.address.trim()) newErrors.address = 'Required';
    if (!form.city.trim()) newErrors.city = 'Required';
    if (!form.state) newErrors.state = 'Required';
    if (!form.pincode.trim() || !/^\d{6}$/.test(form.pincode)) newErrors.pincode = '6-digit pincode required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const hasInvalidQuantity = cart.some((item) => item.quantity < 1);

  const handleReviewOrder = () => {
    if (hasInvalidQuantity) {
      alert('Please update any product quantity to at least 1 before proceeding to review.');
      return;
    }

    const isValid = validateForm();
    if (!isValid) {
      alert('Please complete all required shipping fields before proceeding to review.');
      return;
    }

    setStep('review');
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async () => {
    if (total <= 0) {
      alert('Your cart total is ₹0. Please ensure products have valid prices set before checkout.');
      return;
    }

    setIsSubmitting(true);
    try {
      const resLoad = await loadRazorpay();
      if (!resLoad) {
        alert('Failed to load Razorpay SDK. Please check your connection.');
        setIsSubmitting(false);
        return;
      }

      // Step 1: Create Order on Backend
      const resOrder = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: `${form.firstName} ${form.lastName}`.trim(),
          email: form.email,
          phone: form.phone,
          address: form.address,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
          country: form.country || 'India',
          notes: form.notes,
          items: cart,
          totalAmount: total,
        }),
      });

      let orderData: any;
      try {
        orderData = await resOrder.json();
      } catch (parseError) {
        const text = await resOrder.text();
        throw new Error(text || 'Failed to create order');
      }

      if (!resOrder.ok) {
        throw new Error(orderData?.error || 'Failed to create order');
      }

      // Step 2: Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'NeshLife Premium Feed',
        description: 'Order Payment',
        order_id: orderData.razorpayOrderId,
        handler: async function (response: any) {
          try {
            // Step 3: Verify Payment
            const verifyRes = await fetch('/api/orders/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: orderData.orderId,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              clearCart();
              router.push(`/order-confirmation?orderId=${orderData.orderId}&total=${total}&name=${encodeURIComponent(form.firstName)}`);
            } else {
              alert('Payment verification failed.');
            }
          } catch (error) {
            console.error(error);
            alert('An error occurred during verification.');
          }
        },
        prefill: {
          name: `${form.firstName} ${form.lastName}`,
          email: form.email,
          contact: form.phone,
        },
        theme: {
          color: '#1A5C2E',
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.on('payment.failed', function (response: any) {
        alert(`Payment Failed: ${response.error.description}`);
      });
      paymentObject.open();
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { key: 'cart', label: 'Cart Review', icon: 'ShoppingCartIcon' },
    { key: 'shipping', label: 'Shipping', icon: 'TruckIcon' },
    { key: 'review', label: 'Review & Pay', icon: 'CreditCardIcon' },
  ] as const;

  const stepIndex = steps.findIndex((s) => s.key === step);

  if (cart.length === 0 && step === 'cart') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon name="ShoppingCartIcon" size={36} className="text-primary" />
        </div>
        <h2 className="font-display text-2xl font-bold text-foreground mb-3">Your cart is empty</h2>
        <p className="text-muted-foreground mb-8">Browse our range of premium animal nutrition products and add items to your cart.</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md font-semibold hover:bg-accent transition-colors"
        >
          <Icon name="ArrowLeftIcon" size={16} />
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Checkout</h1>
        <p className="text-muted-foreground mt-1">Complete your order in a few simple steps</p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-0 mb-10 max-w-lg">
        {steps.map((s, i) => (
          <React.Fragment key={s.key}>
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  i < stepIndex
                    ? 'bg-primary text-primary-foreground'
                    : i === stepIndex
                    ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                    : 'bg-white border-2 border-border text-muted-foreground'
                }`}
              >
                {i < stepIndex ? (
                  <Icon name="CheckIcon" size={16} />
                ) : (
                  <Icon name={s.icon} size={16} />
                )}
              </div>
              <span className={`text-xs font-medium whitespace-nowrap ${i === stepIndex ? 'text-primary' : 'text-muted-foreground'}`}>
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mb-5 mx-2 transition-all ${i < stepIndex ? 'bg-primary' : 'bg-border'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-5">

          {/* STEP 1: Cart Review */}
          {step === 'cart' && (
            <div className="bg-white rounded-2xl border border-border overflow-hidden">
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <h2 className="font-semibold text-foreground text-lg">Cart Review</h2>
                <span className="text-sm text-muted-foreground">{cart.length} item{cart.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="divide-y divide-border">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.packSize}`} className="p-5 flex gap-4">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white flex-shrink-0">
                      <AppImage src={item.image} alt={item.alt} fill className="object-contain" unoptimized />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-foreground text-sm">{item.name}</h3>
                          <p className="text-xs text-muted-foreground mt-0.5">{item.category} · {item.packSize}</p>
                        </div>
                        <button
                          onClick={() => handleRemove(item.id, item.packSize)}
                          className="p-1.5 rounded-md hover:bg-red-50 hover:text-red-500 text-muted-foreground transition-colors flex-shrink-0"
                          aria-label="Remove item"
                        >
                          <Icon name="TrashIcon" size={15} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="border border-border rounded-lg overflow-hidden bg-white">
                          <input
                            type="number"
                            min={1}
                            step={1}
                            value={item.quantity === 0 ? '' : item.quantity}
                            onFocus={(e) => e.currentTarget.select()}
                            onMouseUp={(e) => e.preventDefault()}
                            onChange={(e) => {
                              const value = e.target.value;
                              handleQty(item.id, item.packSize, value === '' ? 0 : Math.max(0, parseInt(value, 10) || 0));
                            }}
                            className="w-20 text-center text-sm font-semibold text-foreground bg-white outline-none px-3 py-2"
                            style={{ WebkitAppearance: 'none', MozAppearance: 'textfield', appearance: 'textfield', margin: 0 }}
                            aria-label="Quantity"
                          />
                        </div>
                        <span className="font-bold text-foreground text-sm">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-6 py-4 bg-muted/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <Link href="/products" className="flex items-center gap-1.5 text-sm text-primary font-medium hover:gap-2.5 transition-all">
                  <Icon name="ArrowLeftIcon" size={14} />
                  Continue Shopping
                </Link>
                <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleProceedToShipping}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-md font-semibold text-sm hover:bg-accent transition-colors"
                  >
                    Proceed to Shipping
                    <Icon name="ArrowRightIcon" size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Shipping Address */}
          {step === 'shipping' && (
            <div className="bg-white rounded-2xl border border-border overflow-hidden">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="font-semibold text-foreground text-lg">Shipping Address</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Where should we deliver your order?</p>
              </div>
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">First Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={form.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                      placeholder="Ramesh"
                      className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all ${errors.firstName ? 'border-red-400 bg-red-50' : 'border-border bg-white'}`}
                      style={{ fontSize: '16px' }}
                    />
                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                  </div>
                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Last Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={form.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                      placeholder="Kumar"
                      className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all ${errors.lastName ? 'border-red-400 bg-red-50' : 'border-border bg-white'}`}
                      style={{ fontSize: '16px' }}
                    />
                    {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                  </div>
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Email Address <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="ramesh@farm.com"
                      className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all ${errors.email ? 'border-red-400 bg-red-50' : 'border-border bg-white'}`}
                      style={{ fontSize: '16px' }}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Phone Number <span className="text-red-500">*</span></label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="7351059967"
                      className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all ${errors.phone ? 'border-red-400 bg-red-50' : 'border-border bg-white'}`}
                      style={{ fontSize: '16px' }}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Street Address <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="Village / Town, District"
                    className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all ${errors.address ? 'border-red-400 bg-red-50' : 'border-border bg-white'}`}
                     style={{ fontSize: '16px' }}
                  />
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* City */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">City <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      placeholder="City"
                      className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all ${errors.city ? 'border-red-400 bg-red-50' : 'border-border bg-white'}`}
                      style={{ fontSize: '16px' }}
                    />
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                  </div>
                  {/* State */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">State <span className="text-red-500">*</span></label>
                    <select
                      value={form.state}
                      onChange={(e) => setForm({ ...form, state: e.target.value })}
                      className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all ${errors.state ? 'border-red-400 bg-red-50' : 'border-border bg-white'}`}
                    style={{ fontSize: '16px' }}
                    >
                      <option value="">Select State</option>
                      {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                  </div>
                  {/* Pincode */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Pincode <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={form.pincode}
                      onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                      placeholder="560001"
                      maxLength={6}
                      className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all ${errors.pincode ? 'border-red-400 bg-red-50' : 'border-border bg-white'}`}
                      style={{ fontSize: '16px' }}
                    />
                    {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Delivery Notes <span className="text-muted-foreground font-normal">(optional)</span></label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Any special delivery instructions..."
                    rows={3}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-white text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none"
                  style={{ fontSize: '16px' }}
                  />
                </div>
              </div>
              <div className="px-6 py-4 bg-muted/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <button
                  onClick={() => setStep('cart')}
                  className="flex items-center gap-1.5 text-sm text-foreground font-medium hover:text-primary transition-colors"
                >
                  <Icon name="ArrowLeftIcon" size={14} />
                  Back to Cart
                </button>
                <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleReviewOrder}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-md font-semibold text-sm hover:bg-accent transition-colors"
                  >
                    Review Order
                    <Icon name="ArrowRightIcon" size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Review & Pay */}
          {step === 'review' && (
            <div className="space-y-5">
              {/* Delivery Address Card */}
              <div className="bg-white rounded-2xl border border-border p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                      <Icon name="MapPinIcon" size={16} className="text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">Delivery Address</h3>
                  </div>
                  <button onClick={() => setStep('shipping')} className="text-xs text-primary font-medium hover:underline">Edit</button>
                </div>
                <div className="bg-muted rounded-xl p-4">
                  <p className="font-semibold text-foreground text-sm">{form.firstName} {form.lastName}</p>
                  <p className="text-muted-foreground text-sm mt-1">{form.address}</p>
                  <p className="text-muted-foreground text-sm">{form.city}, {form.state} — {form.pincode}</p>
                  <p className="text-muted-foreground text-sm">{form.country}</p>
                  <div className="flex gap-4 mt-2 pt-2 border-t border-border">
                    <p className="text-sm text-foreground"><span className="text-muted-foreground">Phone:</span> {form.phone}</p>
                    <p className="text-sm text-foreground"><span className="text-muted-foreground">Email:</span> {form.email}</p>
                  </div>
                </div>
              </div>

              {/* Items Review */}
              <div className="bg-white rounded-2xl border border-border overflow-hidden">
                <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Order Items</h3>
                  <button onClick={() => setStep('cart')} className="text-xs text-primary font-medium hover:underline">Edit</button>
                </div>
                <div className="divide-y divide-border">
                  {cart.map((item) => (
                    <div key={`${item.id}-${item.packSize}`} className="flex items-center gap-4 p-4">
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-white flex-shrink-0">
                        <AppImage src={item.image} alt={item.alt} fill className="object-contain" unoptimized />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.packSize} · Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-foreground text-sm">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-border p-5">
                {/* UPI Only — the only accepted payment method */}
                <div className="p-4 rounded-xl border-2 border-primary bg-secondary flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name="DevicePhoneMobileIcon" size={18} className="text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">UPI Payment</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Pay securely using GPay, PhonePe, Paytm, BHIM or any UPI app. UPI Limit up to ₹1 lakh. Card limit up to ₹5 Lakh per order.</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5">
                  <Icon name="ShieldCheckIcon" size={13} className="text-primary flex-shrink-0" />
                  256-bit SSL encrypted · No COD accepted
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setStep('shipping')}
                  className="flex items-center gap-1.5 text-sm text-foreground font-medium hover:text-primary transition-colors"
                >
                  <Icon name="ArrowLeftIcon" size={14} />
                  Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3 rounded-md font-bold text-sm hover:bg-accent transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Placing Order...
                    </>
                  ) : (
                    <>
                      <Icon name="CheckIcon" size={16} />
                      Place Order · ₹{total.toLocaleString('en-IN')}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-border p-5 sticky top-24">
            <h3 className="font-semibold text-foreground mb-4">Order Summary</h3>

            {/* Items */}
            <div className="space-y-3 mb-4">
              {cart.map((item) => (
                <div key={`${item.id}-${item.packSize}`} className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-white flex-shrink-0">
                    <AppImage src={item.image} alt={item.alt} fill className="object-contain" unoptimized />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">×{item.quantity}</p>
                  </div>
                  <p className="text-xs font-semibold text-foreground">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium text-foreground">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between">
                <span className="font-bold text-foreground">Total</span>
                <span className="font-bold text-primary text-lg">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-5 pt-4 border-t border-border space-y-2.5">
              {[
                { icon: 'ShieldCheckIcon', text: 'Secure & encrypted checkout' },
                { icon: 'TruckIcon', text: 'Pan-India delivery available' },
                { icon: 'ArrowPathIcon', text: 'Easy returns within 7 days' },
              ].map((badge) => (
                <div key={badge.text} className="flex items-center gap-2.5">
                  <Icon name={badge.icon} size={15} className="text-primary flex-shrink-0" />
                  <span className="text-xs text-muted-foreground">{badge.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Icon from '@/components/ui/Appicon';

export default function OrderConfirmationClient() {
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const orderId = mounted ? (searchParams?.get('orderId') || 'CF-00000000') : 'CF-00000000';
  const total = mounted ? (searchParams?.get('total') || '0') : '0';
  const name = mounted ? (searchParams?.get('name') || 'Valued Customer') : 'Valued Customer';

  const estimatedDate = (() => {
    const d = new Date();
    d?.setDate(d?.getDate() + 5);
    return d?.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  })();

  const steps = [
    { label: 'Order Placed', desc: 'We have received your order', done: true },
    { label: 'Processing', desc: 'Your order is being prepared', done: false },
    { label: 'Dispatched', desc: 'Shipped from our warehouse', done: false },
    { label: 'Delivered', desc: `Expected by ${estimatedDate}`, done: false },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Success Banner */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden mb-6">
        <div className="bg-gradient-to-br from-primary to-accent p-8 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="CheckCircleIcon" size={36} className="text-white" variant="solid" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white mb-1">Order Confirmed!</h1>
          <p className="text-white/80 text-sm">Thank you, {name}. Your order has been placed successfully.</p>
        </div>

        <div className="p-6">
          {/* Order Details */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-muted rounded-xl p-4">
              <p className="text-xs text-muted-foreground mb-1">Order ID</p>
              <p className="font-bold text-foreground text-sm font-mono">{orderId}</p>
            </div>
            <div className="bg-muted rounded-xl p-4">
              <p className="text-xs text-muted-foreground mb-1">Order Total</p>
              <p className="font-bold text-primary text-sm">₹{Number(total)?.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-muted rounded-xl p-4">
              <p className="text-xs text-muted-foreground mb-1">Payment Method</p>
              <p className="font-semibold text-foreground text-sm">Razorpay UPI</p>
            </div>
            <div className="bg-muted rounded-xl p-4">
              <p className="text-xs text-muted-foreground mb-1">Expected Delivery</p>
              <p className="font-semibold text-foreground text-sm">{estimatedDate}</p>
            </div>
          </div>

          {/* Order Tracking */}
          <div className="mb-6">
            <h3 className="font-semibold text-foreground text-sm mb-4">Order Status</h3>
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-border" />
              <div className="absolute left-4 top-4 w-0.5 bg-primary" style={{ height: '8px' }} />
              <div className="space-y-5">
                {steps?.map((s, i) => (
                  <div key={s?.label} className="flex items-start gap-4 relative">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                      s?.done ? 'bg-primary' : i === 1 ? 'bg-white border-2 border-primary' : 'bg-white border-2 border-border'
                    }`}>
                      {s?.done ? (
                        <Icon name="CheckIcon" size={14} className="text-white" />
                      ) : (
                        <div className={`w-2 h-2 rounded-full ${i === 1 ? 'bg-primary' : 'bg-border'}`} />
                      )}
                    </div>
                    <div className="pt-1">
                      <p className={`text-sm font-semibold ${s?.done || i === 1 ? 'text-foreground' : 'text-muted-foreground'}`}>{s?.label}</p>
                      <p className="text-xs text-muted-foreground">{s?.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Info Note */}
          <div className="bg-secondary rounded-xl p-4 flex gap-3 mb-6">
            <Icon name="InformationCircleIcon" size={18} className="text-primary flex-shrink-0 mt-0.5" />
            <p className="text-sm text-foreground">
              A confirmation will be sent to your email. Our team will contact you within 24 hours to confirm delivery details.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/products"
              className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground px-5 py-3 rounded-md font-semibold text-sm hover:bg-accent transition-colors"
            >
              <Icon name="ShoppingBagIcon" size={16} />
              Continue Shopping
            </Link>
            <Link
              href="/"
              className="flex-1 flex items-center justify-center gap-2 border border-border px-5 py-3 rounded-md font-semibold text-sm text-foreground hover:border-primary hover:text-primary transition-colors"
            >
              <Icon name="HomeIcon" size={16} />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
      {/* Support */}
      <div className="bg-white rounded-2xl border border-border p-5 flex items-center gap-4">
        <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center flex-shrink-0">
          <Icon name="PhoneIcon" size={18} className="text-primary" />
        </div>
        <div>
          <p className="font-semibold text-foreground text-sm">Need help with your order?</p>
          <p className="text-xs text-muted-foreground">Contact our support team at <span className="text-primary font-medium">support@cattlefeed.com</span></p>
        </div>
      </div>
    </div>
  );
}

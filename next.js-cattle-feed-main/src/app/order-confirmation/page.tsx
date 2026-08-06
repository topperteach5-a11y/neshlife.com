import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import OrderConfirmationClient from './components/OrderConfirmationClient';

export const metadata: Metadata = {
  title: 'Order Confirmed — CattleFeed',
  description: 'Your order has been placed successfully. Thank you for choosing CattleFeed.',
};

export default function OrderConfirmationPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-muted pt-20 pb-16">
        <Suspense fallback={
          <div className="max-w-2xl mx-auto px-4 py-20 text-center">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse" />
            <div className="h-6 bg-muted rounded w-48 mx-auto mb-3" />
            <div className="h-4 bg-muted rounded w-64 mx-auto" />
          </div>
        }>
          <OrderConfirmationClient />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

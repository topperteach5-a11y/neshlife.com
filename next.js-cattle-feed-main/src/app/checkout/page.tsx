import React from 'react';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CheckoutClient from './components/CheckoutClient';

export const metadata: Metadata = {
  title: 'Checkout — CattleFeed',
  description: 'Complete your order for premium cattle, poultry, and aqua feed products.',
};

export default function CheckoutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-muted pt-20 pb-16">
        <CheckoutClient />
      </main>
      <Footer />
    </>
  );
}

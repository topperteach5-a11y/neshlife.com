import React from 'react';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactSection from '@/app/components/ContactSection';

export const metadata: Metadata = {
  title: 'Contact Us — NeshLife | Get in Touch with Our Animal Nutrition Experts',
  description: 'Have questions about NeshLife cattle feed, poultry feed, or aqua feed? Contact our expert team for personalized recommendations, technical support, and order inquiries.',
  keywords: 'contact neshlife, neshlife support, talk to expert cattle feed, neshlife contact number, animal feed inquiry',
  openGraph: {
    title: 'Contact Us — NeshLife Animal Nutrition',
    description: 'Get in touch with NeshLife experts for personalized animal nutrition advice.',
    url: '/contact',
  }
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-16 md:pt-20">
        <ContactSection />
      </div>
      <Footer />
    </main>
  );
}

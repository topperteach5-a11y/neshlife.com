import React from 'react';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/app/components/HeroSection';
import ProductRangeSection from '@/app/components/ProductRangeSection';
import AboutSection from '@/app/components/AboutSection';
import CertificationsSection from '@/app/components/CertificationsSection';
import TestimonialsSection from '@/app/components/TestimonialsSection';
import NewsSection from '@/app/components/NewsSection';
import ContactSection from '@/app/components/ContactSection';

export const metadata: Metadata = {
  title: 'NeshLife — Best Cattle Feed, Poultry Feed & Aqua Feed Products | Global Animal Nutrition Company',
  description: 'Welcome to NeshLife. We are a global animal feed company manufacturing the best cattle feed products, poultry feed, and aqua feed for farmers worldwide. Discover scientific animal nutrition solutions.',
  keywords: 'neshlife, neshlife cattle feed, neshlife poultry feed, neshlife aqua feed, best cattle feed products in global, best animal feed company, premium cattle feed manufacturer, scientific animal nutrition solutions',
  openGraph: {
    title: 'NeshLife — Best Cattle Feed, Poultry Feed & Aqua Feed',
    description: 'Welcome to NeshLife. We are a global animal feed company manufacturing the best cattle feed products, poultry feed, and aqua feed.',
    url: '/',
  }
};

export default async function HomePage() {
  const { prisma } = await import('@/lib/prisma');
  let dbProducts: any[] = [];
  try {
    dbProducts = await prisma.product.findMany({
      take: 9,
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.warn('Database connection timeout (Home). Falling back to empty products list.');
    // Graceful fallback to prevent page crash
    dbProducts = [];
  }

  const products = dbProducts.map((p: any) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    weight: p.weight,
    image: p.imageUrl || 'https://img.rocket.new/generatedImages/rocket_gen_img_1cd12480e-1784182938345.png',
    alt: `${p.name} bag product by NeshLife`,
    badge: p.status === 'Active' ? null : p.status
  }));

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'NeshLife Animal Nutrition',
    image: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/assets/images/app_logo.png`,
    '@id': `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}`,
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}`,
    telephone: '+917351059967',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Barpeta Road',
      addressLocality: 'Assam',
      postalCode: '781315',
      addressCountry: 'IN'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 26.4950,
      longitude: 90.9654
    },
    priceRange: '$$'
  };

  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <Header />
      <HeroSection />
      <ProductRangeSection products={products} />
      <AboutSection />
      <CertificationsSection />
      <TestimonialsSection />
      <NewsSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
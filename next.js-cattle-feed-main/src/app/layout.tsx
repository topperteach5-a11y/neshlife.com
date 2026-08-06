import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Fraunces } from 'next/font/google';
import '../styles/index.css';
import ScrollToTop from '@/components/ScrollToTop';
import fs from 'fs/promises';
import path from 'path';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '600', '700', '900'],
  variable: '--font-fraunces',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'NeshLife — Best Cattle Feed, Poultry Feed & Aqua Feed Manufacturer | Global Animal Nutrition',
  description: 'Scientifically formulated NeshLife cattle feed, poultry feed, and aqua feed trusted by 1M+ farmers globally. Shop premium animal nutrition products online.',
  keywords: 'neshlife, neshlife cattle feed, neshlife poultry feed, neshlife aqua feed, best cattle feed products in global, best animal feed company, premium cattle feed manufacturer',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'NeshLife — Premium Animal Nutrition & Feed Products',
    description: 'Scientifically formulated cattle, poultry, and aqua feed by NeshLife.',
    url: '/',
    siteName: 'NeshLife',
    images: [
      {
        url: '/assets/images/hero_slide_1.jpg',
        width: 1200,
        height: 630,
        alt: 'NeshLife Animal Nutrition',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NeshLife — Premium Animal Nutrition',
    description: 'Scientifically formulated cattle, poultry, and aqua feed by NeshLife.',
    images: ['/assets/images/hero_slide_1.jpg'],
  },
  icons: {
    icon: [{ url: '/favicon.ico', type: 'image/x-icon' }],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  let instagramUrl = '';
  try {
    const settingsPath = path.join(process.cwd(), 'src', 'data', 'settings.json');
    const data = await fs.readFile(settingsPath, 'utf-8');
    const settings = JSON.parse(data);
    if (settings.instagramUrl) instagramUrl = settings.instagramUrl;
  } catch (e) {
    instagramUrl = '';
  }

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'NeshLife',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/assets/images/app_logo.png`,
    description: 'NeshLife is a premium manufacturer of scientifically formulated cattle feed, poultry feed, and aqua feed products globally.',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+917351059967',
      contactType: 'customer service',
      email: 'export@neshlife.com',
      availableLanguage: ['English', 'Hindi']
    },
    sameAs: instagramUrl ? [instagramUrl] : []
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'NeshLife',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/products?search={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${fraunces.variable}`}>
      <body className={plusJakartaSans.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {children}
        <ScrollToTop />

        <script type="module" async src="https://static.rocket.new/rocket-web.js?_cfg=https%3A%2F%2Fcattlefeed3438back.builtwithrocket.new&_be=https%3A%2F%2Fappanalytics.rocket.new&_v=0.1.19" />
        <script type="module" defer src="https://static.rocket.new/rocket-shot.js?v=0.0.2" /></body>
    </html>
  );
}

import React, { Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductsPageClient from '@/app/products/components/ProductsPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NeshLife Products — Best Cattle Feed, Poultry Feed & Aqua Feed | Buy Online',
  description: 'Browse our complete range of scientifically formulated NeshLife cattle feed, poultry feed, and aqua feed products globally. Find the best nutrition for your animals.',
  keywords: 'neshlife products, best cattle feed, premium poultry feed, high quality aqua feed, animal nutrition, buy cattle feed online',
  openGraph: {
    title: 'NeshLife Animal Nutrition Products',
    description: 'Browse our complete range of scientifically formulated cattle, poultry, and aqua feed.',
    url: '/products',
  }
};

export default function ProductsPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/`
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Products',
        item: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/products`
      }
    ]
  };

  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Header />
      <div className="pt-16 md:pt-18">
        {/* Breadcrumb */}
        <div className="bg-muted border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
            <nav className="flex items-center gap-2 text-xs text-muted-foreground">
              <a href="/" className="hover:text-primary transition-colors">Home</a>
              <span>›</span>
              <span className="text-foreground font-medium">Products</span>
            </nav>
          </div>
        </div>

        {/* Page Header */}
        <div className="bg-white border-b border-border py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              NeshLife Product Range
            </h1>
            <p className="text-muted-foreground text-sm">
              Balanced animal nutrition engineered for every stage of growth globally.
            </p>
          </div>
        </div>

        <Suspense fallback={<div className="text-center py-16">Loading products...</div>}>
          <ProductsFetcher />
        </Suspense>
      </div>
      <Footer />
    </main>
  );
}

async function ProductsFetcher() {
  const { prisma } = await import('@/lib/prisma');
  let dbProducts: any[] = [];
  try {
    dbProducts = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.warn('Database connection timeout (Products). Falling back to empty products list.');
    dbProducts = [];
  }

  const products = dbProducts.map((p: any) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    weight: p.weight,
    description: p.description,
    features: p.features,
    image: p.imageUrl || 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=100&q=60',
    alt: `${p.name} bag product`,
    badge: null,
    packSizes: p.packSizes,
    price: p.price ?? 0,
  }));

  return <ProductsPageClient allProducts={products} />;
}
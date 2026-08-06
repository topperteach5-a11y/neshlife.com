'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/Appimage';
import Icon from '@/components/ui/Appicon';

const categories = ['All Products', 'Cattle Feed', 'Poultry Feed', 'Aqua Feed'];

export default function ProductRangeSection({ products }: { products: any[] }) {
  const [activeCategory, setActiveCategory] = useState('All Products');
  const sectionRef = useRef<HTMLElement>(null);

  const filtered = activeCategory === 'All Products' ?
  products :
  products?.filter((p) => p?.category === activeCategory);

  useEffect(() => {
    const el = sectionRef?.current;
    if (!el) return;
    const cards = el?.querySelectorAll('.product-animate');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            entry.target.classList.remove('is-hidden');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -5% 0px' }
    );
    cards?.forEach((c) => {
      c?.classList?.add('animate-on-scroll', 'is-hidden');
      observer?.observe(c);
    });
    return () => observer?.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="products" className="py-16 md:py-20 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10 product-animate">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-2">Our Products</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            NeshLife: Complete Nutrition for Every Animal
          </h2>
          <p className="text-muted-foreground text-base max-w-xl mx-auto">
            Science-based NeshLife animal feed solutions for Cattle, Poultry & Aqua to unlock the best performance globally.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10 product-animate">
          {categories?.map((cat) =>
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
            activeCategory === cat ?
            'bg-primary text-primary-foreground shadow-md' :
            'bg-white text-muted-foreground border border-border hover:border-primary hover:text-primary'}`
            }>
            
              {cat}
            </button>
          )}
        </div>

        {/* Product Grid */}
        {/* BENTO AUDIT: 9 cards in 3-col grid. All equal size cs-1.
              Row 1: [col-1: MilkBooster] [col-2: PregnancyCare] [col-3: BullConditioner]
              Row 2: [col-1: PoultryStarter] [col-2: PoultryGrower] [col-3: PoultryFinisher]
              Row 3: [col-1: AquaPro] [col-2: AquaGrow] [col-3: AquaSupreme]
              Placed 9/9 ✓ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered?.map((product, i) =>
          <div
            key={product?.id}
            className="product-animate product-card-hover bg-white rounded-xl border border-border overflow-hidden group"
            style={{ transitionDelay: `${i * 60}ms` }}>
            
              <div className="relative aspect-[4/3] overflow-hidden bg-white">
                <AppImage
                src={product?.image}
                alt={`${product?.alt || product?.name} - NeshLife Premium Feed`}
                fill
                className="object-contain image-zoom-inner"
                unoptimized />
              
                {product?.badge &&
              <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-md">
                    {product?.badge}
                  </span>
              }
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <h3 className="font-semibold text-foreground text-base">{product?.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{product?.category}</p>
                  </div>
                  <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded font-medium flex-shrink-0 ml-2">
                    {product?.weight}
                  </span>
                </div>
                <Link
                href={`/products?id=${product?.id}`}
                className="mt-4 flex items-center gap-1.5 text-primary text-sm font-semibold hover:gap-2.5 transition-all">
                
                  View Details
                  <Icon name="ArrowRightIcon" size={14} />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-10 product-animate">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-md font-semibold text-sm hover:bg-accent transition-colors">
            
            View All Products
            <Icon name="ArrowRightIcon" size={16} />
          </Link>
        </div>
      </div>
    </section>);

}
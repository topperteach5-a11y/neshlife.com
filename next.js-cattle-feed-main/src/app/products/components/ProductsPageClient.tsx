'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import AppImage from '@/components/ui/Appimage';
import Icon from '@/components/ui/Appicon';
import { addToCart } from '@/lib/cartStore';

interface Product {
  id: number;
  name: string;
  category: string;
  weight: string;
  description: string;
  features: string[];
  image: string;
  alt: string;
  badge: string | null;
  packSizes: string[];
  price: number;
}

const categories = ['All Products', 'Cattle Feed', 'Poultry Feed', 'Aqua Feed'];

export default function ProductsPageClient({ allProducts }: { allProducts: Product[] }) {
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState('All Products');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedPackSize, setSelectedPackSize] = useState<string>('');
  const [addedId, setAddedId] = useState<string | null>(null);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setActiveCategory(categoryParam);
    }
    const idParam = searchParams.get('id');
    if (idParam) {
      const product = allProducts.find(p => p.id.toString() === idParam);
      if (product) {
        setSelectedProduct(product);
        setSelectedPackSize(product.packSizes?.[0] || '');
      }
    }
  }, [searchParams, allProducts]);

  const filtered = activeCategory === 'All Products' ?
  allProducts :
  allProducts.filter((p) => p.category === activeCategory);

  const handleAddToCart = (product: Product, packSize: string) => {
    const key = `${product.id}-${packSize}`;
    addToCart({
      id: product.id,
      name: product.name,
      category: product.category,
      weight: product.weight,
      image: product.image,
      alt: product.alt,
      packSize,
      price: product.price,
    });
    setAddedId(key);
    setTimeout(() => setAddedId(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-border p-5 sticky top-20">
            <h3 className="font-semibold text-foreground text-sm mb-4 uppercase tracking-wide">Categories</h3>
            <ul className="space-y-1">
              {categories.map((cat) =>
              <li key={cat}>
                  <button
                  onClick={() => setActiveCategory(cat)}
                  className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  activeCategory === cat ?
                  'bg-primary text-primary-foreground' :
                  'text-foreground hover:bg-muted hover:text-primary'}`
                  }>
                  
                    {cat}
                  </button>
                </li>
              )}
            </ul>

            {/* Talk to Expert Banner */}
            <div className="mt-6 bg-primary rounded-xl p-4">
              <p className="text-primary-foreground font-semibold text-sm mb-1">Need help choosing?</p>
              <p className="text-primary-foreground/70 text-xs mb-3">Our experts are here to help you.</p>
              <Link
                href="/contact"
                className="flex items-center gap-1.5 bg-primary-foreground text-primary px-3 py-2 rounded-md text-xs font-bold hover:bg-primary-foreground/90 transition-colors">
                Talk to Expert
                <Icon name="ArrowRightIcon" size={12} />
              </Link>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filtered.length}</span> products
            </p>
            <Link
              href="/checkout"
              className="flex items-center gap-2 border border-border px-3 py-2 rounded-md text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-colors"
            >
              <Icon name="ShoppingCartIcon" size={15} />
              View Cart
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((product) => {
              const defaultSize = product.packSizes[0];
              const cartKey = `${product.id}-${defaultSize}`;
              const isAdded = addedId === cartKey;
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-xl border border-border overflow-hidden group hover:shadow-lg transition-shadow">
                  
                  <div
                    className="relative aspect-[4/3] overflow-hidden bg-white cursor-pointer"
                    onClick={() => { setSelectedProduct(product); setSelectedPackSize(product.packSizes[0]); }}>
                    <AppImage
                      src={product.image}
                      alt={product.alt}
                      fill
                      className="object-contain group-hover:scale-105 transition-transform duration-300"
                      unoptimized />
                  
                    {product.badge &&
                      <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded">
                        {product.badge}
                      </span>
                    }
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-foreground text-base">{product.name}</h3>
                        <p className="text-xs text-muted-foreground">{product.category}</p>
                      </div>
                      <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded font-medium flex-shrink-0 ml-2">
                        {product.weight}
                      </span>
                    </div>
                    {product.price > 0 && (
                      <p className="text-base font-bold text-primary mb-1">₹{product.price.toLocaleString('en-IN')}</p>
                    )}
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => { setSelectedProduct(product); setSelectedPackSize(product.packSizes[0]); }}
                        className="flex items-center gap-1.5 text-primary text-sm font-semibold transition-colors hover:text-accent flex-1">
                        View Details
                        <Icon name="ArrowRightIcon" size={14} className="transition-transform hover:translate-x-1" />
                      </button>
                      <button
                        onClick={() => handleAddToCart(product, defaultSize)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                          isAdded
                            ? 'bg-green-100 text-green-700' :'bg-primary text-primary-foreground hover:bg-accent'
                        }`}
                      >
                        <Icon name={isAdded ? 'CheckIcon' : 'ShoppingCartIcon'} size={13} />
                        {isAdded ? 'Added!' : 'Add'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct &&
      <div
        className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={() => setSelectedProduct(null)}>
        
          <div
          className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}>
          
            <div className="relative aspect-video overflow-hidden rounded-t-2xl bg-white border-b border-border">
              <AppImage
              src={selectedProduct.image}
              alt={selectedProduct.alt}
              fill
              className="object-contain"
              unoptimized />
            
              <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-muted transition-colors"
              aria-label="Close">
              
                <Icon name="XMarkIcon" size={16} className="text-foreground" />
              </button>
              {selectedProduct.badge &&
            <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">
                  {selectedProduct.badge}
                </span>
            }
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h2 className="font-display text-2xl font-bold text-foreground">{selectedProduct.name}</h2>
                  <p className="text-sm text-muted-foreground">{selectedProduct.category}</p>
                  {selectedProduct.price > 0 && (
                    <p className="text-xl font-bold text-primary mt-1">₹{selectedProduct.price.toLocaleString('en-IN')}</p>
                  )}
                </div>
                <span className="bg-secondary text-secondary-foreground px-3 py-1.5 rounded-lg text-sm font-semibold">
                  {selectedProduct.weight}
                </span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-5">{selectedProduct.description}</p>

              <h4 className="font-semibold text-foreground text-sm mb-3">Key Benefits</h4>
              <ul className="space-y-2 mb-5">
                {selectedProduct.features.map((f) =>
              <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                    <Icon name="CheckCircleIcon" size={16} className="text-primary flex-shrink-0" variant="solid" />
                    {f}
                  </li>
              )}
              </ul>

              <h4 className="font-semibold text-foreground text-sm mb-3">Pack Sizes</h4>
              <div className="flex gap-2 mb-6">
                {selectedProduct.packSizes.map((size) =>
              <button
                key={size}
                onClick={() => setSelectedPackSize(size)}
                className={`border rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  selectedPackSize === size
                    ? 'border-primary text-primary bg-secondary' :'border-border text-foreground hover:border-primary hover:text-primary'
                }`}>
                    {size}
                  </button>
              )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    handleAddToCart(selectedProduct, selectedPackSize || selectedProduct.packSizes[0]);
                    setSelectedProduct(null);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-md font-semibold text-sm hover:bg-accent transition-colors">
                  <Icon name="ShoppingCartIcon" size={16} />
                  Add to Cart
                </button>
                <Link
                  href="/checkout"
                  onClick={() => {
                    handleAddToCart(selectedProduct, selectedPackSize || selectedProduct.packSizes[0]);
                    setSelectedProduct(null);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 border border-primary text-primary py-3 rounded-md font-semibold text-sm hover:bg-secondary transition-colors">
                  Buy Now
                  <Icon name="ArrowRightIcon" size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      }
    </div>);

}
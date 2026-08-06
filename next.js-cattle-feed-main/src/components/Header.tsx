'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/Applogo';
import Icon from '@/components/ui/Appicon';
import { getCartCount } from '@/lib/cartStore';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/#about' },
  { label: 'Products', href: '/products', hasDropdown: true },
  { label: 'FAQs', href: '/faqs' },
  { label: 'News', href: '/#news' },
  { label: 'Contact', href: '/contact' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setCartCount(getCartCount());
    const onStorage = () => setCartCount(getCartCount());
    window.addEventListener('storage', onStorage);
    // Poll for cart changes within same tab
    const interval = setInterval(() => setCartCount(getCartCount()), 1000);
    return () => {
      window.removeEventListener('storage', onStorage);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white shadow-sm border-b border-border' : 'bg-white/95 backdrop-blur-md'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0" aria-label="NeshLife Home">
              <AppLogo size={36} />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks?.map((link) => (
                <Link
                  key={link?.label}
                  href={link?.href}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors rounded-md hover:bg-muted"
                >
                  {link?.label}
                  {link?.hasDropdown && (
                    <Icon name="ChevronDownIcon" size={14} className="text-muted-foreground" />
                  )}
                </Link>
              ))}
            </nav>

            {/* CTA + Cart + Mobile Toggle */}
            <div className="flex items-center gap-3">
              {/* Cart Icon */}
              <Link
                href="/checkout"
                className="relative p-2 rounded-md hover:bg-muted transition-colors"
                aria-label="View cart"
              >
                <Icon name="ShoppingCartIcon" size={20} className="text-foreground" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>
              <Link
                href="/contact"
                className="hidden sm:inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-semibold hover:bg-accent transition-colors"
              >
                Get in Touch
              </Link>
              <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden p-2 rounded-md hover:bg-muted transition-colors"
                aria-label="Open menu"
              >
                <Icon name="Bars3Icon" size={22} className="text-foreground" />
              </button>
            </div>
          </div>
        </div>
      </header>
      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col">
          <div className="flex items-center justify-between px-4 h-16 border-b border-border">
            <div className="flex items-center gap-2">
              <AppLogo size={34} />
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 rounded-md hover:bg-muted"
              aria-label="Close menu"
            >
              <Icon name="XMarkIcon" size={22} className="text-foreground" />
            </button>
          </div>
          <nav className="flex flex-col px-4 py-6 gap-1 flex-1 overflow-y-auto">
            {navLinks?.map((link) => (
              <Link
                key={link?.label}
                href={link?.href}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-muted rounded-md transition-colors"
              >
                {link?.label}
              </Link>
            ))}
            <Link
              href="/checkout"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-4 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-muted rounded-md transition-colors"
            >
              <Icon name="ShoppingCartIcon" size={18} />
              Cart {cartCount > 0 && <span className="ml-1 bg-primary text-primary-foreground text-xs font-bold px-1.5 py-0.5 rounded-full">{cartCount}</span>}
            </Link>
          </nav>
          <div className="px-4 pb-8">
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md text-base font-semibold hover:bg-accent transition-colors w-full"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
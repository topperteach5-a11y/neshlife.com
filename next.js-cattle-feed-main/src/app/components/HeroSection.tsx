'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/Appimage';
import Icon from '@/components/ui/Appicon';

const heroSlides = [
{
  src: "/assets/images/hero_slide_1.jpg",
  alt: 'NeshLife factory and warehouse facility, modern industrial agricultural plant'
},
{
  src: "https://images.unsplash.com/photo-1593118370790-adc34cf8e8b0",
  alt: 'Large herd of cattle on open farmland, golden hour sunlight, wide open field'
},
{
  src: "https://img.rocket.new/generatedImages/rocket_gen_img_1ca0ac5f7-1769309661033.png",
  alt: 'Free-range chickens on a farm with green grass, daytime, natural farm environment'
},
{
  src: "https://images.unsplash.com/photo-1691576847070-1fe41f114b7d",
  alt: 'Fish farm aquaculture ponds with clear water, aerial view, agricultural setting'
}];


const stats = [
{ value: '28+', label: 'Years of Excellence', icon: 'TrophyIcon' },
{ value: '300+', label: 'Products', icon: 'CubeIcon' },
{ value: '50+', label: 'Countries', icon: 'GlobeAltIcon' },
{ value: '1M+', label: 'Happy Customers', icon: 'UserGroupIcon' }];


export default function HeroSection() {
  const headlineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = headlineRef.current;
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    const t = setTimeout(() => {
      el.style.transition = 'opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col pt-16 md:pt-18 overflow-hidden">
      {/* Background slideshow */}
      <div className="absolute inset-0 z-0">
        {heroSlides.map((slide, i) =>
        <div key={i} className="hero-slide absolute inset-0">
            <AppImage
            src={slide.src}
            alt={slide.alt}
            fill
            className="object-cover"
            priority={i === 0}
            unoptimized />
          
          </div>
        )}
        {/* Dark overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/20 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
      </div>

      {/* Hero Content */}
      <div className="relative z-20 flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full py-16 md:py-24">
          <div ref={headlineRef} className="max-w-2xl">
            <p className="text-sm font-semibold text-white/80 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-8 h-px bg-white/60 inline-block" />
              Trusted by Farmers. Backed by Science.
            </p>
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold leading-tight text-white mb-2" aria-label="NeshLife — Better Nutrition">
              Better Nutrition.
            </h1>
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold leading-tight text-gradient-green mb-6" style={{ WebkitTextStroke: '0px' }}>
              Better Life.
            </h1>
            <p className="text-base md:text-lg text-white/80 leading-relaxed mb-8 max-w-xl">
              NeshLife provides scientifically formulated animal nutrition solutions for better health, higher productivity, and sustainable farming. Discover the best cattle feed products globally.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md font-semibold text-sm hover:bg-accent transition-colors">
                
                <Icon name="CubeIcon" size={16} />
                Explore Products
              </Link>
              <Link
                href="/#about"
                className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white border border-white/30 px-6 py-3 rounded-md font-semibold text-sm hover:bg-white/25 transition-colors">
                
                Know More
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="relative z-20 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {stats.map((stat, i) =>
            <div
              key={stat.label}
              className="stats-bar-item relative flex items-center gap-3 px-4 py-5 md:py-6 border-r border-primary-foreground/20 last:border-r-0">
              
                <div className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center flex-shrink-0">
                  <Icon name={stat.icon as any} size={18} className="text-primary-foreground/80" />
                </div>
                <div>
                  <div className="font-display text-2xl md:text-3xl font-bold text-primary-foreground leading-none">
                    {stat.value}
                  </div>
                  <div className="text-xs text-primary-foreground/60 mt-0.5">{stat.label}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>);

}
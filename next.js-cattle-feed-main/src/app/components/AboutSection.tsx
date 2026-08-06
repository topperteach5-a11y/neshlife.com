'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/Appimage';
import Icon from '@/components/ui/Appicon';

const whyChoose = [
{
  icon: 'BeakerIcon',
  title: 'Science Backed',
  desc: 'Products developed with advanced research and trials.',
  color: 'text-primary'
},
{
  icon: 'BoltIcon',
  title: 'High Performance',
  desc: 'Better growth, higher yield and improved immunity.',
  color: 'text-accent'
},
{
  icon: 'GlobeAltIcon',
  title: 'Global Standards',
  desc: 'Manufactured in world class facilities.',
  color: 'text-primary'
},
{
  icon: 'UserGroupIcon',
  title: 'Farmer Trusted',
  desc: 'Preferred by millions of farmers across the globe.',
  color: 'text-accent'
}];


const aboutFeatures = [
'Science driven solutions',
'Global presence in 50+ countries',
'Quality & safety assurance',
'Customer centric approach'];


export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const items = el.querySelectorAll('.about-animate');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            entry.target.classList.remove('is-hidden');
          }
        });
      },
      { threshold: 0.1 }
    );
    items.forEach((item) => {
      item.classList.add('animate-on-scroll', 'is-hidden');
      observer.observe(item);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* About CattleFeed */}
          <div className="about-animate">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">About Us</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              About NeshLife
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-5">
              NeshLife is a leading global animal feed company with over 28 years of expertise in manufacturing the best cattle feed products, poultry feed, and aqua feed. We deliver innovative and sustainable solutions that improve animal health, productivity, and farmer profitability globally.
            </p>
            <ul className="space-y-2 mb-6">
              {aboutFeatures.map((f) =>
              <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                  <Icon name="CheckCircleIcon" size={16} className="text-primary flex-shrink-0" variant="solid" />
                  {f}
                </li>
              )}
            </ul>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-md text-sm font-semibold hover:bg-accent transition-colors">
              
              Know More About Us
              <Icon name="ArrowRightIcon" size={14} />
            </Link>
          </div>

          {/* Company Image */}
          <div className="about-animate relative">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border">
              <AppImage
                src="/assets/images/hero_slide_1.jpg"
                alt="Modern NeshLife manufacturing facility building, green corporate headquarters, bright daytime exterior"
                fill
                className="object-cover"
                unoptimized />
              
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
              <div className="absolute bottom-4 left-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg">
                <div className="font-display font-bold text-lg">28+</div>
                <div className="text-xs text-primary-foreground/80">Years of Excellence</div>
              </div>
            </div>
          </div>

          {/* Why Choose */}
          <div className="about-animate">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">Our Strengths</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              Why Choose NeshLife?
            </h2>
            <div className="space-y-5">
              {whyChoose.map((item) =>
              <div key={item.title} className="flex gap-4 group">
                  <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 group-hover:bg-secondary transition-colors ${item.color}`}>
                    <Icon name={item.icon as any} size={18} className={item.color} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm mb-0.5">{item.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Manufacturing Section */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8 bg-muted rounded-2xl overflow-hidden">
          <div className="p-8 md:p-10 about-animate flex flex-col justify-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">Manufacturing Excellence</p>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
              Our Manufacturing
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              State-of-the-art infrastructure and stringent quality control at every stage of production.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {['Raw Material Selection', 'Advanced Processing', 'Quality Testing', 'Packaging & Dispatch'].map((step, i) =>
              <div key={step} className="text-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                    <span className="text-primary font-bold text-sm">{i + 1}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-tight">{step}</p>
                </div>
              )}
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-md text-sm font-semibold hover:bg-accent transition-colors w-fit">
              
              Take a Facility Tour
              <Icon name="ArrowRightIcon" size={14} />
            </Link>
          </div>
          <div className="about-animate relative min-h-[280px]">
            <AppImage
              src="/assets/images/computerized-cattle-feed-plant-500x500.webp"
              alt="Modern animal feed manufacturing plant interior, stainless steel equipment, bright industrial facility, workers in safety gear"
              fill
              className="object-cover"
              unoptimized />
            
          </div>
        </div>
      </div>
    </section>);

}
'use client';

import React, { useEffect, useRef } from 'react';
import Icon from '@/components/ui/Appicon';

const certifications = [
  { name: 'WHO-GMP Certified', icon: 'ShieldCheckIcon', desc: 'World Health Organization Good Manufacturing Practice' },
  { name: 'ISO 9001:2015', icon: 'StarIcon', desc: 'International Organization for Standardization' },
  { name: 'FSSAI Approved', icon: 'CheckBadgeIcon', desc: 'Food Safety and Standards Authority of India' },
  { name: 'HACCP Certified', icon: 'LockClosedIcon', desc: 'Hazard Analysis Critical Control Points' },
  { name: 'Export Certified', icon: 'GlobeAltIcon', desc: 'Certified for international export standards' },
];

export default function CertificationsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const items = el.querySelectorAll('.cert-animate');
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
    items.forEach(item => {
      item.classList.add('animate-on-scroll', 'is-hidden');
      observer.observe(item);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-14 md:py-16 bg-secondary border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 cert-animate">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
            NeshLife Quality. Global Standards.
          </h2>
          <p className="text-muted-foreground text-sm">Certified by the world&apos;s most recognized quality bodies.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 cert-animate">
          {certifications.map((cert, i) => (
            <div
              key={cert.name}
              className="flex flex-col items-center text-center p-5 bg-white rounded-xl border border-border hover:border-primary hover:shadow-md transition-all group"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
                <Icon name={cert.icon as any} size={24} className="text-primary" />
              </div>
              <h3 className="font-semibold text-foreground text-sm leading-tight mb-1">{cert.name}</h3>
              <p className="text-xs text-muted-foreground leading-snug hidden sm:block">{cert.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
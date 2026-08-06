'use client';

import React, { useState, useEffect } from 'react';
import AppImage from '@/components/ui/Appimage';
import Icon from '@/components/ui/Appicon';

interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  rating: number;
  image: string;
  alt: string;
}

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [active, setActive] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const response = await fetch('/api/testimonials');
        const data = await response.json();
        setTestimonials(data);
      } catch (error) {
        console.error('Failed to load testimonials:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTestimonials();
  }, []);

  if (isLoading || testimonials.length === 0) {
    return null;
  }

  const goTo = (idx: number) => {
    setActive((idx + testimonials.length) % testimonials.length);
  };

  const t = testimonials[active];

  return (
    <section id="testimonials" className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-2">Testimonials</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            What Farmers Say
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Image */}
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-border max-w-xs mx-auto w-full">
              <AppImage
                src={t.image}
                alt={t.alt}
                fill
                className="object-cover transition-opacity duration-500"
                unoptimized />
              
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-3">
                <div className="flex gap-0.5 mb-1">
                  {Array.from({ length: t.rating }).map((_, i) =>
                  <Icon key={i} name="StarIcon" size={14} className="text-yellow-400" variant="solid" />
                  )}
                </div>
                <p className="font-semibold text-foreground text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>

            {/* Quote */}
            <div>
              <div className="text-6xl text-primary/20 font-display leading-none mb-4">&ldquo;</div>
              <blockquote className="font-display text-xl md:text-2xl font-medium text-foreground leading-relaxed mb-8">
                {t.quote}
              </blockquote>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => goTo(active - 1)}
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted hover:border-primary transition-colors"
                  aria-label="Previous testimonial">
                  
                  <Icon name="ChevronLeftIcon" size={16} className="text-muted-foreground" />
                </button>
                <div className="flex gap-2">
                  {testimonials.map((_, i) =>
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className={`rounded-full transition-all ${i === active ? 'w-6 h-2.5 bg-primary' : 'w-2.5 h-2.5 bg-border hover:bg-muted-foreground'}`}
                    aria-label={`Go to testimonial ${i + 1}`} />

                  )}
                </div>
                <button
                  onClick={() => goTo(active + 1)}
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted hover:border-primary transition-colors"
                  aria-label="Next testimonial">
                  
                  <Icon name="ChevronRightIcon" size={16} className="text-muted-foreground" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
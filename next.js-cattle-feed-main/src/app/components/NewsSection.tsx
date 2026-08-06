'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/Appimage';
import Icon from '@/components/ui/Appicon';

interface NewsPost {
  id: string;
  tag: string;
  title: string;
  date: string;
  image: string;
  alt: string;
  excerpt: string;
}

const tagColors: Record<string, string> = {
  News: 'bg-primary/10 text-primary',
  Article: 'bg-accent/10 text-accent',
  Event: 'bg-yellow-100 text-yellow-700',
  Update: 'bg-blue-100 text-blue-700',
};

export default function NewsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [news, setNews] = useState<NewsPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch news from API
  useEffect(() => {
    const loadNews = async () => {
      try {
        const response = await fetch('/api/news');
        const data = await response.json();
        setNews(data);
      } catch (error) {
        console.error('Failed to load news:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadNews();
  }, []);

  // Scroll animation
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const items = el.querySelectorAll('.news-animate');
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
  }, [news]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  if (isLoading || news.length === 0) {
    return null;
  }

  return (
    <section ref={sectionRef} id="news" className="py-16 md:py-20 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-10 news-animate">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-2">Updates</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Latest News & Insights
            </h2>
          </div>
          <Link
            href="/news"
            className="hidden sm:flex items-center gap-1.5 text-primary text-sm font-semibold hover:gap-3 transition-all">
            
            View All News
            <Icon name="ArrowRightIcon" size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.slice(0, 3).map((item, i) =>
          <article
            key={item.id}
            className="news-animate bg-white rounded-xl border border-border overflow-hidden group product-card-hover"
            style={{ transitionDelay: `${i * 80}ms` }}>
            
              <div className="relative aspect-[16/9] overflow-hidden">
                <AppImage
                src={item.image}
                alt={item.alt}
                fill
                className="object-cover image-zoom-inner"
                unoptimized />
              
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${tagColors[item.tag] || 'bg-gray-100 text-gray-600'}`}>
                    {item.tag}
                  </span>
                  <span className="text-xs text-muted-foreground">{formatDate(item.date)}</span>
                </div>
                <h3 className="font-semibold text-foreground text-sm leading-snug mb-3 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <Link
                href={`/news/${item.id}`}
                className="flex items-center gap-1 text-primary text-xs font-semibold hover:gap-2 transition-all">
                
                  Read More
                  <Icon name="ArrowRightIcon" size={12} />
                </Link>
              </div>
            </article>
          )}
        </div>

        <div className="text-center mt-6 sm:hidden news-animate">
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 text-primary text-sm font-semibold">
            
            View All News
            <Icon name="ArrowRightIcon" size={14} />
          </Link>
        </div>
      </div>
    </section>);

}
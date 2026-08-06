import React from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/Appimage';
import Icon from '@/components/ui/Appicon';
import { promises as fs } from 'fs';
import path from 'path';

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

async function getNews() {
  const newsPath = path.join(process.cwd(), 'src', 'data', 'news.json');
  try {
    const data = await fs.readFile(newsPath, 'utf-8');
    return JSON.parse(data) as NewsPost[];
  } catch (error) {
    console.error('Error reading news:', error);
    return [];
  }
}

export const metadata = {
  title: 'News & Insights | NeshLife',
  description: 'Stay updated with the latest news, articles, and events from NeshLife.',
};

export default async function NewsPage() {
  const news = await getNews();

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

  return (
    <div className="pt-24 pb-16 md:pt-32 md:pb-24 bg-muted min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Link 
          href="/" 
          className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-border shadow-sm text-muted-foreground font-medium text-sm hover:text-primary hover:border-primary/30 hover:shadow-md transition-all duration-300 mb-8"
        >
          <span className="transform group-hover:-translate-x-1 transition-transform duration-300 flex items-center">
            <Icon name="ArrowLeftIcon" size={16} />
          </span>
          Back to Home
        </Link>
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent mb-3">Updates</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
            Our Blog & News
          </h1>
          <p className="text-muted-foreground text-lg">
            Stay informed with the latest updates on animal nutrition, farming practices, and our community events.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item, i) => (
            <article
              key={item.id}
              className="bg-white rounded-2xl border border-border overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col h-full"
            >
              <Link href={`/news/${item.id}`} className="block relative aspect-[16/10] overflow-hidden shrink-0">
                <AppImage
                  src={item.image}
                  alt={item.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  unoptimized
                />
              </Link>
              <div className="p-6 md:p-8 flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${tagColors[item.tag] || 'bg-gray-100 text-gray-600'}`}>
                    {item.tag}
                  </span>
                  <span className="text-sm text-muted-foreground font-medium">{formatDate(item.date)}</span>
                </div>
                <h2 className="font-semibold text-foreground text-xl leading-tight mb-4 group-hover:text-primary transition-colors">
                  <Link href={`/news/${item.id}`}>{item.title}</Link>
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                  {item.excerpt}
                </p>
                <Link
                  href={`/news/${item.id}`}
                  className="inline-flex items-center gap-2 text-primary text-sm font-bold hover:gap-3 transition-all mt-auto"
                >
                  Read Full Article
                  <Icon name="ArrowRightIcon" size={16} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

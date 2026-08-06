import React from 'react';
import { notFound } from 'next/navigation';
import { promises as fs } from 'fs';
import path from 'path';
import AppImage from '@/components/ui/Appimage';
import Link from 'next/link';
import Icon from '@/components/ui/Appicon';

interface NewsPost {
  id: string;
  tag: string;
  title: string;
  date: string;
  image: string;
  alt: string;
  excerpt: string;
  content?: string;
}

async function getNews() {
  const newsPath = path.join(process.cwd(), 'src', 'data', 'news.json');
  try {
    const data = await fs.readFile(newsPath, 'utf-8');
    return JSON.parse(data) as NewsPost[];
  } catch (error) {
    return [];
  }
}

async function getNewsPost(id: string) {
  const news = await getNews();
  return news.find(p => p.id === id);
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const post = await getNewsPost(params.id);
  if (!post) {
    return { title: 'Post Not Found' };
  }
  return {
    title: `${post.title} | NeshLife News`,
    description: post.excerpt,
  };
}

export default async function NewsPostPage({ params }: { params: { id: string } }) {
  const post = await getNewsPost(params.id);

  if (!post) {
    notFound();
  }

  // Generate some dummy content if it doesn't exist
  const dummyContent = `
    <p>Nutrition is a critical pillar in animal husbandry, playing an essential role not just in growth and milk production, but also in ensuring long-term health and disease resistance. As we continue to innovate at NeshLife, we focus extensively on formulating feeds that offer a balanced profile of vitamins, minerals, and essential nutrients.</p>
    
    <h2>The Importance of Balanced Diet</h2>
    <p>Animals, much like humans, require a diverse range of nutrients to maintain a robust immune system. A deficiency in key minerals such as zinc, copper, or selenium can lead to a compromised immune response, making livestock more susceptible to common infections.</p>
    
    <ul>
      <li><strong>Zinc:</strong> Crucial for maintaining the integrity of the skin and mucosal membranes, which act as the first line of defense.</li>
      <li><strong>Copper:</strong> Plays a vital role in white blood cell function.</li>
      <li><strong>Selenium:</strong> Works in tandem with Vitamin E as a powerful antioxidant, protecting cells from damage.</li>
    </ul>
    
    <h2>Looking Ahead</h2>
    <p>Our commitment to advancing animal nutrition goes beyond just meeting basic dietary requirements. We are continuously researching and developing feed solutions that proactively enhance the health and vitality of your livestock, ensuring a sustainable and prosperous future for farmers everywhere.</p>
  `;

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <article className="min-h-screen bg-background pt-24 pb-16 md:pt-32">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <Link 
          href="/news" 
          className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-border shadow-sm text-muted-foreground font-medium text-sm hover:text-primary hover:border-primary/30 hover:shadow-md transition-all duration-300 mb-8"
        >
          <span className="transform group-hover:-translate-x-1 transition-transform duration-300 flex items-center">
            <Icon name="ArrowLeftIcon" size={16} />
          </span>
          Back to News
        </Link>
        
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-sm font-bold px-3 py-1 bg-primary/10 text-primary rounded-full">
              {post.tag}
            </span>
            <span className="text-muted-foreground font-medium">{formatDate(post.date)}</span>
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground leading-tight mb-6">
            {post.title}
          </h1>
        </div>
      </div>

      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 mb-12">
        <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden shadow-xl">
          <AppImage
            src={post.image}
            alt={post.alt}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="prose prose-lg prose-primary max-w-none prose-headings:font-display prose-headings:font-bold prose-img:rounded-xl prose-a:text-primary hover:prose-a:text-primary/80">
          <p className="text-xl text-muted-foreground font-medium leading-relaxed mb-8 border-l-4 border-primary pl-6">
            {post.excerpt}
          </p>
          <div 
            dangerouslySetInnerHTML={{ __html: post.content || dummyContent }} 
            className="mt-8 space-y-6 text-foreground leading-relaxed [&>h2]:text-2xl [&>h2]:mt-10 [&>h2]:mb-4 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-2"
          />
        </div>
      </div>
    </article>
  );
}

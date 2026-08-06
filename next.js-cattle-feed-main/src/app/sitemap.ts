import { MetadataRoute } from 'next';
import fs from 'fs/promises';
import path from 'path';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  // 1. Core static routes
  const routes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/products`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/news`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/faqs`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/checkout`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];

  // 2. Dynamic News Articles
  try {
    const newsPath = path.join(process.cwd(), 'src', 'data', 'news.json');
    const newsData = await fs.readFile(newsPath, 'utf-8');
    const articles = JSON.parse(newsData);
    
    // Add each news article to the sitemap
    articles.forEach((article: any) => {
      routes.push({
        url: `${baseUrl}/news/${article.id}`,
        lastModified: new Date(article.date || Date.now()),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    });
  } catch (error) {
    console.error('Error generating news sitemap:', error);
  }

  return routes;
}
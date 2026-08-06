import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const newsPath = path.join(process.cwd(), 'src', 'data', 'news.json');

async function readNews() {
  try {
    const data = await fs.readFile(newsPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading news:', error);
    return [];
  }
}

async function writeNews(data: any) {
  try {
    await fs.writeFile(newsPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing news:', error);
    throw error;
  }
}

export async function GET() {
  try {
    const news = await readNews();
    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read news' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const news = await readNews();
    const newPost = await request.json();

    newPost.id = Date.now().toString();
    // Ensure date is a valid ISO string with time
    if (!newPost.date) {
      newPost.date = new Date().toISOString();
    } else {
      try {
        newPost.date = new Date(newPost.date).toISOString();
      } catch (e) {
        // Fallback if parsing fails
        newPost.date = new Date().toISOString();
      }
    }
    news.unshift(newPost); // Add newest first

    await writeNews(news);

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create news post' }, { status: 500 });
  }
}

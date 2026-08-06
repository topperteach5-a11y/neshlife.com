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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const news = await readNews();
    const updatedData = await request.json();
    const { id } = await params;

    const index = news.findIndex((n: any) => n.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'News post not found' }, { status: 404 });
    }

    if (updatedData.date) {
      try {
        updatedData.date = new Date(updatedData.date).toISOString();
      } catch (e) {
        // Leave as is if unparseable
      }
    }

    news[index] = { ...news[index], ...updatedData, id };
    await writeNews(news);

    return NextResponse.json(news[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update news post' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    let news = await readNews();
    const { id } = await params;

    const initialLength = news.length;
    news = news.filter((n: any) => n.id !== id);

    if (news.length === initialLength) {
      return NextResponse.json({ error: 'News post not found' }, { status: 404 });
    }

    await writeNews(news);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete news post' }, { status: 500 });
  }
}

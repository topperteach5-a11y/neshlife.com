import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file || !file.name) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = join(process.cwd(), 'public', 'uploads');
    
    // Ensure uploads directory exists
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch {
      // Directory already exists
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = `${uniqueSuffix}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
    const filepath = join(uploadDir, filename);

    await writeFile(filepath, buffer);
    const imageUrl = `/uploads/${filename}`;

    return NextResponse.json({ url: imageUrl, success: true }, { status: 201 });
  } catch (error) {
    console.error('Error uploading image file:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminSession } from '@/lib/auth';
import { writeFile, mkdir, unlink } from 'fs/promises';
import { join } from 'path';

export async function GET(request: NextRequest) {
  // Verify admin authentication
  const session = verifyAdminSession(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // Verify admin authentication
  const session = verifyAdminSession(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    
    // Parse form data
    const name = formData.get('name') as string;
    const category = formData.get('category') as string;
    const weight = formData.get('weight') as string;
    const description = formData.get('description') as string || '';
    const featuresStr = formData.get('features') as string || '';
    const packSizesStr = formData.get('packSizes') as string || '';
    const stockStr = formData.get('stock') as string;
    const priceStr = formData.get('price') as string;
    const imageFile = formData.get('image') as File | null;
    
    if (!name || !category || !weight) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const stock = stockStr ? parseInt(stockStr, 10) : 0;
    const price = priceStr ? parseFloat(priceStr) : 0;
    const features = featuresStr.split(',').map(f => f.trim()).filter(f => f);
    const packSizes = packSizesStr.split(',').map(s => s.trim()).filter(s => s);
    const status = stock > 20 ? 'Active' : 'Low Stock';

    let imageUrl = null;

    // Handle image upload
    if (imageFile && imageFile.name) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Create uploads folder if needed
      const uploadDir = join(process.cwd(), 'public', 'uploads');
      await mkdir(uploadDir, { recursive: true });

      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const filename = `${uniqueSuffix}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
      const filepath = join(uploadDir, filename);
      
      await writeFile(filepath, buffer);
      imageUrl = `/uploads/${filename}`;
    }

    // Save to database
    const product = await prisma.product.create({
      data: {
        name,
        category,
        weight,
        description,
        features,
        packSizes: packSizes.length > 0 ? packSizes : [weight],
        stock,
        price,
        status,
        imageUrl,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Failed to create product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  // Verify admin authentication
  const session = verifyAdminSession(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();

    const id = parseInt(formData.get('id') as string, 10);
    const name = formData.get('name') as string;
    const category = formData.get('category') as string;
    const weight = formData.get('weight') as string;
    const description = (formData.get('description') as string) || '';
    const featuresStr = (formData.get('features') as string) || '';
    const packSizesStr = (formData.get('packSizes') as string) || '';
    const stockStr = formData.get('stock') as string;
    const priceStr = formData.get('price') as string;
    const imageFile = formData.get('image') as File | null;

    if (!id || !name || !category || !weight) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const stock = stockStr ? parseInt(stockStr, 10) : 0;
    const price = priceStr ? parseFloat(priceStr) : 0;
    const features = featuresStr.split(',').map(f => f.trim()).filter(f => f);
    const packSizes = packSizesStr.split(',').map(s => s.trim()).filter(s => s);
    const status = stock > 20 ? 'Active' : 'Low Stock';

    let imageUrl: string | undefined;

    if (imageFile && imageFile.name && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadDir = join(process.cwd(), 'public', 'uploads');
      await mkdir(uploadDir, { recursive: true });
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const filename = `${uniqueSuffix}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
      const filepath = join(uploadDir, filename);
      await writeFile(filepath, buffer);
      imageUrl = `/uploads/${filename}`;
    }

    const updateData: any = {
      name,
      category,
      weight,
      description,
      features,
      packSizes: packSizes.length > 0 ? packSizes : [weight],
      stock,
      price,
      status,
    };

    if (imageUrl) {
      updateData.imageUrl = imageUrl;
    }

    if (imageUrl) {
      const existing = await prisma.product.findUnique({ where: { id } });
      if (existing?.imageUrl && existing.imageUrl !== imageUrl && existing.imageUrl.startsWith('/uploads/')) {
        const oldFile = join(process.cwd(), 'public', existing.imageUrl.replace(/^[\/]+/, ''));
        unlink(oldFile).catch(() => {});
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Failed to update product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  // Verify admin authentication
  const session = verifyAdminSession(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '', 10);

    if (!id) {
      return NextResponse.json({ error: 'Missing product id' }, { status: 400 });
    }

    const product = await prisma.product.findUnique({ where: { id } });
    if (product?.imageUrl && product.imageUrl.startsWith('/uploads/')) {
      const oldFile = join(process.cwd(), 'public', product.imageUrl.replace(/^[\/]+/, ''));
      unlink(oldFile).catch(() => {});
    }

    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}

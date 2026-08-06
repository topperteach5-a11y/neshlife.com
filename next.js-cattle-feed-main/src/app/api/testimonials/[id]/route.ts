import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const testimonialPath = path.join(process.cwd(), 'src', 'data', 'testimonials.json');

async function readTestimonials() {
  try {
    const data = await fs.readFile(testimonialPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading testimonials:', error);
    return [];
  }
}

async function writeTestimonials(data: any) {
  try {
    await fs.writeFile(testimonialPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing testimonials:', error);
    throw error;
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const testimonials = await readTestimonials();
    const updatedData = await request.json();
    const { id } = await params;
    
    const index = testimonials.findIndex((t: any) => t.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }
    
    testimonials[index] = { ...testimonials[index], ...updatedData, id };
    await writeTestimonials(testimonials);
    
    return NextResponse.json(testimonials[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    let testimonials = await readTestimonials();
    const { id } = await params;
    
    const initialLength = testimonials.length;
    testimonials = testimonials.filter((t: any) => t.id !== id);
    
    if (testimonials.length === initialLength) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }
    
    await writeTestimonials(testimonials);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 });
  }
}

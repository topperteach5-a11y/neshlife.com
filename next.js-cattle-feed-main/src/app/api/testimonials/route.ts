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

export async function GET() {
  try {
    const testimonials = await readTestimonials();
    return NextResponse.json(testimonials);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read testimonials' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const testimonials = await readTestimonials();
    const newTestimonial = await request.json();
    
    newTestimonial.id = Date.now().toString();
    testimonials.push(newTestimonial);
    
    await writeTestimonials(testimonials);
    
    return NextResponse.json(newTestimonial, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
  }
}

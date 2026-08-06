import { NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';

export async function GET(request: Request) {
  const session = verifyAdminSession(request);

  if (session) {
    return NextResponse.json({
      authenticated: true,
      email: session.email,
    });
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}

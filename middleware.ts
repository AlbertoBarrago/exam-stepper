import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;

async function verifyToken(token: string) {
  if (!PRIVATE_KEY) {
    console.error('CRITICAL: JWT_PRIVATE_KEY is not set in environment variables.');
    return false;
  }
  try {
    await jwtVerify(token, new TextEncoder().encode(PRIVATE_KEY));
    return true;
  } catch (err) {
    console.error('Token verification failed:', err);
    return false;
  }
}

export async function middleware(request: NextRequest) {
  console.log(`--- Middleware triggered for path: ${request.nextUrl.pathname} ---`);

  const token = request.cookies.get('token')?.value;

  if (!token || !(await verifyToken(token))) {
    console.log('Token invalid or not found. Redirecting to homepage.');
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  console.log('Token is valid. Allowing request to proceed.');
  return NextResponse.next();
}

export const config = {
  matcher: '/exam/:path*',
};

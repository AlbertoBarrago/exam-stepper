import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;

    const protectedPaths = ['/exam'];
    const { pathname } = request.nextUrl;

    if (protectedPaths.some(path => pathname.startsWith(path))) {
        if (!token) {
            return NextResponse.redirect(new URL('/', request.url));
        }
        // Optionally: call verification API to check if the token is still valid (synchronous check, e.g., database or cache)
    }

    return NextResponse.next();
}
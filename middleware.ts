import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase';

export async function middleware(request: NextRequest) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (data.user) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = '/login';
  return NextResponse.redirect(url);
}

export const config = {
  matcher: '/exam/:path*',
};

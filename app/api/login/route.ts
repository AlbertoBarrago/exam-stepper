import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: username,
      password: password,
    });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    const response = NextResponse.json({ success: true, user: data.user });

    if (data.session) {
      response.cookies.set('supabase-auth-token', data.session.access_token, {
        httpOnly: true,
        path: '/',
      });
    }

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: `Internal Server Error , ${error}` },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase';

export async function POST(req: NextRequest) {
  const { username, password, displayName } = await req.json();
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email: username,
    password: password,
    options: {
      data: {
        display_name: displayName,
      },
    },
  });

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, user: data.user });
}

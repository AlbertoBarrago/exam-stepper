import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: `Internal Server Error , ${error}` },
      { status: 500 }
    );
  }
}

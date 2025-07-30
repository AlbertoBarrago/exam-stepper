import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { z } from 'zod';
import { UserData } from '@/types/userTypes';
import { createClient } from '@/utils/supabase';

const PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;

const UserSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export async function POST(request: Request) {
  if (!PRIVATE_KEY) {
    return NextResponse.json({ error: 'JWT_PRIVATE_KEY is not set' }, { status: 500 });
  }

  const body = await request.json();
  const validationResult = UserSchema.safeParse(body);

  if (!validationResult.success) {
    return NextResponse.json(validationResult.error, { status: 400 });
  }

  const { username, password } = validationResult.data;

  try {
    const supabase = await createClient();
    const { data: users, error: selectError } = await supabase
      .from('users')
      .select('id, username, email, registration_date, last_login')
      .eq('username', username)
      .eq('password', password);

    if (selectError) {
      throw selectError;
    }

    if (!users || users.length === 0) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const user: UserData = users[0];

    const { error: updateError } = await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id);

    if (updateError) {
      throw updateError;
    }

    const token = await new SignJWT({ username: user.username, id: user.id })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(new TextEncoder().encode(PRIVATE_KEY));

    const response = NextResponse.json({ success: true, user });
    response.cookies.set('token', token, { httpOnly: true, path: '/' });
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

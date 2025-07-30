import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { z } from 'zod';
import { query } from '@/lib/db';
import { UserData } from '@/types/userTypes';

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
    const users = await query<UserData[]>({
      query:
        'SELECT id, username, email, registration_date, last_login FROM users WHERE username = ? AND password = ?',
      values: [username, password],
    });

    if (users.length === 0) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const user: UserData = users[0];

    // Update last_login timestamp
    await query({
      query: 'UPDATE users SET last_login = NOW() WHERE id = ?',
      values: [user.id],
    });

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

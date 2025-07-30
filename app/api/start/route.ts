import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { UserDataSchema } from '@/types/zodValidation/userTypes.zod';

const PRIVATE_KEY = process.env.JWT_PRIVATE_KEY as string;

const mockUserData = {
  name: 'John',
  surname: 'Doe',
  email: 'jhon@gmail.com',
  interceptId: '123456789',
};

async function createMockJWT(payload: object) {
  const secret = new TextEncoder().encode(PRIVATE_KEY);
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(secret);
}

export async function POST() {
  const validationResult = UserDataSchema.safeParse(mockUserData);

  if (!validationResult.success) {
    return NextResponse.json(validationResult.error, { status: 400 });
  }

  const token = await createMockJWT(mockUserData);
  const userData = { ...mockUserData, token };
  const response = NextResponse.json({ userData });

  response.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    path: '/',
    maxAge: 60,
  });

  return response;
}

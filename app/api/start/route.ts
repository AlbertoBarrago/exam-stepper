import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

const PRIVATE_KEY = process.env.JWT_PRIVATE_KEY as string;

const mockUserData = {
    name: 'John',
    surname: 'Doe',
    email: 'jhon@gmail.com',
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
    const token = await createMockJWT(mockUserData);
    const userData = { ...mockUserData, token };
    return NextResponse.json({ userData });
}
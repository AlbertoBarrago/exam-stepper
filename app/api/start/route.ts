import { NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';

const mockUserData = {
    name: 'John',
    surname: 'Doe',
    email: 'jhon@gmail.com',
    token: uuid()
}

export async function POST() {
    const userData = mockUserData;
    return NextResponse.json({ userData });
}
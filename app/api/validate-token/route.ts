import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const PRIVATE_KEY = process.env.JWT_PRIVATE_KEY as string;

const isValidToken = async (token: string) => {
    try {
        if (!PRIVATE_KEY) {
            console.error('No private key found');
            return false;
        }
        const { payload } = await jwtVerify(token, new TextEncoder().encode(PRIVATE_KEY));
        // TODO: Optionally, you could check claims from payload here
        return true;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
        return false;
    }
}

export async function POST(request: NextRequest) {
    const authHeader = request.headers.get('authorization');
    let token;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.replace('Bearer ', '');
    } else {
        token = request.cookies.get('token')?.value;
    }

    if (!token || !(await isValidToken(token))) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ success: true });
}
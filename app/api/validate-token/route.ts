import { NextRequest, NextResponse } from 'next/server';


const isValidToken = (token: string) => {
    return !!token;
}

export async function POST(request: NextRequest) {
    const authHeader = request.headers.get('authorization');
    let token;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.replace('Bearer ', '');
    } else {
        token = request.cookies.get('token')?.value;
    }

    if (!token  || !isValidToken(token)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({
        success: true
    });
}
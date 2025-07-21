import { NextRequest, NextResponse } from 'next/server';


const isValidToken = (token: string) => {
    return true;
}

export async function POST(request: NextRequest) {
    const authHeader = request.headers.get('authorization');
    let token = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.replace('Bearer ', '');
    } else {
        token = request.cookies.get('token')?.value;
    }

    if (!token  || !isValidToken(token)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message, nextStep, userResponse } = await request.json();

    return NextResponse.json({
        success: true,
        msg: message,
        nextStep,
        userResponse
    });
}
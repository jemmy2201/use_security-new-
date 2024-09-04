// app/api/auth/callback/singpass/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {

    console.log('inside callback singpass custom route');
    const url = new URL(request.url);
    const code = url.searchParams.get('code');

    if (!code) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Forward the code to your token API route
    const tokenResponse = await fetch('http://localhost:3000/api/auth/singpass-token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
    });

    const { redirectUrl } = await tokenResponse.json();

    return NextResponse.redirect(new URL(redirectUrl, request.url));
}

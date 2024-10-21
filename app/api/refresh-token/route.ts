import { NextRequest, NextResponse } from 'next/server';
import { JWTPayload } from 'jose'
import {encrypt, decrypt} from '../../../lib/session';
import { cookies } from 'next/headers';

export interface SessionPayload extends JWTPayload {
    userId?: string;
    expiresAt?: Date;
    userToken?: string;
}
export async function POST(req: NextRequest) {
    try {
        const sessionOldValue: SessionPayload = await decrypt(cookies().get('session')?.value);
        if (!sessionOldValue) {
            return NextResponse.json({ error: 'No token' }, { status: 401 });
        }
        const expiresAt = new Date(Date.now() + 45 * 60 * 1000);
        const userId = sessionOldValue?.userId as string;
        const userToken = sessionOldValue?.userToken as string;
        const session = await encrypt({ userId, expiresAt, userToken });
    
        console.log('update session, cookie expiresAt:', expiresAt);
        const response = NextResponse.json({ token: session });

        response.cookies.set('session', session, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            expires: expiresAt,
            sameSite: 'lax',
            path: '/',
        });
        console.log('refresh session done');
        return response;
    } catch (error) {
        console.error('Token renewal failed:', error);
        return NextResponse.json({ error: 'Failed to refresh token' }, { status: 500 });
    }
}

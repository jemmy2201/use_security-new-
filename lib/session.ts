import 'server-only'
import { SignJWT, jwtVerify, JWTPayload, decodeJwt } from 'jose'
import { cookies } from 'next/headers'
import encryptDecrypt from '@/utils/encryptDecrypt';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export interface SessionPayload extends JWTPayload {
    userId?: string;
    expiresAt?: Date;
    userToken?: string;
}

const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

export async function encrypt(payload: SessionPayload) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('5min')
        .sign(encodedKey)
}

export async function decrypt(session: string | undefined = '') {
    console.log('decrypt: session:', session);

    const decoded = decodeJwt(session);
    console.log('Decoded JWT:', decoded);

    const currentTime = Math.floor(Date.now() / 1000);
    console.log('currentTime:', currentTime);
    if (decoded.exp && decoded.exp < currentTime) {
        throw new Error('JWT token has expired');
    }

    const { payload } = await jwtVerify(session, encodedKey, {
        algorithms: ['HS256'],
    });
    return payload;
}

export async function decryptSession(session: string | undefined = '') {
    try {
        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ['HS256'],
        })
        return payload
    } catch (error) {
        console.log('Failed to verify session')
    }

}

export async function createSession(userId: string, userToken: string) {
    const expiresAt = new Date(Date.now() + 70 * 24 * 60 * 60 * 1000)
    const session = await encrypt({ userId, expiresAt, userToken })

    console.log('expiresAt:', expiresAt);
    cookies().set('session', session, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    })
}

export async function updateSession() {
    const session = cookies().get('session')?.value
    const payload = await decrypt(session)

    if (!session || !payload) {
        return null
    }

    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    cookies().set('session', session, {
        httpOnly: true,
        secure: true,
        expires: expires,
        sameSite: 'lax',
        path: '/',
    })
}

export function deleteSession() {
    cookies().delete('session')
}

export async function getEncryptedNricFromSession(req: NextRequest) {
    const cookie = cookies().get('session')?.value

    if (!cookie) {
        // If there's no cookie, redirect to the login page
        return NextResponse.redirect(new URL('/signin', req.nextUrl.origin));
    }
    console.log('calling decryptdecryptdecryptdecryptdecryptdecryptdecrypt');
    console.log('calling decryptdecryptdecryptdecryptdecryptdecryptdecrypt');

    console.log('calling decryptdecryptdecryptdecryptdecryptdecryptdecrypt');

    console.log('calling decryptdecryptdecryptdecryptdecryptdecryptdecrypt');

    console.log('calling decryptdecryptdecryptdecryptdecryptdecryptdecrypt');

    console.log('calling decryptdecryptdecryptdecryptdecryptdecryptdecrypt');

    let session;
    try {
        session = await decrypt(cookie);
    } catch (error) {
        console.error('Decryption failed:');
        console.error('Decryption failed:');
        console.error('Decryption failed:');
        console.error('Decryption failed:');
        console.error('Decryption failed:', error);
        console.error('Decryption failed:', error);
        // Redirect to the login page if decryption fails
        return NextResponse.redirect(new URL('/signin', req.nextUrl.origin));
    }
    console.log('session user id:', session?.userId);
    return encryptDecrypt(session?.userId as string, 'encrypt');
}


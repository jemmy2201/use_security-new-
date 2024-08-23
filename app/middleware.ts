
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Middleware function to handle authentication
export default async function middleware(req: NextRequest) {
    const token = await getToken({ req });

    // Check if the request path is protected
    const protectedPaths = ['/protected/**', '/another-protected-route/**'];
    const isProtected = protectedPaths.some((path) => req.nextUrl.pathname.startsWith(path));

    if (isProtected && !token) {
        // Redirect to sign-in page if not authenticated
        const url = req.nextUrl.clone();
        url.pathname = '/sign-in';
        return NextResponse.redirect(url);
    }

    // Continue if authenticated or not protected
    return NextResponse.next();
}

// Configuration for matcher
export const config = {
    matcher: ['/protected/**', '/another-protected-route/**'],
};

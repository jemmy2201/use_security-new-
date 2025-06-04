import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from './lib/session'
import { cookies } from 'next/headers'
import { decryptSession } from './lib/session'

const protectedRoutes = ['/dashboard', '/myinfoterms', '/terms', '/complete',
  '/receipt', '/reschedule', 'resubmitphoto', 'updatedetails', 'firsttime']
const publicRoutes = ['/signin', '/']

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname

  if (path == '/api/jwks' || path == '/api/auth/signin/singpass' 
    || path == '/api/usesecurity/callback'
    || path == '/api/webhooks'
    || path == '/api/auth/csrf' 
    || path == '/api/auth/providers'
    || path == '/api/scheduler') {
    return NextResponse.next()
  }

  const isProtectedRoute = protectedRoutes.includes(path)
  const isPublicRoute = publicRoutes.includes(path)

  const cookie = cookies().get('session')?.value
  const session = await decryptSession(cookie)

  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL('/signin', req.nextUrl))
  }

  if (
    isPublicRoute &&
    session?.userId &&
    !req.nextUrl.pathname.startsWith('/homepage')
  ) {
    return NextResponse.redirect(new URL('/homepage', req.nextUrl))
  }

  return NextResponse.next()
}

// Routes Middleware should not run on
// export const config = {
//   matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
// }

export const config = {
  matcher: [
    '/api/:path*',
    '/dashboard/:path*',
  ],
};
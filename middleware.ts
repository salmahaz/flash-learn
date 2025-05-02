import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the token from cookies (recommended for SSR) or from headers
  const token = request.cookies.get('token')?.value;
  const isMobile = request.headers.get('user-agent')?.toLowerCase().includes('mobile');

  const publicPaths = ['/login', '/signup', '/api/login', '/api/users'];
  const isPublicPath = publicPaths.some((path) => request.nextUrl.pathname.startsWith(path));

  // Allow access to public paths
  if (isPublicPath) {
    // If user is already logged in and tries to access login/signup, redirect to home
    if (token && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup')) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // If no token, redirect to login
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    // Add a message to show on the login page
    loginUrl.searchParams.set('message', 'Please log in to access this page');
    return NextResponse.redirect(loginUrl);
  }

  // For mobile devices, ensure the token is also in localStorage
  if (isMobile) {
    const response = NextResponse.next();
    // Set a cookie that the client can use to sync with localStorage
    response.cookies.set('sync-token', token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
    return response;
  }

  return NextResponse.next();
}

// Specify the paths the middleware should run on
export const config = {
  matcher: [
    /*
      Match all routes except:
      - /_next (Next.js internals)
      - /api/auth (if you use next-auth)
      - /favicon.ico, /robots.txt, etc.
    */
    '/((?!_next|api/auth|favicon.ico|robots.txt).*)',
  ],
};
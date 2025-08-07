
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  const isPublicPath = pathname === '/ingresar';

  // If the user is authenticated and tries to access the login page, redirect to dashboard.
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If the user is not authenticated and tries to access a protected page, redirect to login.
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/ingresar', request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

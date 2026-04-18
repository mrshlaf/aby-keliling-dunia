import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Check our custom cookie instead of Supabase session
  const userId = req.cookies.get('aby_user_id')?.value;

  const protectedRoutes = [
    '/dashboard',
    '/contributions',
    '/polls',
    '/members'
  ];

  const isProtectedRoute = protectedRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  );

  // If trying to access protected route without session
  if (isProtectedRoute && !userId) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // If logged in and trying to go to login page
  if (userId && req.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/contributions/:path*', 
    '/polls/:path*', 
    '/members/:path*',
    '/login'
  ],
};

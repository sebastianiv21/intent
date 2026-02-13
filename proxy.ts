import { NextResponse, type NextRequest } from 'next/server';
import { auth } from '@/lib/auth';

// Protected app routes (require auth)
const PROTECTED_PATHS = [
  '/',
  '/transactions',
  '/budgets',
  '/recurring',
  '/insights',
  '/profile',
  '/onboarding',
];

// Auth pages (redirect to home if already logged in)
const AUTH_PATHS = ['/login', '/register'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const isProtected = PROTECTED_PATHS.some(path => pathname === path || pathname.startsWith(`${path}/`));
  const isAuthPage = AUTH_PATHS.includes(pathname);
  
  const session = await auth.api.getSession({ headers: request.headers });
  
  // No session + protected route → login
  if (!session && isProtected) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Has session + auth page → home (not onboarding, guard will handle that)
  if (session && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/transactions/:path*',
    '/budgets/:path*',
    '/recurring/:path*',
    '/insights/:path*',
    '/profile/:path*',
    '/onboarding/:path*',
    '/login',
    '/register',
  ],
};

import { NextResponse, type NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { financialProfile } from '@/lib/schema';
import { eq } from 'drizzle-orm';

// App routes requiring authentication and financial profile
const PROTECTED_PATHS = ['/', '/transactions', '/budgets', '/recurring', '/insights', '/profile'];
const AUTH_PATHS = ['/login', '/register'];

function matchesPath(pathname: string, paths: string[]): boolean {
  return paths.some(path => pathname === path || pathname.startsWith(`${path}/`));
}

async function hasFinancialProfile(userId: string): Promise<boolean> {
  const profile = await db.query.financialProfile.findFirst({
    where: eq(financialProfile.userId, userId),
  });
  return !!profile;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = matchesPath(pathname, PROTECTED_PATHS);
  const isAuthPage = AUTH_PATHS.includes(pathname);
  const isOnboarding = pathname === '/onboarding' || pathname.startsWith('/onboarding/');

  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    if (isProtected || isOnboarding) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  if (isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  const hasProfile = await hasFinancialProfile(session.user.id);

  if (isProtected && !hasProfile) {
    return NextResponse.redirect(new URL('/onboarding', request.url));
  }

  if (isOnboarding && hasProfile) {
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

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/create-blog', '/my-feed'];

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;

  if (pathname === '/') {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  if (protectedRoutes.includes(pathname)) {
    try {
      const response = await fetch(`${origin}/api/check-session`, {
        method: 'GET',
        headers: {
          cookie: request.headers.get('cookie') || '',
        },
      });

      const data = await response.json();

      if (!data.isAuthenticated) {
        return NextResponse.redirect(new URL('/auth?session=invalid', request.url));
      }
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL('/auth?session=error', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/auth', '/create-blog', '/my-feed'],
};

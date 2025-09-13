import { NextResponse, NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  console.log('🔥 middleware exec at:', request.nextUrl.pathname);

  const token = request.cookies.get('jwt')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/vouchers/:path*',
    '/account/:path*',
    // '/:path*',
  ],
};

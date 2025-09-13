import { NextResponse, NextRequest } from 'next/server';
import { getUserSessionByTokenService } from './app/(modules)/account/actions/services';
import moment from 'moment';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = request.cookies.get('jwt')?.value;

  if (!token) {
    return redirectToLogin(request); // clear cookie + redirect
  }

  const existSession = await getUserSessionByTokenService(token as string);

  const now = moment();
  const expiry = moment(existSession.expires_at);

  const isExpired = expiry?.isBefore(now); // already expired

  if (existSession.code !== 200 || isExpired) {
    return redirectToLogin(request); // clear cookie + redirect
  }

  return NextResponse.next();
}

function redirectToLogin(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/auth/login', request.url));

  // Expire the jwt cookie
  response.cookies.set('jwt', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(0), // 👈 set in the past
    path: '/',
  });

  return response;
}

export const config = {
  matcher: ['/((?!api|_next|static|favicon.ico|auth).*)'],
};

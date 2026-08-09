import { NextResponse } from 'next/server';

export function proxy(request) {
  const token = request.cookies.get('ecom_token')?.value;
  const path = request.nextUrl.pathname;

  const isDashboardPath = path.startsWith('/dashboard');
  const isUserPath = path.startsWith('/user');
  const isAuthPath = path === '/login' || path === '/register';

  if ((isDashboardPath || isUserPath) && !token) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', path);
    return NextResponse.redirect(url);
  }

  if (isAuthPath && token) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/user/:path*', '/login', '/register'],
};

export default proxy;

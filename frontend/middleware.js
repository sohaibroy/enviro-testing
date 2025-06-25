import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('role')?.value;

  const protectedPaths = [
    '/multi-step-form',
    '/chain-of-custody',
    '/equipment-rental',
    '/rental-cart',
    '/contact-page',
    '/admin-tools',
    '/checkout',
    '/admin-selection',
    '/manage-accounts',
    '/manage-orders',
    '/manage-equipment',
    '/manage-analtyes',
    '/manage-categories',
    '/manage-companies',
    '/manage-methods',
    '/manage-order-details',
    '/manage-pricing',
    '/manage-rental-details',
    '/manage-rentals',
    '/manage-transactions',
    '/quantity-selection',
    '/user-information',
    '/view-cart',
    '/get-estimate',
    '/method-selection',
    '/rental-cart',
    
  ];

  const path = request.nextUrl.pathname;
  const isProtected = protectedPaths.some((p) => path.startsWith(p));

  // Force no caching on protected paths
  const res = NextResponse.next();
  if (isProtected) {
    res.headers.set('Cache-Control', 'no-store');
  }

  //  Allow access if token exists
  if (token && (role === 'admin' || role === 'customer')) {
    return res;
  }

  //  No token and trying to access protected page — redirect
  if (isProtected && !token) {
    const redirect = NextResponse.redirect(new URL('/customer-login', request.url));
    redirect.headers.set('Cache-Control', 'no-store');
    return redirect;
  }

  return res;
}

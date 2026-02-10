import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { UserRole } from './config/navLinks';
import { ROUTE_PERMISSIONS } from './config/permissions';

const publicRoutes = ['/login', '/signup', '/forget-password', '/reset-password', '/'];

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;
    const userRole = (request.cookies.get('user_role')?.value) as UserRole;

    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));


    if (!token && !isPublicRoute) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (token && !userRole) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (token && (pathname.startsWith('/login') || pathname.startsWith('/signup'))) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (token && userRole) {
        const restrictedPath = Object.keys(ROUTE_PERMISSIONS)
            .find(route => pathname.startsWith(route));

        if (restrictedPath) {
            const allowedRoles = ROUTE_PERMISSIONS[restrictedPath];
            if (!allowedRoles.includes(userRole)) {
                return NextResponse.redirect(new URL('/dashboard', request.url));
            }
        }
    }


    return NextResponse.next();
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/profile/:path*',
        '/settings/:path*',
        '/cases/:path*',
        '/my-cases/:path*',
        '/my-student/:path*',
        '/pending-cases/:path*',
        '/add-case/:path*',
        '/login'
    ],
};
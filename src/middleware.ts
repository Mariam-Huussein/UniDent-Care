import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { UserRole } from './config/navLinks';
import { ROUTE_PERMISSIONS } from './config/permissions';

const publicRoutes = ['/login', '/signup', '/forget-password', '/'];

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const userRole = request.cookies.get('user_role')?.value as UserRole;
    const { pathname } = request.nextUrl;

    const isPublicRoute = publicRoutes.some(route =>
        route === '/' ? pathname === '/' : pathname.startsWith(route)
    );

    if (!token && !isPublicRoute) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (token && userRole && isPublicRoute && (pathname === '/login' || pathname === '/signup' || pathname === '/')) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (token && userRole) {
        const restrictedPath = Object.keys(ROUTE_PERMISSIONS)
            .find(route => pathname.startsWith(route));

        if (restrictedPath) {
            const allowedRoles = ROUTE_PERMISSIONS[restrictedPath];
            const hasPermission = allowedRoles.some(
                role => role.toLowerCase() === userRole.toLowerCase()
            );

            if (!hasPermission) {
                if (pathname === '/dashboard') {
                    const response = NextResponse.redirect(new URL('/login', request.url));
                    response.cookies.delete('token');
                    response.cookies.delete('user_role');
                    return response;
                }
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
        '/login',
        '/signup',
        '/'
    ],
};
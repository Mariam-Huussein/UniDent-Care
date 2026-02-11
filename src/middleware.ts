import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { UserRole } from './config/navLinks';
import { ROUTE_PERMISSIONS } from './config/permissions';

const publicRoutes = ['/login', '/signup', '/forget-password', '/reset-password', '/'];

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const userRole = request.cookies.get('user_role')?.value as UserRole;
    const { pathname } = request.nextUrl;

    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

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
            // Normalize role comparison (case-insensitive) to handle potential casing mismatches
            const hasPermission = allowedRoles.some(
                role => role.toLowerCase() === userRole.toLowerCase()
            );

            if (!hasPermission) {
                // Prevent infinite redirect loop
                if (pathname === '/dashboard') {
                    // If user is not allowed on dashboard, force logout or send to login
                    // to avoid loop.
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

// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// import { UserRole } from './config/navLinks';
// import { ROUTE_PERMISSIONS } from './config/permissions';

// const publicRoutes = ['/login', '/signup', '/forget-password', '/reset-password', '/'];

// export function middleware(request: NextRequest) {
//     const token = request.cookies.get('token')?.value;
//     const { pathname } = request.nextUrl;
//     const userRole = request.cookies.get('user_role')?.value as UserRole;

//     const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));


//     if (!token && !isPublicRoute) {
//         return NextResponse.redirect(new URL('/login', request.url));
//     }

//     if (token && !userRole && !pathname.startsWith('/login')) {
//         return NextResponse.redirect(new URL('/login', request.url));
//     }

//     if (token && userRole && (pathname.startsWith('/login') || pathname.startsWith('/signup'))) {
//         return NextResponse.redirect(new URL('/dashboard', request.url));
//     }

//     if (token && userRole) {
//         const restrictedPath = Object.keys(ROUTE_PERMISSIONS)
//             .find(route => pathname.startsWith(route));

//         if (restrictedPath) {
//             const allowedRoles = ROUTE_PERMISSIONS[restrictedPath];
//             if (!allowedRoles.includes(userRole)) {
//                 return NextResponse.redirect(new URL('/dashboard', request.url));
//             }
//         }
//     }


//     return NextResponse.next();
// }

// export const config = {
//     matcher: [
//         '/dashboard/:path*',
//         '/profile/:path*',
//         '/settings/:path*',
//         '/cases/:path*',
//         '/my-cases/:path*',
//         '/my-student/:path*',
//         '/pending-cases/:path*',
//         '/add-case/:path*',
//         '/login'
//     ],
// };
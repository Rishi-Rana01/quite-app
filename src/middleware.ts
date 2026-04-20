import { NextResponse, NextRequest } from 'next/server'
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {

    const token = await getToken({ req: request })
    const url = request.nextUrl

    const needsUsernameSetup = token && typeof token.username === 'string' && token.username.startsWith('user_')

    // If user needs to set up a username, only allow /setup-username
    if (needsUsernameSetup && !url.pathname.startsWith('/setup-username')) {
        return NextResponse.redirect(new URL('/setup-username', request.url))
    }

    // Logged-in users with a real username shouldn't visit auth pages
    if (token && !needsUsernameSetup &&
        (
            url.pathname.startsWith('/sign-in') ||
            url.pathname.startsWith('/sign-up') ||
            url.pathname.startsWith('/verify') ||
            url.pathname === '/'
        )
    ) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Unauthenticated users can't visit the dashboard
    if (!token && url.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/sign-in', request.url))
    }

    // Unauthenticated users can't visit setup-username
    if (!token && url.pathname.startsWith('/setup-username')) {
        return NextResponse.redirect(new URL('/sign-in', request.url))
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/sign-in',
        '/sign-up',
        '/',
        '/dashboard/:path*',
        '/verify/:path*',
        '/setup-username',
    ]
}

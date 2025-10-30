import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

/**
 * Middleware for protecting admin routes
 *
 * This middleware checks if the user is authenticated before allowing access to admin routes.
 * If not authenticated, redirects to the login page.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow access to login page
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  // Check authentication for all /admin/* routes
  if (pathname.startsWith('/admin')) {
    try {
      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
      })

      // If no token, redirect to login
      if (!token) {
        const url = new URL('/admin/login', request.url)
        // Save the original URL to redirect back after login
        url.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(url)
      }
    } catch (error) {
      console.error('Middleware authentication error:', error)
      // On error, redirect to login
      const url = new URL('/admin/login', request.url)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    // Optionally protect API routes
    // '/api/admin/:path*',
  ],
}

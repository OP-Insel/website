import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath = path === "/" || path === "/login" || path === "/register"

  // Check if user is authenticated by looking for the auth cookie
  const isAuthenticated = request.cookies.has("auth")

  // If trying to access a protected route without being authenticated
  if (!isPublicPath && !isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // If trying to access login/register while already authenticated
  if (isPublicPath && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/", "/dashboard/:path*"],
}


import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Track analytics for all page visits
  if (!request.nextUrl.pathname.startsWith("/api/")) {
    // This will be handled by the analytics API
    fetch(`${request.nextUrl.origin}/api/analytics/track`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        path: request.nextUrl.pathname,
        userAgent: request.headers.get("user-agent"),
        ip: request.ip || request.headers.get("x-forwarded-for"),
        timestamp: new Date().toISOString(),
      }),
    }).catch(() => {}) // Silent fail for analytics
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}

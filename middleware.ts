import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Skip processing in v0 preview environment
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === "preview" || request.headers.get("x-vercel-skip-middleware") === "true") {
    return NextResponse.next()
  }

  // Check if the site is in maintenance mode
  try {
    const response = await fetch(`${request.nextUrl.origin}/api/admin/site-settings`)

    if (response.ok) {
      const settings = await response.json()

      if (settings.maintenanceMode) {
        // Check if the request is coming from an allowed domain
        const host = request.headers.get("host") || ""
        const allowedDomains = settings.allowedMaintenanceDomains || ["danidemamaintenence.vercel.app"]

        if (!allowedDomains.some((domain) => host.includes(domain))) {
          // If not from an allowed domain, redirect to the maintenance page
          return NextResponse.rewrite(new URL("/maintenance", request.url))
        }
      }
    }
  } catch (error) {
    console.error("Error checking maintenance mode:", error)
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
     * - maintenance (maintenance page)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|maintenance).*)",
  ],
}

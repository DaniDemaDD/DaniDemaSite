import { verifyEmail } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get("token")

    if (!token) {
      return NextResponse.json({ error: "Verification token is required" }, { status: 400 })
    }

    const success = await verifyEmail(token)

    if (!success) {
      return NextResponse.json({ error: "Invalid or expired verification token" }, { status: 400 })
    }

    // Redirect to login page with success message
    return NextResponse.redirect(new URL("/auth/signin?verified=true", request.url))
  } catch (error) {
    console.error("Error in verify-email route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

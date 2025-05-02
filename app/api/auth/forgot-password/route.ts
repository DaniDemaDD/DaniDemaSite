import { requestPasswordReset } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const success = await requestPasswordReset(email)

    // Always return success to prevent email enumeration
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in forgot-password route:", error)
    // Still return success to prevent email enumeration
    return NextResponse.json({ success: true })
  }
}

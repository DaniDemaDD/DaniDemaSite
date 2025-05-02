import { resetPassword } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { token, newPassword } = await request.json()

    if (!token || !newPassword) {
      return NextResponse.json({ error: "Token and new password are required" }, { status: 400 })
    }

    const success = await resetPassword(token, newPassword)

    if (!success) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in reset-password route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

import { getCurrentUser, updateUserPassword } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Current and new passwords are required" }, { status: 400 })
    }

    const success = await updateUserPassword(currentUser.id, currentPassword, newPassword)

    if (!success) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in password route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

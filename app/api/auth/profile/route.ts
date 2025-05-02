import { getCurrentUser, updateUserProfile } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const data = await request.json()
    const updatedUser = await updateUserProfile(currentUser.id, data)

    if (!updatedUser) {
      return NextResponse.json({ error: "Failed to update profile" }, { status: 400 })
    }

    // Don't return the password
    const { password, ...userWithoutPassword } = updatedUser

    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error("Error in profile route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

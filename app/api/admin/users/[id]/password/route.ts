import { getCurrentUser, adminUpdateUserPassword } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { newPassword } = await request.json()

    if (!newPassword) {
      return NextResponse.json({ error: "New password is required" }, { status: 400 })
    }

    const success = await adminUpdateUserPassword(currentUser.id, params.id, newPassword)

    if (!success) {
      return NextResponse.json({ error: "Failed to update user password" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in admin/users/[id]/password route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

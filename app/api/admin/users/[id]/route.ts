import { getCurrentUser, deleteUser } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const success = await deleteUser(currentUser.id, params.id)

    if (!success) {
      return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in admin/users/[id] route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

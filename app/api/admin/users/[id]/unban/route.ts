import { getCurrentUser, unbanUser } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "creator")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const success = await unbanUser(currentUser.id, params.id)

    if (!success) {
      return NextResponse.json({ error: "Failed to unban user" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in admin/users/[id]/unban route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

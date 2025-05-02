import { banUser, getCurrentUser } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "creator")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { reason } = await request.json()

    if (!reason) {
      return NextResponse.json({ error: "Ban reason is required" }, { status: 400 })
    }

    const success = await banUser(currentUser.id, params.id, reason)

    if (!success) {
      return NextResponse.json({ error: "Failed to ban user" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in admin/users/[id]/ban route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

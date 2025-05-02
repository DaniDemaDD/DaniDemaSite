import { getCurrentUser, updateSupportRequestStatus } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { status } = await request.json()

    if (!status || !["open", "in-progress", "resolved", "closed", "redeemed"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const success = await updateSupportRequestStatus(currentUser.id, params.id, status)

    if (!success) {
      return NextResponse.json({ error: "Failed to update support request status" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in admin/support/[id]/status route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

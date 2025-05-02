import { getCurrentUser, updateUserRole } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { role } = await request.json()

    if (!role || (role !== "user" && role !== "admin")) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    const success = await updateUserRole(currentUser.id, params.id, role)

    if (!success) {
      return NextResponse.json({ error: "Failed to update user role" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in admin/users/[id]/role route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

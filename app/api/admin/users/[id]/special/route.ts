import { setSpecialRole } from "@/lib/auth"
import { getCurrentUser } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser || currentUser.role !== "creator") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const userId = params.id
    const success = await setSpecialRole(currentUser.id, userId)

    if (!success) {
      return NextResponse.json({ error: "Failed to set special role" }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error setting special role:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

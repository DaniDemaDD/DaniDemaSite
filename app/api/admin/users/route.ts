import { getCurrentUser, getAllUsers } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const users = await getAllUsers(currentUser.id)

    if (!users) {
      return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
    }

    return NextResponse.json(users)
  } catch (error) {
    console.error("Error in admin/users route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

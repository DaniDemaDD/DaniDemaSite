import { getCurrentUser, getSupportRequests } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const requests = await getSupportRequests(currentUser.id)

    if (!requests) {
      return NextResponse.json({ error: "Failed to fetch support requests" }, { status: 500 })
    }

    return NextResponse.json(requests)
  } catch (error) {
    console.error("Error in admin/support route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

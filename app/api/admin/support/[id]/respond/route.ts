import { getCurrentUser, respondToSupportRequest } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const success = await respondToSupportRequest(currentUser.id, params.id, message)

    if (!success) {
      return NextResponse.json({ error: "Failed to respond to support request" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in admin/support/respond route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

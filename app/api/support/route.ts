import { getCurrentUser, createSupportRequest, getUserSupportRequests } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { subject, message } = await request.json()

    if (!subject || !message) {
      return NextResponse.json({ error: "Subject and message are required" }, { status: 400 })
    }

    const supportRequest = await createSupportRequest(currentUser.id, subject, message)

    if (!supportRequest) {
      return NextResponse.json({ error: "Failed to create support request" }, { status: 500 })
    }

    return NextResponse.json(supportRequest)
  } catch (error) {
    console.error("Error in support route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const supportRequests = await getUserSupportRequests(currentUser.id)
    return NextResponse.json(supportRequests)
  } catch (error) {
    console.error("Error in support route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

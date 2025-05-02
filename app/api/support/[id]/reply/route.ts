import { getCurrentUser } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // In a real app, this would update the support request in the database
    // For now, we'll just return a mock response
    return NextResponse.json({
      id: params.id,
      userId: currentUser.id,
      subject: "Support Request",
      message: "Original message",
      status: "in-progress",
      createdAt: new Date().toISOString(),
      responses: [
        {
          id: "resp-1",
          adminId: "admin",
          message: "Admin response",
          createdAt: new Date().toISOString(),
        },
        {
          id: "resp-2",
          adminId: currentUser.id,
          message: message,
          createdAt: new Date().toISOString(),
        },
      ],
    })
  } catch (error) {
    console.error("Error in support/[id]/reply route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

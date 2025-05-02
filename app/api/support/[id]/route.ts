import { getCurrentUser, getSupportRequestById } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const supportRequest = await getSupportRequestById(currentUser.id, params.id)

    if (!supportRequest) {
      return NextResponse.json({ error: "Support request not found" }, { status: 404 })
    }

    return NextResponse.json(supportRequest)
  } catch (error) {
    console.error("Error in support/[id] route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

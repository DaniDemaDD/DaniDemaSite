import { getCurrentUser, getAllAIResponses, addAIResponse } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const aiResponses = await getAllAIResponses(currentUser.id)

    if (!aiResponses) {
      return NextResponse.json({ error: "Failed to fetch AI responses" }, { status: 500 })
    }

    return NextResponse.json(aiResponses)
  } catch (error) {
    console.error("Error in admin/ai route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const data = await request.json()
    const { keywords, response } = data

    if (!keywords || !keywords.length || !response) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newResponse = await addAIResponse(currentUser.id, { keywords, response })

    if (!newResponse) {
      return NextResponse.json({ error: "Failed to add AI response" }, { status: 500 })
    }

    return NextResponse.json(newResponse)
  } catch (error) {
    console.error("Error in admin/ai route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

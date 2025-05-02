import { getCurrentUser, updateAIResponse, deleteAIResponse } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const data = await request.json()
    const updatedResponse = await updateAIResponse(currentUser.id, params.id, data)

    if (!updatedResponse) {
      return NextResponse.json({ error: "Failed to update AI response" }, { status: 500 })
    }

    return NextResponse.json(updatedResponse)
  } catch (error) {
    console.error("Error in admin/ai/[id] route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const success = await deleteAIResponse(currentUser.id, params.id)

    if (!success) {
      return NextResponse.json({ error: "Failed to delete AI response" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in admin/ai/[id] route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

import { getCurrentUser, updateSoftware, deleteSoftware } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const data = await request.json()
    const updatedSoftware = await updateSoftware(currentUser.id, params.id, data)

    if (!updatedSoftware) {
      return NextResponse.json({ error: "Failed to update software" }, { status: 500 })
    }

    return NextResponse.json(updatedSoftware)
  } catch (error) {
    console.error("Error in admin/software/[id] route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const success = await deleteSoftware(currentUser.id, params.id)

    if (!success) {
      return NextResponse.json({ error: "Failed to delete software" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in admin/software/[id] route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

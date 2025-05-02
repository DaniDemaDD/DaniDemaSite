import { deleteRole, getCurrentUser, updateRole } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: { name: string } }) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser || currentUser.role !== "creator") {
      return NextResponse.json({ error: "Unauthorized - only creators can update roles" }, { status: 403 })
    }

    const { permissions, isActive } = await request.json()

    if (!permissions) {
      return NextResponse.json({ error: "Permissions are required" }, { status: 400 })
    }

    const role = await updateRole(currentUser.id, params.name as any, permissions, isActive)

    if (!role) {
      return NextResponse.json({ error: "Failed to update role" }, { status: 500 })
    }

    return NextResponse.json(role)
  } catch (error) {
    console.error("Error in roles/[name] route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { name: string } }) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser || currentUser.role !== "creator") {
      return NextResponse.json({ error: "Unauthorized - only creators can delete roles" }, { status: 403 })
    }

    const success = await deleteRole(currentUser.id, params.name as any)

    if (!success) {
      return NextResponse.json({ error: "Failed to delete role" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in roles/[name] route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

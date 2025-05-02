import { createRole, getAllRoles, getCurrentUser } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const roles = await getAllRoles()
    return NextResponse.json(roles)
  } catch (error) {
    console.error("Error in roles route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser || currentUser.role !== "creator") {
      return NextResponse.json({ error: "Unauthorized - only creators can create roles" }, { status: 403 })
    }

    const { name, permissions, canBeDeleted, canChangePassword, isActive } = await request.json()

    if (!name || !permissions) {
      return NextResponse.json({ error: "Name and permissions are required" }, { status: 400 })
    }

    const role = await createRole(
      currentUser.id,
      name,
      permissions,
      canBeDeleted !== undefined ? canBeDeleted : true,
      canChangePassword !== undefined ? canChangePassword : true,
      isActive !== undefined ? isActive : true,
    )

    if (!role) {
      return NextResponse.json({ error: "Failed to create role" }, { status: 500 })
    }

    return NextResponse.json(role)
  } catch (error) {
    console.error("Error in roles route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

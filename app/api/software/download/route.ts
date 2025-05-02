import { getCurrentUser, downloadSoftware } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { softwareId } = await request.json()

    if (!softwareId) {
      return NextResponse.json({ error: "Software ID is required" }, { status: 400 })
    }

    const success = await downloadSoftware(user.id, softwareId)

    if (!success) {
      return NextResponse.json({ error: "Failed to download software" }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in download software route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

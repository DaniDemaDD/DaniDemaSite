import { getCurrentUser, getSiteSettings, updateSiteSettings } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const settings = await getSiteSettings()
    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error in site-settings route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const data = await request.json()
    const updatedSettings = await updateSiteSettings(currentUser.id, data)

    if (!updatedSettings) {
      return NextResponse.json({ error: "Failed to update site settings" }, { status: 500 })
    }

    return NextResponse.json(updatedSettings)
  } catch (error) {
    console.error("Error in site-settings route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

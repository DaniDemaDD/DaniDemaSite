import { type NextRequest, NextResponse } from "next/server"
import { isAdmin, getSiteSettings, updateSiteSettings } from "@/lib/auth"
import { logActivity } from "@/lib/activity-logger"
import { sendMaintenanceModeNotification } from "@/lib/discord-webhook"

export async function GET(request: NextRequest) {
  try {
    const settings = await getSiteSettings()
    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error fetching site settings:", error)
    return NextResponse.json({ error: "Failed to fetch site settings" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const { isAdmin: isAuthorized, userId } = await isAdmin(request)

  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  try {
    const data = await request.json()

    // Get current settings to check if maintenance mode is being toggled
    const currentSettings = await getSiteSettings()
    const isMaintenanceModeToggled =
      data.maintenanceMode !== undefined && data.maintenanceMode !== currentSettings.maintenanceMode

    // Update settings
    const updatedSettings = await updateSiteSettings(userId || "unknown", data)

    if (!updatedSettings) {
      return NextResponse.json({ error: "Failed to update site settings" }, { status: 500 })
    }

    // Log the activity
    await logActivity(userId || "unknown", "Admin", "site_settings_updated", {
      settings: { ...data, password: undefined },
    })

    // If maintenance mode was toggled, send notification
    if (isMaintenanceModeToggled) {
      await sendMaintenanceModeNotification(
        data.maintenanceMode,
        userId || "unknown",
        data.maintenanceReason || "No reason provided",
      )

      // Log the specific maintenance mode change
      await logActivity(userId || "unknown", "Admin", "maintenance_mode_changed", {
        enabled: data.maintenanceMode,
        reason: data.maintenanceReason || "No reason provided",
      })
    }

    return NextResponse.json(updatedSettings)
  } catch (error) {
    console.error("Error updating site settings:", error)
    return NextResponse.json({ error: "Failed to update site settings" }, { status: 500 })
  }
}

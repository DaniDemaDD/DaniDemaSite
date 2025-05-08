import { type NextRequest, NextResponse } from "next/server"
import { isAdmin } from "@/lib/auth"
import { getActivityLogs } from "@/lib/activity-logger"

export async function GET(request: NextRequest) {
  const { isAdmin: isAuthorized, userId } = await isAdmin(request)

  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  try {
    // Get query parameters
    const url = new URL(request.url)
    const limit = Number.parseInt(url.searchParams.get("limit") || "100")
    const offset = Number.parseInt(url.searchParams.get("offset") || "0")

    // Get activity logs
    const logs = await getActivityLogs(limit, offset)

    return NextResponse.json(logs)
  } catch (error) {
    console.error("Error fetching activity logs:", error)
    return NextResponse.json({ error: "Failed to fetch activity logs" }, { status: 500 })
  }
}

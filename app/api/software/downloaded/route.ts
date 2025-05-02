import { getCurrentUser, getUserDownloadedSoftware } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const downloadedSoftware = await getUserDownloadedSoftware(user.id)
    return NextResponse.json(downloadedSoftware)
  } catch (error) {
    console.error("Error in downloaded software route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

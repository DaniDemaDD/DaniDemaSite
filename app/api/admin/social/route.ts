import { getCurrentUser, getSocialLinks, addSocialLink } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const socialLinks = await getSocialLinks()
    return NextResponse.json(socialLinks)
  } catch (error) {
    console.error("Error in admin/social route:", error)
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
    const { name, url, icon, color } = data

    if (!name || !url || !icon || !color) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newLink = await addSocialLink(currentUser.id, { name, url, icon, color })

    if (!newLink) {
      return NextResponse.json({ error: "Failed to add social link" }, { status: 500 })
    }

    return NextResponse.json(newLink)
  } catch (error) {
    console.error("Error in admin/social route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

import { getCurrentUser, getAllSoftware, addSoftware } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const software = await getAllSoftware()
    return NextResponse.json(software)
  } catch (error) {
    console.error("Error in software route:", error)
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
    const { name, description, image, tags, demoUrl, downloadUrl, githubUrl, version } = data

    if (!name || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newSoftware = await addSoftware(currentUser.id, {
      name,
      description,
      image: image || "/placeholder.svg?height=200&width=300",
      tags: tags || [],
      demoUrl: demoUrl || "#",
      downloadUrl: downloadUrl || "#",
      githubUrl: githubUrl || "#",
      version: version || "1.0.0",
    })

    if (!newSoftware) {
      return NextResponse.json({ error: "Failed to add software" }, { status: 500 })
    }

    return NextResponse.json(newSoftware)
  } catch (error) {
    console.error("Error in admin/software route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

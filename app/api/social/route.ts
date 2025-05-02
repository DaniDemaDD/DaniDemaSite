import { getSocialLinks } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const socialLinks = await getSocialLinks()
    return NextResponse.json(socialLinks)
  } catch (error) {
    console.error("Error in social route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

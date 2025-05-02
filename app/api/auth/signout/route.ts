import { signOut } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    await signOut()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in signout route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

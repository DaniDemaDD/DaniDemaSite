import { signUp } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, ipAddress } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
    }

    const user = await signUp(name, email, password, ipAddress || "unknown")

    if (!user) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    // Don't return the password
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error("Error in signup route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

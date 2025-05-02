import { getAIResponse } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    const response = await getAIResponse(query)

    return NextResponse.json({ response })
  } catch (error) {
    console.error("Error in AI chat route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

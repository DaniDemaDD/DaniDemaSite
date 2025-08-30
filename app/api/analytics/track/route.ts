import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { path, userAgent, ip, timestamp } = body

    // Extract basic info from user agent
    const country = request.geo?.country || "Unknown"
    const city = request.geo?.city || "Unknown"

    // Generate session ID from IP + User Agent
    const sessionId = Buffer.from(`${ip}-${userAgent}`).toString("base64").slice(0, 32)

    // Insert analytics data
    const { error } = await supabase.from("site_analytics").insert({
      page_path: path,
      visitor_ip: ip,
      user_agent: userAgent,
      country,
      city,
      visit_date: new Date().toISOString().split("T")[0],
      visit_time: timestamp,
      session_id: sessionId,
    })

    if (error) {
      console.error("Analytics tracking error:", error)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Analytics API error:", error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const today = new Date().toISOString().split("T")[0]
    const thisMonth = new Date().toISOString().slice(0, 7) // YYYY-MM
    const thisYear = new Date().getFullYear().toString()

    // Today's visits
    const { data: todayData, error: todayError } = await supabase
      .from("site_analytics")
      .select("session_id")
      .eq("visit_date", today)

    // This month's visits
    const { data: monthData, error: monthError } = await supabase
      .from("site_analytics")
      .select("session_id")
      .gte("visit_date", `${thisMonth}-01`)
      .lt("visit_date", `${thisMonth}-32`)

    // This year's visits
    const { data: yearData, error: yearError } = await supabase
      .from("site_analytics")
      .select("session_id")
      .gte("visit_date", `${thisYear}-01-01`)
      .lt("visit_date", `${Number.parseInt(thisYear) + 1}-01-01`)

    if (todayError || monthError || yearError) {
      throw new Error("Database query failed")
    }

    // Count unique sessions
    const todayUnique = new Set(todayData?.map((d) => d.session_id) || []).size
    const monthUnique = new Set(monthData?.map((d) => d.session_id) || []).size
    const yearUnique = new Set(yearData?.map((d) => d.session_id) || []).size

    return NextResponse.json({
      today: todayUnique,
      month: monthUnique,
      year: yearUnique,
      totalToday: todayData?.length || 0,
      totalMonth: monthData?.length || 0,
      totalYear: yearData?.length || 0,
    })
  } catch (error) {
    console.error("Analytics stats error:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}

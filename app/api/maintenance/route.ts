import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    const { data, error } = await supabase.from("maintenance_settings").select("*").order("route_path")

    if (error) {
      console.error("Database error:", error)
      throw error
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error("Maintenance fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch maintenance settings" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { route_path, is_maintenance, maintenance_message } = body

    if (!route_path) {
      return NextResponse.json({ error: "route_path is required" }, { status: 400 })
    }

    const defaultMessage =
      route_path === "__GLOBAL__"
        ? "The entire site is currently under maintenance. We apologize for the inconvenience and will be back soon!"
        : "This page is currently under maintenance. We apologize for the inconvenience."

    const { data, error } = await supabase
      .from("maintenance_settings")
      .upsert(
        {
          route_path,
          is_maintenance: Boolean(is_maintenance),
          maintenance_message: maintenance_message || defaultMessage,
          updated_at: new Date().toISOString(),
          updated_by: "admin",
        },
        {
          onConflict: "route_path",
        },
      )
      .select()
      .single()

    if (error) {
      console.error("Database upsert error:", error)
      throw error
    }

    console.log(`Maintenance ${is_maintenance ? "enabled" : "disabled"} for ${route_path}`)

    return NextResponse.json({
      success: true,
      data,
      message: `Maintenance ${is_maintenance ? "enabled" : "disabled"} for ${route_path}`,
    })
  } catch (error) {
    console.error("Maintenance update error:", error)
    return NextResponse.json(
      {
        error: "Failed to update maintenance settings",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

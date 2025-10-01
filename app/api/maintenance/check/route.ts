import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { route_path } = body

    if (!route_path) {
      return NextResponse.json(
        {
          is_maintenance: false,
          message: null,
          type: null,
          error: "route_path is required",
        },
        { status: 400 },
      )
    }

    // Always allow login and 2FA pages
    if (route_path === "/login" || route_path === "/2fa") {
      return NextResponse.json({
        is_maintenance: false,
        message: null,
        type: null,
      })
    }

    // Check global maintenance first
    const { data: globalData, error: globalError } = await supabase
      .from("maintenance_settings")
      .select("is_maintenance, maintenance_message")
      .eq("route_path", "__GLOBAL__")
      .single()

    if (globalError && globalError.code !== "PGRST116") {
      console.error("Global maintenance check error:", globalError)
      // On error, assume no maintenance to avoid blocking access
      return NextResponse.json({
        is_maintenance: false,
        message: null,
        type: null,
      })
    }

    // If global maintenance is on, return it
    if (globalData?.is_maintenance) {
      return NextResponse.json({
        is_maintenance: true,
        message:
          globalData.maintenance_message ||
          "The entire site is currently under maintenance. We apologize for the inconvenience and will be back soon!",
        type: "global",
      })
    }

    // Check specific route maintenance
    const { data: routeData, error: routeError } = await supabase
      .from("maintenance_settings")
      .select("is_maintenance, maintenance_message")
      .eq("route_path", route_path)
      .single()

    if (routeError && routeError.code !== "PGRST116") {
      console.error("Route maintenance check error:", routeError)
      // On error, assume no maintenance
      return NextResponse.json({
        is_maintenance: false,
        message: null,
        type: null,
      })
    }

    if (routeData?.is_maintenance) {
      return NextResponse.json({
        is_maintenance: true,
        message:
          routeData.maintenance_message ||
          "This page is currently under maintenance. We apologize for the inconvenience.",
        type: "route",
      })
    }

    // No maintenance found
    return NextResponse.json({
      is_maintenance: false,
      message: null,
      type: null,
    })
  } catch (error) {
    console.error("Maintenance check error:", error)
    // On any error, assume no maintenance to avoid blocking access
    return NextResponse.json({
      is_maintenance: false,
      message: null,
      type: null,
      error: "Check failed, assuming no maintenance",
    })
  }
}

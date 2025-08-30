import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    const { data, error } = await supabase.from("site_settings").select("*").eq("site_name", "sike-gg")

    if (error) throw error

    // Convert to key-value object
    const settings: Record<string, any> = {}
    data?.forEach((setting) => {
      settings[setting.setting_key] = setting.setting_value
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Site settings fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const settings = await request.json()

    // Update each setting
    for (const [key, value] of Object.entries(settings)) {
      const { error } = await supabase.from("site_settings").upsert({
        site_name: "sike-gg",
        setting_key: key,
        setting_value: value as string,
        updated_at: new Date().toISOString(),
      })

      if (error) throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Site settings update error:", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}

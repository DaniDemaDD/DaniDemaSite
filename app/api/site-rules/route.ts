import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

const DEFAULT_RULES = [
  "1. Rispetta tutti i membri del server",
  "2. Non utilizzare linguaggio offensivo o discriminatorio",
  "3. Non fare spam nei canali",
  "4. Mantieni le conversazioni nei canali appropriati",
  "5. Non condividere contenuti NSFW",
  "6. Rispetta i moderatori e le loro decisioni",
  "7. Non fare pubblicità senza permesso",
  "8. Usa i comandi bot nei canali dedicati",
  "9. Non disturbare gli altri membri con DM non richiesti",
  "10. Divertiti e mantieni un ambiente positivo!",
]

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("site_settings")
      .select("setting_value")
      .eq("setting_key", "discord_rules")
      .single()

    if (error && error.code !== "PGRST116") {
      throw error
    }

    const rules = data?.setting_value ? JSON.parse(data.setting_value) : DEFAULT_RULES

    return NextResponse.json({ rules })
  } catch (error) {
    console.error("Rules fetch error:", error)
    return NextResponse.json({ rules: DEFAULT_RULES })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { rules } = await request.json()

    if (!Array.isArray(rules)) {
      return NextResponse.json({ error: "Rules must be an array" }, { status: 400 })
    }

    const { error } = await supabase.from("site_settings").upsert({
      site_name: "sike-gg",
      setting_key: "discord_rules",
      setting_value: JSON.stringify(rules),
      setting_type: "json",
      updated_at: new Date().toISOString(),
    })

    if (error) throw error

    return NextResponse.json({ success: true, rules })
  } catch (error) {
    console.error("Rules update error:", error)
    return NextResponse.json({ error: "Failed to update rules" }, { status: 500 })
  }
}

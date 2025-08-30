import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    const { data, error } = await supabase.from("discord_bots").select("*").order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (error) {
    console.error("Bots fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch bots" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, language, mainFile, buildCommand, startCommand, environmentVars, fileContent } = body

    // Check if we already have 10 bots
    const { data: existingBots, error: countError } = await supabase.from("discord_bots").select("id")

    if (countError) throw countError

    if (existingBots && existingBots.length >= 10) {
      return NextResponse.json({ error: "Maximum of 10 bots allowed" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("discord_bots")
      .insert({
        name,
        description,
        language,
        main_file: mainFile,
        build_command: buildCommand,
        start_command: startCommand,
        environment_vars: environmentVars,
        file_content: fileContent,
        status: "stopped",
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("Bot creation error:", error)
    return NextResponse.json({ error: "Failed to create bot" }, { status: 500 })
  }
}

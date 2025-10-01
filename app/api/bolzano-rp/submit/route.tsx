import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()

    const {
      discord_name,
      discord_id,
      age,
      experience_years,
      admin_experience,
      availability,
      why_admin,
      situation_handling,
      failrp_knowledge,
      rdm_knowledge,
      vdm_knowledge,
      metagaming_knowledge,
      powergaming_knowledge,
      additional_info,
    } = body

    // Validate required fields
    if (!discord_name || !discord_id || !age) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get IP address
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"

    // Insert application
    const { data: application, error } = await supabase
      .from("bolzano_rp_applications")
      .insert({
        discord_name,
        discord_id,
        age: Number.parseInt(age),
        experience_years: Number.parseInt(experience_years),
        admin_experience,
        availability,
        why_admin,
        situation_handling,
        failrp_knowledge,
        rdm_knowledge,
        vdm_knowledge,
        metagaming_knowledge,
        powergaming_knowledge,
        additional_info,
        ip_address: ip,
        status: "pending",
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      throw error
    }

    // Send email notification
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "dani@danidema.xyz",
          subject: `Nuova Candidatura Admin Bolzano RP - ${discord_name}`,
          applicationData: application,
        }),
      })
    } catch (emailError) {
      console.error("Email error:", emailError)
      // Continue even if email fails
    }

    // Send Discord webhook notification
    if (process.env.DISCORD_WEBHOOK_URL) {
      try {
        await fetch(process.env.DISCORD_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            embeds: [
              {
                title: "📝 Nuova Candidatura Admin",
                color: 0x5865f2,
                fields: [
                  { name: "Discord", value: `${discord_name} (${discord_id})`, inline: true },
                  { name: "Età", value: age.toString(), inline: true },
                  { name: "Esperienza", value: `${experience_years} anni`, inline: true },
                  {
                    name: "Link Admin Panel",
                    value: `${process.env.NEXT_PUBLIC_SITE_URL}/admin-dashboard-management-panel-secure-access-control-system-authenticated-users-only-restricted-area-authorized-personnel-verification-required`,
                  },
                ],
                timestamp: new Date().toISOString(),
              },
            ],
          }),
        })
      } catch (webhookError) {
        console.error("Discord webhook error:", webhookError)
      }
    }

    return NextResponse.json({
      success: true,
      message: "Candidatura inviata con successo!",
      application,
    })
  } catch (error) {
    console.error("Submit error:", error)
    return NextResponse.json({ error: "Errore durante l'invio della candidatura" }, { status: 500 })
  }
}

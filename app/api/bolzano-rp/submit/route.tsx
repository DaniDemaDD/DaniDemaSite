import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"

    // Map form data to database columns
    const applicationData = {
      nome_gioco: body.nomeGioco,
      discord_tag: body.discordTag,
      nome_rp: body.nomeRP,
      data_nascita_rp: body.dataNascitaRP,
      eta: Number.parseInt(body.eta),
      failrp_spiegazione: body.failRP,
      rdm_spiegazione: body.rdm,
      vdm_spiegazione: body.vdm,
      metagaming_spiegazione: body.metagaming,
      powergaming_spiegazione: body.powergaming,
      motivo_admin: body.motivoAdmin,
      consapevolezza_responsabilita: body.consapevolezzaResponsabilita,
      ip_address: ip,
      status: "pending",
    }

    const supabase = createClient()

    const { data, error } = await supabase.from("bolzano_rp_applications").insert([applicationData]).select()

    if (error) {
      console.error("Error inserting application:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Send email notification
    try {
      const adminPanelUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/admin-dashboard-management-panel-secure-access-control-system-authenticated-users-only-restricted-area-authorized-personnel-verification-required`

      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "dani@danidema.xyz",
          subject: "🇮🇹 Nuova Candidatura Admin Bolzano RP",
          html: `
            <h2>Nuova Candidatura per Admin Bolzano RP</h2>
            <p><strong>Nome Gioco:</strong> ${body.nomeGioco}</p>
            <p><strong>Discord:</strong> ${body.discordTag}</p>
            <p><strong>Nome RP:</strong> ${body.nomeRP}</p>
            <p><strong>Età:</strong> ${body.eta}</p>
            <br>
            <p><a href="${adminPanelUrl}" style="display: inline-block; padding: 12px 24px; background-color: #10b981; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Visualizza nel Pannello Admin</a></p>
          `,
        }),
      })
    } catch (emailError) {
      console.error("Error sending email notification:", emailError)
      // Don't fail the request if email fails
    }

    // Send Discord webhook notification as fallback
    try {
      if (process.env.DISCORD_WEBHOOK_URL) {
        await fetch(process.env.DISCORD_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            embeds: [
              {
                title: "🇮🇹 Nuova Candidatura Admin Bolzano RP",
                color: 0x10b981,
                fields: [
                  { name: "Nome Gioco", value: body.nomeGioco, inline: true },
                  { name: "Discord", value: body.discordTag, inline: true },
                  { name: "Età", value: body.eta.toString(), inline: true },
                  { name: "Nome RP", value: body.nomeRP, inline: false },
                ],
                timestamp: new Date().toISOString(),
              },
            ],
          }),
        })
      }
    } catch (webhookError) {
      console.error("Error sending Discord webhook:", webhookError)
    }

    return NextResponse.json({ success: true, data: data[0] })
  } catch (error) {
    console.error("Error in Bolzano RP submit:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

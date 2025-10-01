import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown"

    // Verify Cloudflare Turnstile token
    const { turnstileToken, ...formData } = body

    if (!turnstileToken) {
      return NextResponse.json({ error: "Captcha verification required" }, { status: 400 })
    }

    // Verify Turnstile token with Cloudflare
    const turnstileVerify = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        secret: "0x4AAAAAAB4YaJy_wwikrsoSqSQC-OuZxkA",
        response: turnstileToken,
      }),
    })

    const turnstileResult = await turnstileVerify.json()

    if (!turnstileResult.success) {
      return NextResponse.json({ error: "Captcha verification failed" }, { status: 400 })
    }

    // Check if IP has already submitted
    const { data: existingSubmission, error: checkError } = await supabase
      .from("bolzano_rp_applications")
      .select("id")
      .eq("ip_address", ip)
      .eq("status", "pending")
      .single()

    if (existingSubmission) {
      return NextResponse.json(
        {
          error: "You have already submitted an application. Only one application per IP address is allowed.",
        },
        { status: 400 },
      )
    }

    // Insert application
    const { data, error } = await supabase
      .from("bolzano_rp_applications")
      .insert({
        nome_gioco: formData.nomeGioco,
        discord_tag: formData.discordTag,
        nome_rp: formData.nomeRp,
        data_nascita_rp: formData.dataNascitaRp,
        eta: Number.parseInt(formData.eta),
        failrp_spiegazione: formData.failrp,
        rdm_spiegazione: formData.rdm,
        vdm_spiegazione: formData.vdm,
        metagaming_spiegazione: formData.metagaming,
        powergaming_spiegazione: formData.powergaming,
        cop_baiting_spiegazione: formData.copBaiting,
        cuff_rushing_spiegazione: formData.cuffRushing,
        azione_violazioni: formData.azioneViolazioni,
        unrealistic_police_spiegazione: formData.unrealisticPolice,
        gestione_ticket: formData.gestioneTicket,
        procedura_segnalazione: formData.proceduraSegnalazione,
        reazione_rifiuto: formData.reazioneRifiuto,
        reazione_accettazione: formData.reazioneAccettazione,
        motivo_admin: formData.motivoAdmin,
        consapevolezza_responsabilita: formData.consapevolezzaResponsabilita,
        ip_address: ip,
        user_agent: request.headers.get("user-agent"),
        status: "pending",
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      throw error
    }

    // Invia email di notifica all'admin
    try {
      const emailHtml = `
        <h2>🇮🇹 Nuova Applicazione Admin - Bolzano RP</h2>
        
        <h3>📋 Informazioni Personali</h3>
        <ul>
          <li><strong>Nome nel gioco:</strong> ${formData.nomeGioco}</li>
          <li><strong>Discord Tag:</strong> ${formData.discordTag}</li>
          <li><strong>Nome RP:</strong> ${formData.nomeRp}</li>
          <li><strong>Data di Nascita RP:</strong> ${formData.dataNascitaRp}</li>
          <li><strong>Età:</strong> ${formData.eta}</li>
        </ul>

        <h3>🎮 Domande RP</h3>
        <p><strong>FailRP:</strong><br>${formData.failrp}</p>
        <p><strong>RDM:</strong><br>${formData.rdm}</p>
        <p><strong>VDM:</strong><br>${formData.vdm}</p>
        <p><strong>Metagaming:</strong><br>${formData.metagaming}</p>
        <p><strong>Powergaming:</strong><br>${formData.powergaming}</p>
        <p><strong>Cop Baiting:</strong><br>${formData.copBaiting}</p>
        <p><strong>Cuff Rushing:</strong><br>${formData.cuffRushing}</p>
        <p><strong>Azione Violazioni:</strong><br>${formData.azioneViolazioni}</p>
        <p><strong>Unrealistic Police:</strong><br>${formData.unrealisticPolice}</p>

        <h3>💬 Domande Discord</h3>
        <p><strong>Gestione Ticket:</strong><br>${formData.gestioneTicket}</p>
        <p><strong>Procedura Segnalazione:</strong><br>${formData.proceduraSegnalazione}</p>

        <h3>💭 Domande Personali</h3>
        <p><strong>Reazione al Rifiuto:</strong><br>${formData.reazioneRifiuto}</p>
        <p><strong>Reazione all'Accettazione:</strong><br>${formData.reazioneAccettazione}</p>
        <p><strong>Motivo per diventare Admin:</strong><br>${formData.motivoAdmin}</p>
        <p><strong>Consapevolezza Responsabilità:</strong><br>${formData.consapevolezzaResponsabilita}</p>

        <hr>
        <p><strong>ID Applicazione:</strong> ${data.id}</p>
        <p><strong>IP Address:</strong> ${ip}</p>
        <p><strong>Data Submission:</strong> ${new Date().toLocaleString("it-IT")}</p>
        
        <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin-dashboard-management-panel-secure-access-control-system-authenticated-users-only-restricted-area-authorized-personnel-verification-required">Vai al Pannello Admin</a></p>
      `

      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "dani@danidema.xyz",
          subject: `🇮🇹 Nuova Applicazione Admin - ${formData.nomeGioco}`,
          html: emailHtml,
        }),
      })
    } catch (emailError) {
      console.error("Failed to send email notification:", emailError)
      // Non bloccare il form se l'email fallisce
    }

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully!",
      applicationId: data.id,
    })
  } catch (error) {
    console.error("Application submission error:", error)
    return NextResponse.json(
      {
        error: "Failed to submit application",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

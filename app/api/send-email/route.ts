import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { to, subject, html } = body

    if (!to || !subject || !html) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // In produzione, qui useresti un servizio email come:
    // - Resend (https://resend.com)
    // - SendGrid
    // - Postmark
    // - AWS SES

    // Per ora simuliamo l'invio e logghiamo
    console.log("📧 Email da inviare:")
    console.log("To:", to)
    console.log("Subject:", subject)
    console.log("Body:", html.substring(0, 200) + "...")

    // Esempio con Resend (dovrai installare: npm install resend)
    // import { Resend } from 'resend'
    // const resend = new Resend(process.env.RESEND_API_KEY)
    // await resend.emails.send({
    //   from: 'Bolzano RP <noreply@danidema.xyz>',
    //   to: to,
    //   subject: subject,
    //   html: html
    // })

    // Webhook Discord alternativo per notifiche
    if (process.env.DISCORD_WEBHOOK_URL) {
      await fetch(process.env.DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          embeds: [
            {
              title: subject,
              description: "Nuova applicazione ricevuta! Controlla il pannello admin per i dettagli.",
              color: 3066993, // Verde
              timestamp: new Date().toISOString(),
            },
          ],
        }),
      })
    }

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
    })
  } catch (error) {
    console.error("Email send error:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}

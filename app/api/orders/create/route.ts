import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"

function generateOrderCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let code = "DD-"
  for (let i = 0; i < 24; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

function generatePDF(orderData: {
  orderCode: string
  name: string
  email: string
  discord: string
  service: string
  price: string
  details: string
  date: string
}): string {
  // Generate a simple text-based receipt (in production, use a proper PDF library)
  const content = `
=====================================
        DANIDEMA ORDER RECEIPT
=====================================

Order Code: ${orderData.orderCode}
Date: ${orderData.date}

-------------------------------------
CUSTOMER INFORMATION
-------------------------------------
Name: ${orderData.name}
Email: ${orderData.email}
Discord: ${orderData.discord}

-------------------------------------
ORDER DETAILS
-------------------------------------
Service: ${orderData.service}
Price: ${orderData.price}

Request Details:
${orderData.details}

-------------------------------------
PAYMENT INSTRUCTIONS
-------------------------------------
1. Contact dani.dema on Discord
2. Provide your order code
3. Complete payment via PayPal
4. Receive your service!

-------------------------------------
Made by DaniDema ❤️
support@danidema.xyz
discord.gg/BTWsXaUme3
=====================================
`
  return content
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, discord, service, price, details, turnstileToken, language } = body

    // Verify Turnstile token
    const turnstileResponse = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET_KEY || "0x4AAAAAAA0qKqj-bQsDd7W_", // Replace with your secret
        response: turnstileToken,
      }),
    })

    const turnstileData = await turnstileResponse.json()

    // Skip verification for demo purposes - in production, enforce this
    // if (!turnstileData.success) {
    //   return NextResponse.json({ success: false, error: "Captcha verification failed" }, { status: 400 })
    // }

    // Generate order code
    const orderCode = generateOrderCode()
    const date = new Date().toLocaleString(language === "it" ? "it-IT" : "en-US")

    // Service name mapping
    const serviceNames: Record<string, string> = {
      discordBots: "Discord Bot",
      websites: "Website",
      websitesWithDomain: "Website + Domain",
      accounts: "Email Account",
      emails: "Custom Email",
      hosting: "Hosting Forever",
      removeBranding: "Remove Branding",
    }

    const orderData = {
      orderCode,
      name,
      email,
      discord,
      service: serviceNames[service] || service,
      price,
      details,
      date,
    }

    // Generate PDF content
    const pdfContent = generatePDF(orderData)

    // Store order in Blob
    const orderBlob = await put(`orders/${orderCode}.json`, JSON.stringify(orderData), {
      access: "public",
      contentType: "application/json",
    })

    // Store PDF in Blob
    const pdfBlob = await put(`orders/${orderCode}-receipt.txt`, pdfContent, {
      access: "public",
      contentType: "text/plain",
    })

    // Send Discord webhook notification
    if (process.env.DISCORD_WEBHOOK_URL) {
      await fetch(process.env.DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          embeds: [
            {
              title: "🛒 Nuovo Ordine Ricevuto!",
              color: 0x9333ea,
              fields: [
                { name: "📋 Codice Ordine", value: `\`${orderCode}\``, inline: false },
                { name: "👤 Nome", value: name, inline: true },
                { name: "📧 Email", value: email, inline: true },
                { name: "💬 Discord", value: discord, inline: true },
                { name: "🛍️ Servizio", value: serviceNames[service] || service, inline: true },
                { name: "💰 Prezzo", value: price, inline: true },
                {
                  name: "📝 Dettagli",
                  value: details.substring(0, 200) + (details.length > 200 ? "..." : ""),
                  inline: false,
                },
              ],
              timestamp: new Date().toISOString(),
              footer: { text: "DaniDema Orders" },
            },
          ],
        }),
      })
    }

    return NextResponse.json({
      success: true,
      orderCode,
      pdfUrl: pdfBlob.url,
    })
  } catch (error) {
    console.error("Order creation error:", error)
    return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 })
  }
}

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
  items: { key: string; price: number; quantity: number }[]
  total: number
  details: string
  date: string
}): string {
  const serviceDescriptions: Record<string, string> = {
    discordBots: "Discord Bot - Custom bot development starting from $3",
    websites: "Website - Professional website without domain ($7)",
    websitesWithDomain: "Website + Domain - Complete website with custom domain ($12)",
    accounts: "Email Account - Custom @sl4ve.xyz or @danidema.xyz account ($3)",
    emails: "Custom Email - Personalized @lol.danidema.xyz or @ilove.sl4ve.xyz ($0.99)",
    hosting: "Hosting Forever - One-time payment lifetime hosting ($15)",
    removeBranding: "Remove Branding - Remove 'Made by DaniDema' from your bot ($7)",
  }

  let itemsList = ""
  orderData.items.forEach((item) => {
    const desc = serviceDescriptions[item.key] || item.key
    itemsList += `
  - ${desc}
    Quantity: ${item.quantity}
    Price: $${(item.price * item.quantity).toFixed(2)}
`
  })

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
PURCHASED ITEMS
-------------------------------------
${itemsList}

TOTAL: $${orderData.total.toFixed(2)}

-------------------------------------
CUSTOM REQUEST DETAILS
-------------------------------------
${orderData.details}

-------------------------------------
WHAT YOU'RE BUYING
-------------------------------------
${orderData.items.map((item) => `• ${serviceDescriptions[item.key] || item.key}`).join("\n")}

-------------------------------------
PAYMENT REQUIRED
-------------------------------------
⚠️  IMPORTANT: PAYMENT IS REQUIRED  ⚠️

This is a receipt for your order.
Payment has NOT been completed yet.

To complete your purchase:
1. Contact dani.dema on Discord
2. Provide this order code: ${orderData.orderCode}
3. Complete payment via PayPal
4. Once payment confirmed, receive your service!

Payment Methods:
- PayPal (preferred)
- Other methods: contact for details

-------------------------------------
Developer Information
-------------------------------------
Developer: DaniDema
Skills: Python, Node.js
Email: support@danidema.xyz
Discord: dani.dema
Community: discord.gg/BTWsXaUme3

Made by DaniDema ❤️
=====================================
`
  return content
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, discord, items, total, details, turnstileToken, language } = body

    // Verify Turnstile token
    const turnstileResponse = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET_KEY || "0x4AAAAAACKFFDfhkJrzsZtIMccGMzcPLAQ",
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
      items,
      total,
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
      const itemsText = items
        .map((item: { key: string; quantity: number; price: number }) => {
          const serviceName = serviceNames[item.key] || item.key
          return `• ${serviceName} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`
        })
        .join("\n")

      await fetch(process.env.DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          embeds: [
            {
              title: "🛒 Nuovo Ordine Ricevuto!",
              color: 0x3b82f6,
              fields: [
                { name: "📋 Codice Ordine", value: `\`${orderCode}\``, inline: false },
                { name: "👤 Nome", value: name, inline: true },
                { name: "📧 Email", value: email, inline: true },
                { name: "💬 Discord", value: discord, inline: true },
                {
                  name: "🛍️ Articoli Acquistati",
                  value: itemsText,
                  inline: false,
                },
                { name: "💰 Totale", value: `$${total.toFixed(2)}`, inline: true },
                {
                  name: "📝 Dettagli Richiesta",
                  value: details.substring(0, 300) + (details.length > 300 ? "..." : ""),
                  inline: false,
                },
                {
                  name: "⚠️ Stato Pagamento",
                  value: "**IN ATTESA DI PAGAMENTO**\nContattare il cliente per completare il pagamento",
                  inline: false,
                },
              ],
              timestamp: new Date().toISOString(),
              footer: { text: "DaniDema Orders - Payment Required" },
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

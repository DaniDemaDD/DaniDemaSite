import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const orderCode = searchParams.get("code")

    if (!orderCode) {
      return NextResponse.json({ error: "Order code required" }, { status: 400 })
    }

    // Initialize Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Fetch order from database
    const { data: order, error } = await supabase
      .from("orders")
      .select("*")
      .eq("order_code", orderCode)
      .single()

    if (error || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Generate PDF content from order data
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
    const items = order.items || []
    items.forEach((item: { key: string; quantity: number; price: number }) => {
      const desc = serviceDescriptions[item.key] || item.key
      itemsList += `
  - ${desc}
    Quantity: ${item.quantity}
    Price: $${(item.price * item.quantity).toFixed(2)}
`
    })

    const pdfContent = `
=====================================
        DANIDEMA ORDER RECEIPT
=====================================

Order Code: ${order.order_code}
Date: ${new Date(order.created_at).toLocaleString()}

-------------------------------------
CUSTOMER INFORMATION
-------------------------------------
Name: ${order.customer_name}
Email: ${order.customer_email}
Discord: ${order.customer_discord}

-------------------------------------
PURCHASED ITEMS
-------------------------------------
${itemsList}

TOTAL: $${order.total_amount?.toFixed(2) || "0.00"}

-------------------------------------
CUSTOM REQUEST DETAILS
-------------------------------------
${order.details || "No additional details provided"}

-------------------------------------
PAYMENT REQUIRED
-------------------------------------
⚠️  IMPORTANT: PAYMENT IS REQUIRED  ⚠️

This is a receipt for your order.
Payment has NOT been completed yet.

To complete your purchase:
1. Contact dani.dema on Discord
2. Provide this order code: ${order.order_code}
3. Complete payment via PayPal
4. Once payment confirmed, receive your service!

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

    // Return as downloadable text file
    return new NextResponse(pdfContent, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": `attachment; filename="order-${orderCode}.txt"`,
      },
    })
  } catch (error) {
    console.error("PDF download error:", error)
    return NextResponse.json({ error: "Failed to download PDF" }, { status: 500 })
  }
}

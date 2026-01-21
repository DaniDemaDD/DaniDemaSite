import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, customerEmail, customerName } = body

    // Create line items for Stripe
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []

    for (const item of items) {
      const { key, price, quantity, paymentType } = item

      // Create product names
      const productNames: Record<string, string> = {
        discordBots: "Discord Bot Development",
        websites: "Website Development",
        websitesWithDomain: "Website + Domain (Monthly)",
        accounts: "Email Account (Monthly)",
        emails: "Custom Email (Monthly)",
        hosting: "Hosting Forever (Yearly)",
        removeBranding: "Remove Branding (Monthly)",
      }

      // Determine if this is a recurring payment
      const isRecurring = paymentType === "monthly" || paymentType === "yearly"

      if (isRecurring) {
        // Create a Price for recurring payments
        const stripePrice = await stripe.prices.create({
          product_data: {
            name: productNames[key] || key,
          },
          unit_amount: Math.round(price * 100), // Convert to cents
          currency: "usd",
          recurring: {
            interval: paymentType === "monthly" ? "month" : "year",
          },
        })

        lineItems.push({
          price: stripePrice.id,
          quantity,
        })
      } else {
        // One-time payment
        const stripePrice = await stripe.prices.create({
          product_data: {
            name: productNames[key] || key,
          },
          unit_amount: Math.round(price * 100), // Convert to cents
          currency: "usd",
        })

        lineItems.push({
          price: stripePrice.id,
          quantity,
        })
      }
    }

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: lineItems.some((item) => item.price?.toString().includes("recurring")) ? "subscription" : "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/order?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/order?canceled=true`,
      customer_email: customerEmail,
      metadata: {
        customer_name: customerName,
      },
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error("[v0] Stripe checkout error:", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}

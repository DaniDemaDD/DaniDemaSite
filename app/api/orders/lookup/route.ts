import { type NextRequest, NextResponse } from "next/server"
import { list } from "@vercel/blob"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")

  if (!code) {
    return NextResponse.json({ error: "Order code required" }, { status: 400 })
  }

  try {
    // Try to find the order in Blob storage
    const { blobs } = await list({ prefix: `orders/${code}` })

    if (blobs.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Find the JSON file
    const orderBlob = blobs.find((b) => b.pathname.endsWith(".json"))

    if (!orderBlob) {
      return NextResponse.json({ error: "Order data not found" }, { status: 404 })
    }

    // Fetch order data
    const response = await fetch(orderBlob.url)
    const orderData = await response.json()

    // Find receipt
    const receiptBlob = blobs.find((b) => b.pathname.endsWith("-receipt.txt"))

    return NextResponse.json({
      success: true,
      order: orderData,
      receiptUrl: receiptBlob?.url || null,
    })
  } catch (error) {
    console.error("Order lookup error:", error)
    return NextResponse.json({ error: "Failed to lookup order" }, { status: 500 })
  }
}

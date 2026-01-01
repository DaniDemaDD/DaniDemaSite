import { type NextRequest, NextResponse } from "next/server"
import { list } from "@vercel/blob"

export async function GET(request: NextRequest) {
  try {
    // List all orders from Blob storage
    const { blobs } = await list({ prefix: "orders/" })

    // Filter only JSON files (order data)
    const orderBlobs = blobs.filter((b) => b.pathname.endsWith(".json"))

    // Fetch all orders
    const orders = await Promise.all(
      orderBlobs.map(async (blob) => {
        try {
          const response = await fetch(blob.url)
          const orderData = await response.json()
          return orderData
        } catch {
          return null
        }
      }),
    )

    // Filter out nulls and sort by date (newest first)
    const validOrders = orders.filter(Boolean).sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })

    return NextResponse.json({
      success: true,
      orders: validOrders,
      total: validOrders.length,
    })
  } catch (error) {
    console.error("Error listing orders:", error)
    return NextResponse.json({ success: false, error: "Failed to list orders" }, { status: 500 })
  }
}

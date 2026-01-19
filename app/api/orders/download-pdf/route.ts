import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const orderCode = searchParams.get("code")

    if (!orderCode) {
      return NextResponse.json({ error: "Order code required" }, { status: 400 })
    }

    // Fetch the PDF from Blob storage
    const blobUrl = `/images/orders-${orderCode}.jpg`

    const response = await fetch(blobUrl)
    if (!response.ok) {
      return NextResponse.json({ error: "PDF not found" }, { status: 404 })
    }

    const pdfContent = await response.arrayBuffer()

    return new NextResponse(pdfContent, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="order-${orderCode}.pdf"`,
      },
    })
  } catch (error) {
    console.error("PDF download error:", error)
    return NextResponse.json({ error: "Failed to download PDF" }, { status: 500 })
  }
}

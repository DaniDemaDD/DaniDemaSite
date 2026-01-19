import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const orderCode = searchParams.get("code")

    if (!orderCode) {
      return NextResponse.json({ error: "Order code required" }, { status: 400 })
    }

    // Construct Blob storage URL for the PDF
    const blobUrl = `https://${process.env.BLOB_READ_WRITE_TOKEN?.split("_")[0]}.public.blob.vercel-storage.com/orders/${orderCode}-receipt.txt`

    // Fetch PDF from Blob storage
    const response = await fetch(blobUrl)

    if (!response.ok) {
      console.error(`[v0] PDF not found in Blob storage: ${blobUrl}`)
      return NextResponse.json({ error: "Order PDF not found" }, { status: 404 })
    }

    const pdfContent = await response.text()

    // Return as downloadable text file
    return new NextResponse(pdfContent, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": `attachment; filename="order-${orderCode}.txt"`,
      },
    })
  } catch (error) {
    console.error("[v0] PDF download error:", error)
    return NextResponse.json({ error: "Failed to download PDF" }, { status: 500 })
  }
}

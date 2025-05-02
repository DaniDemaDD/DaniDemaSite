import { getSoftwareById } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const software = await getSoftwareById(params.id)

    if (!software) {
      return NextResponse.json({ error: "Software not found" }, { status: 404 })
    }

    return NextResponse.json(software)
  } catch (error) {
    console.error("Error in software/[id] route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

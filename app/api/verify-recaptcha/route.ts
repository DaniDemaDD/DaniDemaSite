import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, version } = body

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: "No token provided",
        },
        { status: 400 },
      )
    }

    if (version === "v2") {
      // Verify reCAPTCHA v2 token
      const verifyResponse = await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          secret: "6LeQmrgrAAAAAN_YcQEFyXmQ2DkA29sJWoM1ELgh",
          response: token,
        }),
      })

      const verifyData = await verifyResponse.json()

      console.log("reCAPTCHA v2 verification response:", verifyData)

      if (verifyData.success) {
        return NextResponse.json({
          success: true,
          version: "v2",
          hostname: verifyData.hostname,
        })
      } else {
        return NextResponse.json(
          {
            success: false,
            error: "reCAPTCHA v2 verification failed",
            details: verifyData["error-codes"] || [],
          },
          { status: 400 },
        )
      }
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Unsupported reCAPTCHA version",
        },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("reCAPTCHA verification error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}

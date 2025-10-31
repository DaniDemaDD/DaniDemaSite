import { type NextRequest, NextResponse } from "next/server"

const DISCORD_CLIENT_ID = "1433882980450963682"
const DISCORD_REDIRECT_URI = "https://danidema.xyz/callback/discord"

// Allowed Discord emails for dashboard access
const ALLOWED_DISCORD_EMAILS = ["dani.dema@discord.com", "daniele@demartini.biz"]

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json({ success: false, error: "No authorization code provided" }, { status: 400 })
    }

    // Exchange code for access token
    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET || "",
        grant_type: "authorization_code",
        code: code,
        redirect_uri: DISCORD_REDIRECT_URI,
      }),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json()
      console.error("Discord token exchange failed:", errorData)
      return NextResponse.json({ success: false, error: "Failed to exchange authorization code" }, { status: 400 })
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    // Get user info
    const userResponse = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!userResponse.ok) {
      return NextResponse.json({ success: false, error: "Failed to fetch user info" }, { status: 400 })
    }

    const userData = await userResponse.json()

    // Check if user email is allowed (for dani.dema or daniele@demartini.biz)
    const userEmail = userData.email?.toLowerCase()
    const isAllowed =
      ALLOWED_DISCORD_EMAILS.some((email) => userEmail?.includes(email.split("@")[0])) ||
      userEmail === "daniele@demartini.biz"

    if (!isAllowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Your Discord account is not authorized to access the dashboard",
        },
        { status: 403 },
      )
    }

    // Return user info
    return NextResponse.json({
      success: true,
      user: {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        avatar: userData.avatar
          ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`
          : "/placeholder.svg?height=40&width=40",
      },
    })
  } catch (error) {
    console.error("Discord callback error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

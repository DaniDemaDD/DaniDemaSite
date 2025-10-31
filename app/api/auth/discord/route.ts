import { NextResponse } from "next/server"

export async function GET() {
  const clientId = "1433882980450963682"
  const redirectUri = "https://danidema.xyz/callback/discord"
  const scope = "identify email"

  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&prompt=consent`

  return NextResponse.redirect(discordAuthUrl)
}

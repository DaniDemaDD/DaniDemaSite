"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import { AuthSession } from "@/lib/auth"

export default function DiscordCallbackPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("Processing Discord authentication...")

  useEffect(() => {
    const code = searchParams.get("code")
    const error = searchParams.get("error")

    if (error) {
      setStatus("error")
      setMessage("Discord authentication was cancelled or failed")
      setTimeout(() => router.push("/login"), 3000)
      return
    }

    if (!code) {
      setStatus("error")
      setMessage("No authorization code received")
      setTimeout(() => router.push("/login"), 3000)
      return
    }

    // Exchange code for user info
    fetch("/api/auth/discord/callback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // Store Discord user info
          AuthSession.setDiscordUser(data.user)
          AuthSession.setLoginStatus(true)
          AuthSession.set2FAStatus(true) // Discord login bypasses 2FA

          setStatus("success")
          setMessage(`Welcome, ${data.user.username}!`)

          // Redirect to dashboard
          setTimeout(() => {
            router.push(
              "/admin-dashboard-management-panel-secure-access-control-system-authenticated-users-only-restricted-area-authorized-personnel-verification-required",
            )
          }, 2000)
        } else {
          setStatus("error")
          setMessage(data.error || "Authentication failed")
          setTimeout(() => router.push("/login"), 3000)
        }
      })
      .catch((err) => {
        console.error("Discord callback error:", err)
        setStatus("error")
        setMessage("An error occurred during authentication")
        setTimeout(() => router.push("/login"), 3000)
      })
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 text-white flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 shadow-2xl max-w-md w-full text-center">
        {status === "loading" && (
          <>
            <Loader2 className="w-16 h-16 text-indigo-400 animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Authenticating...</h2>
            <p className="text-white/70">{message}</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Success!</h2>
            <p className="text-white/70">{message}</p>
            <p className="text-sm text-white/50 mt-4">Redirecting to dashboard...</p>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Authentication Failed</h2>
            <p className="text-white/70">{message}</p>
            <p className="text-sm text-white/50 mt-4">Redirecting to login...</p>
          </>
        )}
      </div>
    </div>
  )
}

"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Eye, EyeOff, Lock, Mail, Shield } from "lucide-react"
import { AuthSession } from "@/lib/auth"

declare global {
  interface Window {
    grecaptcha?: {
      render: (container: HTMLElement, options: any) => void
      getResponse: () => string
      reset: () => void
    }
    onRecaptchaLoad?: () => void
  }
}

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false)
  const recaptchaRef = useRef<HTMLDivElement>(null)

  // Load reCAPTCHA v2 script
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit"
    script.async = true
    script.defer = true

    if (typeof window !== "undefined") {
      window.onRecaptchaLoad = () => {
        if (recaptchaRef.current && window.grecaptcha) {
          try {
            window.grecaptcha.render(recaptchaRef.current, {
              sitekey: "6LeQmrgrAAAAANoWOYeesTD6ncuaXJqVvdXLBe2-",
              theme: "dark",
            })
            setRecaptchaLoaded(true)
            console.log("reCAPTCHA v2 loaded successfully")
          } catch (error) {
            console.error("reCAPTCHA render error:", error)
          }
        }
      }
    }

    document.head.appendChild(script)

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Verify reCAPTCHA v2
      if (typeof window === "undefined" || !window.grecaptcha || !recaptchaLoaded) {
        throw new Error("reCAPTCHA not loaded")
      }

      const recaptchaResponse = window.grecaptcha.getResponse()
      if (!recaptchaResponse) {
        throw new Error("Please complete the reCAPTCHA verification")
      }

      const validAdmins = [
        { email: "daniele@demartini.biz", password: "FabioDaniele11$" },
        { email: "admin@danidema.xyz", password: "FabioDaniele11$" },
        { email: "chiccoderiso@operator.danidema.xyz", password: "PaninoColSalame22" },
        { email: "nas@operator.danidema.xyz", password: "DaniDemaADMIN103fhaHH" },
      ]

      const isValidAdmin = validAdmins.some((admin) => email === admin.email && password === admin.password)

      if (!isValidAdmin) {
        throw new Error("Invalid email or password")
      }

      console.log("Credentials verified successfully")

      // Verify reCAPTCHA token with backend
      const verifyResponse = await fetch("/api/verify-recaptcha", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: recaptchaResponse,
          version: "v2",
        }),
      })

      const verifyData = await verifyResponse.json()

      if (!verifyData.success) {
        throw new Error("reCAPTCHA verification failed")
      }

      console.log("reCAPTCHA v2 verified successfully")

      const accountsWithout2FA = ["chiccoderiso@operator.danidema.xyz", "nas@operator.danidema.xyz"]
      const requiresVerification = !accountsWithout2FA.includes(email)

      // Set login status
      AuthSession.setLoginStatus(true)
      AuthSession.set2FAStatus(false)

      // Simulate login process
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (requiresVerification) {
        // Require 2FA for main admins
        window.location.href = "/2fa"
      } else {
        // Bypass 2FA for Bolzano operators - set as verified and go directly to dashboard
        AuthSession.set2FAStatus(true)
        window.location.href =
          "/admin-dashboard-management-panel-secure-access-control-system-authenticated-users-only-restricted-area-authorized-personnel-verification-required"
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
      // Reset reCAPTCHA on error
      if (typeof window !== "undefined" && window.grecaptcha) {
        try {
          window.grecaptcha.reset()
        } catch (resetError) {
          console.error("reCAPTCHA reset error:", resetError)
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleDiscordLogin = () => {
    window.location.href = "/api/auth/discord"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/abstract-geometric-pattern.png')] opacity-5"></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-full mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Login</h1>
          <p className="text-purple-300">Access your dashboard</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 shadow-2xl">
          <button
            onClick={handleDiscordLogin}
            className="w-full flex items-center justify-center gap-3 bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 mb-6"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
            Login with Discord
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-transparent text-white/60">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-purple-200 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-purple-200 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* reCAPTCHA v2 Widget */}
            <div className="flex justify-center">
              <div ref={recaptchaRef} className="transform scale-90"></div>
            </div>

            {/* reCAPTCHA v2 Notice */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 text-sm text-purple-300">
                <Shield className="w-4 h-4" />
                <span>Protected by reCAPTCHA v2</span>
              </div>
              {recaptchaLoaded && <div className="text-xs text-green-400 mt-1">✓ Security verification loaded</div>}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 text-red-300 text-sm">
                <Shield className="w-4 h-4 inline mr-2" />
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !recaptchaLoaded}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Verifying & Logging in...
                </div>
              ) : (
                "Login"
              )}
            </button>

            {/* reCAPTCHA v2 Terms */}
            <div className="text-xs text-purple-400 text-center">
              This site is protected by reCAPTCHA and the Google{" "}
              <a href="https://policies.google.com/privacy" className="underline hover:text-purple-300">
                Privacy Policy
              </a>{" "}
              and{" "}
              <a href="https://policies.google.com/terms" className="underline hover:text-purple-300">
                Terms of Service
              </a>{" "}
              apply.
            </div>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center">
            <Link href="/" className="text-purple-300 hover:text-white transition-colors text-sm">
              ← Back to Homepage
            </Link>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-purple-400 text-xs">This is a secure admin login. Unauthorized access is prohibited.</p>
        </div>
      </div>
    </div>
  )
}

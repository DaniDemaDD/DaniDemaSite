"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Eye, EyeOff, Lock, Mail, Shield } from "lucide-react"

declare global {
  interface Window {
    grecaptcha: any
    onRecaptchaLoad: () => void
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

    window.onRecaptchaLoad = () => {
      if (recaptchaRef.current && window.grecaptcha) {
        window.grecaptcha.render(recaptchaRef.current, {
          sitekey: "6LeQmrgrAAAAANoWOYeesTD6ncuaXJqVvdXLBe2-", // Chiave v2
          theme: "dark",
        })
        setRecaptchaLoaded(true)
        console.log("reCAPTCHA v2 loaded successfully")
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
      if (!window.grecaptcha || !recaptchaLoaded) {
        throw new Error("reCAPTCHA not loaded")
      }

      const recaptchaResponse = window.grecaptcha.getResponse()
      if (!recaptchaResponse) {
        throw new Error("Please complete the reCAPTCHA verification")
      }

      // Verify credentials
      if (email !== "daniele@demartini.biz" || password !== "FabioDaniele11$") {
        throw new Error("Invalid email or password")
      }

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

      // Simulate login process
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirect to the very long URL dashboard
      window.location.href =
        "/admin-dashboard-management-panel-secure-access-control-system-authenticated-users-only-restricted-area-authorized-personnel-verification-required"
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
      // Reset reCAPTCHA on error
      if (window.grecaptcha) {
        window.grecaptcha.reset()
      }
    } finally {
      setIsLoading(false)
    }
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

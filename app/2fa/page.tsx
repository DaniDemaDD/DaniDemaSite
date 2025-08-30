"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Shield, Key, ArrowLeft } from "lucide-react"
import { AuthSession } from "@/lib/auth"
import { verifyTOTP } from "@/lib/totp"

export default function TwoFactorPage() {
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    // Check if user is logged in
    if (!AuthSession.getLoginStatus()) {
      window.location.href = "/login"
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      if (code.length !== 6) {
        throw new Error("Please enter a 6-digit code")
      }

      // Verify TOTP code with the secret key
      const secret = "BJWU6SPAJK2XV2LJ7TTCS7QJSYGK3EKR"
      const isValid = await verifyTOTP(code, secret)

      if (!isValid) {
        throw new Error("Invalid 2FA code. Please try again.")
      }

      // Set 2FA status
      AuthSession.set2FAStatus(true)

      // Simulate verification process
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirect to dashboard
      window.location.href =
        "/admin-dashboard-management-panel-secure-access-control-system-authenticated-users-only-restricted-area-authorized-personnel-verification-required"
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed")
      setCode("") // Clear the code on error
    } finally {
      setIsLoading(false)
    }
  }

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6)
    setCode(value)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/abstract-geometric-pattern.png')] opacity-5"></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Key className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Two-Factor Authentication</h1>
          <p className="text-blue-300">Enter your 6-digit verification code</p>
        </div>

        {/* 2FA Form */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Service Info */}
            <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4 text-center">
              <div className="text-sm text-blue-200 space-y-1">
                <div>
                  🧾 <strong>Servizio:</strong> DaniDema.xyz | login
                </div>
                <div>
                  👤 <strong>Utente:</strong> FOUNDER
                </div>
                <div>
                  🔐 <strong>Status:</strong> Logged In ✓
                </div>
              </div>
            </div>

            {/* Code Input */}
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-blue-200 mb-2">
                Verification Code
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={code}
                  onChange={handleCodeChange}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white text-center text-2xl font-mono tracking-widest placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
              </div>
              <p className="text-xs text-blue-400 mt-2 text-center">
                Enter the 6-digit code from your authenticator app
              </p>
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
              disabled={isLoading || code.length !== 6}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Verifying...
                </div>
              ) : (
                "Verify & Continue"
              )}
            </button>

            {/* Help Text */}
            <div className="text-center">
              <p className="text-xs text-blue-400">Use your authenticator app to generate the verification code</p>
            </div>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                AuthSession.clearSession()
                window.location.href = "/login"
              }}
              className="inline-flex items-center gap-2 text-blue-300 hover:text-white transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </button>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-blue-400 text-xs">🔒 Two-factor authentication provides an additional layer of security</p>
        </div>
      </div>
    </div>
  )
}

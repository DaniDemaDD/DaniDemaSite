"use client"

import type React from "react"

import { useState } from "react"
import { Shield, AlertTriangle, Check, Lock, Send } from "lucide-react"

export default function SecurityPage() {
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState("")

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsVerifying(true)
    setError("")

    // Simulate verification
    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (verificationCode === "123456") {
      setIsVerified(true)
    } else {
      setError("Invalid verification code")
    }

    setIsVerifying(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/abstract-geometric-pattern.png')] opacity-5"></div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-12 h-12 text-purple-400" />
            <h1 className="text-4xl md:text-5xl font-bold">Security Center</h1>
          </div>
          <p className="text-xl text-white/70">Advanced verification and bot management system</p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {!isVerified ? (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <Lock className="w-8 h-8 text-yellow-400" />
                <h2 className="text-2xl font-bold">Verification Required</h2>
              </div>

              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-yellow-200 font-medium">Access Restricted</p>
                    <p className="text-yellow-100/80 text-sm mt-1">
                      This page contains sensitive information. Please verify your identity to continue.
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleVerification} className="space-y-4">
                <div>
                  <label htmlFor="code" className="block text-sm font-medium mb-2">
                    Enter Verification Code
                  </label>
                  <input
                    type="text"
                    id="code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    required
                  />
                  {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 rounded-lg font-bold transition-colors disabled:cursor-not-allowed"
                >
                  {isVerifying ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Verify
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-white/60">
                  Demo code: <span className="text-purple-400 font-mono">123456</span>
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Success Message */}
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
                <div className="flex items-center gap-3">
                  <Check className="w-8 h-8 text-green-400" />
                  <div>
                    <p className="text-green-200 font-bold text-lg">Verification Successful</p>
                    <p className="text-green-100/80 text-sm">You now have access to the security dashboard</p>
                  </div>
                </div>
              </div>

              {/* Discord Bot Section */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="w-8 h-8 text-blue-400" />
                  <h2 className="text-2xl font-bold">Discord Bot Control</h2>
                </div>

                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Bot Status</span>
                      <span className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-green-400 text-sm">Online</span>
                      </span>
                    </div>
                    <p className="text-sm text-white/60">Main Discord bot is running and responding to commands</p>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Active Servers</span>
                      <span className="text-blue-400 font-bold">3</span>
                    </div>
                    <p className="text-sm text-white/60">Bot is currently active in 3 Discord servers</p>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Commands Processed</span>
                      <span className="text-purple-400 font-bold">1,247</span>
                    </div>
                    <p className="text-sm text-white/60">Total commands processed in the last 24 hours</p>
                  </div>
                </div>

                <div className="mt-6 grid md:grid-cols-2 gap-3">
                  <button className="px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-lg text-blue-300 hover:bg-blue-600/30 transition-colors">
                    View Logs
                  </button>
                  <button className="px-4 py-2 bg-purple-600/20 border border-purple-500/30 rounded-lg text-purple-300 hover:bg-purple-600/30 transition-colors">
                    Restart Bot
                  </button>
                </div>
              </div>

              {/* Security Settings */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <h3 className="text-xl font-bold mb-4">Security Settings</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span>Two-Factor Authentication</span>
                    <span className="text-green-400 text-sm">Enabled</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span>API Rate Limiting</span>
                    <span className="text-green-400 text-sm">Active</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span>Webhook Notifications</span>
                    <span className="text-green-400 text-sm">Configured</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

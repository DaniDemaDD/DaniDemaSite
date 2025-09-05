"use client"

import { useState } from "react"
import { Bot, Plus, Shield, ExternalLink, X, AlertTriangle, Zap } from "lucide-react"
import Link from "next/link"

export default function NovaBotPage() {
  const [showTermsModal, setShowTermsModal] = useState(false)

  const handleAddBot = () => {
    setShowTermsModal(true)
  }

  const acceptTermsAndRedirect = () => {
    setShowTermsModal(false)
    window.open(
      "https://discord.com/oauth2/authorize?client_id=1404471165031813271&permissions=8&integration_type=0&scope=bot",
      "_blank",
    )
  }

  const commands = [
    { name: "!setup", description: "Server configuration utility" },
    { name: "!info [@user]", description: "User information and statistics" },
    { name: "!invite", description: "Bot invitation management" },
    { name: "!fakenitro", description: "Promotional content generator" },
    { name: "/dashboard", description: "Custom settings panel" },
    { name: "!help", description: "Command assistance" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
      {/* Header */}
      <header className="container mx-auto px-6 py-8">
        <nav className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Bot className="w-8 h-8 text-indigo-400" />
            <h1 className="text-2xl font-bold">NovaBot</h1>
          </div>
          <Link href="/" className="text-indigo-300 hover:text-white transition-colors duration-200">
            ← Back to DaniDema
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Bot Logo */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-indigo-600 rounded-full mb-6">
              <Bot className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400 mb-4">
              NovaBot
            </h1>
            <p className="text-xl md:text-2xl text-indigo-200 mb-4">Advanced Discord Management</p>

            {/* Disclaimer */}
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 font-semibold">Important Notice</span>
              </div>
              <p className="text-yellow-200 text-sm">
                This bot is <strong>not my creation</strong>. I am not responsible for any actions, damages, or
                consequences resulting from the use of this bot. Use at your own risk and responsibility.
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Shield className="w-8 h-8 text-indigo-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Server Management</h3>
              <p className="text-indigo-200 text-sm">Comprehensive server administration tools</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Bot className="w-8 h-8 text-indigo-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">User Analytics</h3>
              <p className="text-indigo-200 text-sm">Detailed user statistics and tracking</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Zap className="w-8 h-8 text-indigo-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Custom Tools</h3>
              <p className="text-indigo-200 text-sm">Specialized utilities and features</p>
            </div>
          </div>

          {/* Add Bot Button */}
          <div className="mb-16">
            <button
              onClick={handleAddBot}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              <Plus className="w-6 h-6" />
              Add NovaBot to Your Server
            </button>
            <p className="text-indigo-300 text-sm mt-4">Click to invite NovaBot to your Discord server</p>
          </div>

          {/* Commands Section */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 text-left max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Available Commands</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {commands.map((command, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <code className="text-indigo-300 font-mono text-lg">{command.name}</code>
                  <p className="text-white/70 text-sm mt-1">{command.description}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-6">
              <p className="text-indigo-300 text-sm">Use !help in your server for detailed command information</p>
            </div>
          </div>
        </div>
      </main>

      {/* Terms Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-xl p-6 border border-white/20 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <h3 className="text-lg font-bold">Terms of Service</h3>
              </div>
              <button onClick={() => setShowTermsModal(false)} className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-white/80 text-sm leading-relaxed mb-4">
                By adding NovaBot to your server, you acknowledge that all bot functions are provided for{" "}
                <strong className="text-yellow-400">informational purposes only</strong>. Use responsibly and in
                accordance with Discord's Terms of Service.
              </p>
              <p className="text-red-300 text-xs leading-relaxed">
                <strong>Disclaimer:</strong> This bot is not created by me. I am not responsible for any damages,
                actions, or consequences resulting from its use. Proceed at your own risk.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowTermsModal(false)}
                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={acceptTermsAndRedirect}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-pink-600 rounded-lg text-white font-bold hover:from-indigo-700 hover:to-pink-700 transition-colors flex items-center justify-center gap-2"
              >
                Accept & Add Bot
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 border-t border-white/10 mt-16">
        <div className="text-center text-indigo-300">
          <p className="text-sm">
            © 2024 NovaBot - Third-party Discord Bot hosted by{" "}
            <Link href="/" className="text-indigo-400 hover:text-white transition-colors">
              DaniDema
            </Link>
          </p>
          <p className="text-xs text-white/40 mt-1">
            Not affiliated with or created by the site owner. Use at your own discretion.
          </p>
        </div>
      </footer>
    </div>
  )
}

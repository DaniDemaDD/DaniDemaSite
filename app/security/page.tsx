"use client"

import { useState } from "react"
import { Shield, Plus, ExternalLink, X, AlertTriangle, Lock, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function SecurityPage() {
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)

  const handleAddBot = () => {
    setShowTermsModal(true)
    setTermsAccepted(false)
  }

  const acceptTermsAndRedirect = () => {
    if (!termsAccepted) {
      alert("⚠️ You must accept the Terms of Service to continue")
      return
    }
    setShowTermsModal(false)
    window.open("https://discord.com/oauth2/authorize?client_id=1419761005420085369", "_blank")
  }

  const features = [
    {
      name: "Anti-Nuke Protection",
      description: "Advanced protection against server destruction attempts",
      icon: "🛡️",
    },
    {
      name: "Automated Backups",
      description: "Complete server backups with scheduled automation",
      icon: "💾",
    },
    {
      name: "Advanced Logging",
      description: "Detailed event logging for all server activities",
      icon: "📋",
    },
    {
      name: "Moderation Tools",
      description: "Complete moderation suite with ban, kick, warn, timeout",
      icon: "🔨",
    },
    {
      name: "Verification System",
      description: "User verification with role management",
      icon: "✅",
    },
    {
      name: "Whitelist System",
      description: "Protected users from automated sanctions",
      icon: "⭐",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 text-white">
      {/* Header */}
      <header className="container mx-auto px-6 py-8">
        <nav className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-400" />
            <h1 className="text-2xl font-bold">Security Bot v2.0</h1>
          </div>
          <Link href="/" className="text-blue-300 hover:text-white transition-colors duration-200">
            ← Back to DaniDema
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Bot Logo */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full mb-6 shadow-2xl shadow-blue-500/25">
              <Shield className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-4">
              Security Bot
            </h1>
            <p className="text-xl md:text-2xl text-blue-200 mb-2">Advanced Discord Security & Automation</p>
            <p className="text-sm text-blue-300">Version 2.0</p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-blue-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.name}</h3>
                <p className="text-blue-200 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Add Bot Button */}
          <div className="mb-16">
            <button
              onClick={handleAddBot}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/50"
            >
              <Plus className="w-6 h-6" />
              Add Security Bot to Your Server
            </button>
            <p className="text-blue-300 text-sm mt-4">Click to invite Security Bot to your Discord server</p>
          </div>

          {/* Key Commands Section */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 text-left max-w-4xl mx-auto mb-8">
            <h2 className="text-3xl font-bold mb-8 text-center">📋 Key Commands</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <code className="text-blue-300 font-mono text-sm">/backup crea</code>
                <p className="text-white/70 text-xs mt-1">Create instant server backup</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <code className="text-blue-300 font-mono text-sm">/antinuke configura</code>
                <p className="text-white/70 text-xs mt-1">Configure anti-nuke protection</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <code className="text-blue-300 font-mono text-sm">/log</code>
                <p className="text-white/70 text-xs mt-1">Set up logging channel</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <code className="text-blue-300 font-mono text-sm">/verify-setup</code>
                <p className="text-white/70 text-xs mt-1">Configure verification system</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <code className="text-blue-300 font-mono text-sm">/ban</code>
                <p className="text-white/70 text-xs mt-1">Ban user with reason</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <code className="text-blue-300 font-mono text-sm">/whitelist aggiungi</code>
                <p className="text-white/70 text-xs mt-1">Add user to whitelist</p>
              </div>
            </div>
            <div className="text-center mt-6">
              <p className="text-blue-300 text-sm">Use /info for complete command list</p>
            </div>
          </div>
        </div>
      </main>

      {/* Terms Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-gray-900 rounded-xl p-6 border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 sticky top-0 bg-gray-900 pb-4">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-400" />
                <h3 className="text-xl font-bold">Terms of Service - Security Bot v2.0</h3>
              </div>
              <button onClick={() => setShowTermsModal(false)} className="text-white/60 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4 text-sm text-white/80 leading-relaxed mb-6">
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                <p className="text-blue-300 font-semibold mb-2">📋 Please read carefully before accepting</p>
              </div>

              <div>
                <h4 className="text-lg font-bold text-blue-300 mb-2">1. Responsible Use and Moderation</h4>
                <p>
                  The user (owner or server administrator) commits to using Security Bot v2.0 features exclusively for
                  security, moderation, and stability of their Discord community. Each moderation command (ban, kick,
                  warn, clear, timeout, backup) must be used responsibly and proportionally to the situation, avoiding
                  deliberate abuse or vindictive behavior.
                </p>
                <p className="mt-2">
                  Anti-nuke features should only be used in real emergencies or concrete threats like raids, nukes, or
                  malicious BOTs. The user assumes full legal and material responsibility for actions performed through
                  the bot within their server.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-bold text-blue-300 mb-2">2. Required Permissions</h4>
                <p>For proper functioning, Security Bot v2.0 requires the following Discord permissions:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Administrator (backup management, restores, anti-nuke, log configuration)</li>
                  <li>Manage Channels (creation/deletion, permission management)</li>
                  <li>Manage Roles (Verified/Unverified role assignment)</li>
                  <li>Ban/Kick Users and message moderation</li>
                </ul>
                <p className="mt-2">
                  Insufficient permissions may limit or prevent critical functions. It's recommended to position
                  Security Bot v2.0 among the highest roles in the server.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-bold text-blue-300 mb-2">3. Privacy, Data Security and Logging</h4>
                <p>
                  Security Bot v2.0 saves and stores locally only information strictly necessary for security features:
                </p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Security events/logs (timestamp, user ID, event type, server)</li>
                  <li>Log configurations, backups, anti-nuke, admin, whitelist</li>
                  <li>Warns, bans, and disciplinary actions</li>
                  <li>Backup files (metadata only: server, roles, channels - never messages or DMs)</li>
                </ul>
                <p className="mt-2">
                  No private data or direct messages are ever transferred outside, shared with others, or saved for
                  third-party use. The bot does not perform analytics tracking, does not sell statistics, and does not
                  integrate advertising.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-bold text-blue-300 mb-2">4. Backup and Data Recovery</h4>
                <p>All backup and restore functions must be used with care and awareness:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>The user is fully responsible for data entered and permissions saved in generated backups</li>
                  <li>
                    Restoration may irreversibly delete, move, or modify channels, roles, and permissions: testing on a
                    test server is recommended
                  </li>
                  <li>
                    The developer is not responsible for data loss due to incomplete backups, incorrect configurations,
                    or insufficient bot permissions
                  </li>
                  <li>Backups never include historical messages, chats, or member DMs</li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-bold text-blue-300 mb-2">5. Advanced Usage Limitations</h4>
                <p>Some advanced features are only available with appropriate permissions:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Anti-nuke, restore, backup: only for owner/server admin</li>
                  <li>Log, verify setup, whitelist/admin: only members with "Manage Server" enabled</li>
                  <li>Moderation commands (ban/kick/warn): associated with "Moderate Members" permission</li>
                </ul>
                <p className="mt-2">
                  It is forbidden to force Security Bot v2.0 to act on servers where it has not been officially invited
                  or for which you are not an authorized owner/admin.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-bold text-blue-300 mb-2">6. Updates, Support and Warranties</h4>
                <p>
                  Security Bot v2.0 is constantly updated with new fixes and features. However, it is provided "as is":
                </p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>No guarantee of backups always working in every scenario</li>
                  <li>Support is provided on a "best effort" basis through official channels</li>
                  <li>
                    Bugs, crashes, or malfunctions with limited/misaligned permissions are not attributable to the
                    developer
                  </li>
                  <li>
                    The developer reserves the right to introduce changes, disable obsolete features, or limit access in
                    case of abuse
                  </li>
                </ul>
              </div>

              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                <p className="text-yellow-300 font-semibold">
                  ⚠️ By using Security Bot v2.0, you automatically accept all terms above
                </p>
              </div>
            </div>

            {/* Terms Acceptance Checkbox */}
            <div className="bg-white/5 rounded-lg p-4 border border-white/10 mb-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-white/20 bg-white/10 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-white text-sm">
                  I have read and accept the Terms of Service for Security Bot v2.0. I understand that I am responsible
                  for all actions performed through the bot and that I must use it responsibly and in accordance with
                  Discord's Terms of Service.
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowTermsModal(false)}
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={acceptTermsAndRedirect}
                disabled={!termsAccepted}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg text-white font-bold hover:from-blue-700 hover:to-cyan-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {termsAccepted ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Accept & Add Bot
                    <ExternalLink className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-5 h-5" />
                    Accept Terms First
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 border-t border-white/10 mt-16">
        <div className="text-center text-blue-300">
          <p className="text-sm">
            © 2025 Security Bot v2.0 - Advanced Discord Security by{" "}
            <Link href="/" className="text-blue-400 hover:text-white transition-colors">
              DaniDema
            </Link>
          </p>
          <p className="text-xs text-white/40 mt-1">Protect your community with confidence</p>
        </div>
      </footer>
    </div>
  )
}

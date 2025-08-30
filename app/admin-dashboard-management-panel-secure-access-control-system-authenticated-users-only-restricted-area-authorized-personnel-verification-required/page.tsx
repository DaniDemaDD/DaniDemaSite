"use client"

import { useEffect, useState } from "react"
import {
  Settings,
  Shield,
  LogOut,
  BarChart3,
  Bot,
  Globe,
  Terminal,
  Square,
  Plus,
  Edit,
  Trash2,
  Eye,
  Save,
} from "lucide-react"
import { AuthSession } from "@/lib/auth"

type DashboardSection = "overview" | "analytics" | "site-editor" | "bot-manager" | "settings"

export default function AdminDashboardPage() {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeSection, setActiveSection] = useState<DashboardSection>("overview")

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      const isLoggedIn = AuthSession.getLoginStatus()
      const is2FAVerified = AuthSession.get2FAStatus()

      if (!isLoggedIn) {
        window.location.href = "/login"
        return
      }

      if (!is2FAVerified) {
        window.location.href = "/2fa"
        return
      }

      setIsAuthorized(true)
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const handleLogout = () => {
    AuthSession.clearSession()
    window.location.href = "/"
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-300">Verifying access...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  const menuItems = [
    { id: "overview", label: "Overview", icon: Shield },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "site-editor", label: "Site Editor", icon: Globe },
    { id: "bot-manager", label: "Bot Manager", icon: Bot },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/abstract-geometric-pattern.png')] opacity-5"></div>

      <div className="relative z-10 flex">
        {/* Sidebar */}
        <div className="w-64 bg-black/20 backdrop-blur-sm border-r border-white/10 min-h-screen">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <Shield className="w-8 h-8 text-blue-400" />
              <h1 className="text-xl font-bold">Admin Panel</h1>
            </div>

            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id as DashboardSection)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      activeSection === item.id
                        ? "bg-blue-600/30 border border-blue-500/50 text-blue-300"
                        : "hover:bg-white/10 text-white/70 hover:text-white"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </button>
                )
              })}
            </nav>

            <div className="mt-8 pt-8 border-t border-white/10">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-300 hover:bg-red-600/20 transition-all duration-200"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {activeSection === "overview" && <OverviewSection />}
          {activeSection === "analytics" && <AnalyticsSection />}
          {activeSection === "site-editor" && <SiteEditorSection />}
          {activeSection === "bot-manager" && <BotManagerSection />}
          {activeSection === "settings" && <SettingsSection />}
        </div>
      </div>
    </div>
  )
}

// Overview Section Component
function OverviewSection() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Dashboard Overview</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-8 h-8 text-green-400" />
            <h3 className="text-lg font-semibold">Today's Visits</h3>
          </div>
          <p className="text-3xl font-bold text-green-400">1,247</p>
          <p className="text-sm text-white/60">+12% from yesterday</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <Bot className="w-8 h-8 text-blue-400" />
            <h3 className="text-lg font-semibold">Active Bots</h3>
          </div>
          <p className="text-3xl font-bold text-blue-400">3/10</p>
          <p className="text-sm text-white/60">7 slots available</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-8 h-8 text-purple-400" />
            <h3 className="text-lg font-semibold">Site Status</h3>
          </div>
          <p className="text-3xl font-bold text-green-400">Online</p>
          <p className="text-sm text-white/60">99.9% uptime</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-orange-400" />
            <h3 className="text-lg font-semibold">Security</h3>
          </div>
          <p className="text-3xl font-bold text-green-400">Secure</p>
          <p className="text-sm text-white/60">2FA Active</p>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
        <h3 className="text-2xl font-bold mb-4">Quick Actions</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button className="flex items-center gap-3 p-4 bg-blue-600/20 border border-blue-500/30 rounded-lg hover:bg-blue-600/30 transition-all duration-200">
            <Plus className="w-5 h-5" />
            Create New Bot
          </button>
          <button className="flex items-center gap-3 p-4 bg-purple-600/20 border border-purple-500/30 rounded-lg hover:bg-purple-600/30 transition-all duration-200">
            <Edit className="w-5 h-5" />
            Edit Site
          </button>
          <button className="flex items-center gap-3 p-4 bg-green-600/20 border border-green-500/30 rounded-lg hover:bg-green-600/30 transition-all duration-200">
            <Eye className="w-5 h-5" />
            View Analytics
          </button>
        </div>
      </div>
    </div>
  )
}

// Analytics Section Component
function AnalyticsSection() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Site Analytics</h2>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold mb-4">Today</h3>
          <p className="text-3xl font-bold text-blue-400">1,247</p>
          <p className="text-sm text-white/60">Unique visitors</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold mb-4">This Month</h3>
          <p className="text-3xl font-bold text-green-400">34,521</p>
          <p className="text-sm text-white/60">Total visits</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold mb-4">This Year</h3>
          <p className="text-3xl font-bold text-purple-400">412,893</p>
          <p className="text-sm text-white/60">All time visits</p>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
        <h3 className="text-xl font-bold mb-6">Visitor Chart</h3>
        <div className="h-64 bg-white/5 rounded-lg flex items-center justify-center">
          <p className="text-white/60">Chart visualization will be implemented here</p>
        </div>
      </div>
    </div>
  )
}

// Site Editor Section Component
function SiteEditorSection() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Site Editor - sike.gg</h2>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-bold mb-6">Content Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Site Title</label>
              <input
                type="text"
                defaultValue="sike.gg"
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <input
                type="text"
                defaultValue="Discord Moderation Bot"
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Discord Invite URL</label>
              <input
                type="url"
                defaultValue="https://discord.com/oauth2/authorize?client_id=1403453249280802911"
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-bold mb-6">Style Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Primary Color</label>
              <input
                type="color"
                defaultValue="#8b5cf6"
                className="w-full h-10 bg-white/5 border border-white/20 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Secondary Color</label>
              <input
                type="color"
                defaultValue="#ec4899"
                className="w-full h-10 bg-white/5 border border-white/20 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Font Size (px)</label>
              <input
                type="number"
                defaultValue="16"
                min="12"
                max="24"
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
        <h3 className="text-xl font-bold mb-6">Terms of Service Editor</h3>
        <textarea
          rows={10}
          defaultValue="Terms of Service content here..."
          className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
        <div className="mt-4 flex gap-4">
          <button className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors">
            <Save className="w-4 h-4" />
            Save Changes
          </button>
          <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
            <Eye className="w-4 h-4" />
            Preview Site
          </button>
        </div>
      </div>
    </div>
  )
}

// Bot Manager Section Component
function BotManagerSection() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Discord Bot Manager</h2>
        <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
          Create New Bot (3/10)
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Bot Card Example */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold">sike.gg Bot</h3>
              <p className="text-white/60">Moderation bot for Discord</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-sm text-green-400">Running</span>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Language:</span>
              <span>JavaScript</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Uptime:</span>
              <span>2d 14h 32m</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Memory:</span>
              <span>45.2 MB</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-1 bg-red-600/20 border border-red-500/30 rounded text-red-300 hover:bg-red-600/30 transition-colors text-sm">
              <Square className="w-3 h-3" />
              Stop
            </button>
            <button className="flex items-center gap-2 px-3 py-1 bg-blue-600/20 border border-blue-500/30 rounded text-blue-300 hover:bg-blue-600/30 transition-colors text-sm">
              <Terminal className="w-3 h-3" />
              Console
            </button>
            <button className="flex items-center gap-2 px-3 py-1 bg-purple-600/20 border border-purple-500/30 rounded text-purple-300 hover:bg-purple-600/30 transition-colors text-sm">
              <Edit className="w-3 h-3" />
              Edit
            </button>
            <button className="flex items-center gap-2 px-3 py-1 bg-red-600/20 border border-red-500/30 rounded text-red-300 hover:bg-red-600/30 transition-colors text-sm">
              <Trash2 className="w-3 h-3" />
              Delete
            </button>
          </div>
        </div>

        {/* Empty Slot */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 border-dashed">
          <div className="text-center">
            <Bot className="w-12 h-12 text-white/30 mx-auto mb-4" />
            <p className="text-white/60 mb-4">Empty Bot Slot</p>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors mx-auto">
              <Plus className="w-4 h-4" />
              Create Bot
            </button>
          </div>
        </div>
      </div>

      {/* Console Section */}
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Bot Console - sike.gg Bot</h3>
          <button className="px-4 py-2 bg-red-600/20 border border-red-500/30 rounded text-red-300 hover:bg-red-600/30 transition-colors text-sm">
            Clear Logs
          </button>
        </div>

        <div className="bg-black/60 rounded-lg p-4 font-mono text-sm h-64 overflow-y-auto">
          <div className="text-green-400">[2024-01-15 10:30:15] Bot started successfully</div>
          <div className="text-blue-400">[2024-01-15 10:30:16] Connected to Discord API</div>
          <div className="text-white">[2024-01-15 10:30:17] Loaded 15 commands</div>
          <div className="text-yellow-400">[2024-01-15 10:35:22] Warning: Rate limit approaching</div>
          <div className="text-white">[2024-01-15 10:40:33] Command executed: /ban user123</div>
          <div className="text-green-400">[2024-01-15 10:45:11] Heartbeat acknowledged</div>
        </div>

        <div className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder="Enter command..."
            className="flex-1 px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
          />
          <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">Execute</button>
        </div>
      </div>
    </div>
  )
}

// Settings Section Component
function SettingsSection() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">System Settings</h2>

      <div className="space-y-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-bold mb-4">Security Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-white/60">Additional security layer for admin access</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-sm text-green-400">Enabled</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">reCAPTCHA Protection</p>
                <p className="text-sm text-white/60">Protect against automated attacks</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-sm text-green-400">Active</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-bold mb-4">System Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-white/60">Server Status</p>
              <p className="font-medium text-green-400">Online</p>
            </div>
            <div>
              <p className="text-sm text-white/60">Last Backup</p>
              <p className="font-medium">2 hours ago</p>
            </div>
            <div>
              <p className="text-sm text-white/60">Database Status</p>
              <p className="font-medium text-green-400">Connected</p>
            </div>
            <div>
              <p className="text-sm text-white/60">Active Sessions</p>
              <p className="font-medium">1</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

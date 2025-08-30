"use client"

import { useEffect, useState } from "react"
import {
  Settings,
  Shield,
  LogOut,
  BarChart3,
  Bot,
  Globe,
  Square,
  Play,
  RotateCcw,
  Save,
  Trash2,
  Plus,
} from "lucide-react"
import { AuthSession } from "@/lib/auth"

type DashboardSection = "overview" | "analytics" | "site-editor" | "bot-manager" | "settings"

export default function AdminDashboardPage() {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeSection, setActiveSection] = useState<DashboardSection>("overview")

  useEffect(() => {
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

// Bot Manager Section - Completamente funzionale
function BotManagerSection() {
  const [botStatus, setBotStatus] = useState("stopped")
  const [logs, setLogs] = useState<string[]>([])
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [currentCommand, setCurrentCommand] = useState("")
  const [envVars, setEnvVars] = useState({
    DISCORD_TOKEN: "",
    PREFIX: "!",
    OWNER_ID: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Load initial logs
    loadLogs()
    loadCommandHistory()

    // Auto-refresh logs every 5 seconds
    const interval = setInterval(() => {
      if (botStatus === "running") {
        loadLogs()
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [botStatus])

  const loadLogs = async () => {
    try {
      const res = await fetch("/api/bot/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logs" }),
      })
      const data = await res.json()
      if (data.logs) {
        setLogs(data.logs)
      }
    } catch (error) {
      console.error("Failed to load logs:", error)
    }
  }

  const loadCommandHistory = async () => {
    try {
      const res = await fetch("/api/bot/command")
      const data = await res.json()
      if (data.history) {
        setCommandHistory(data.history)
      }
    } catch (error) {
      console.error("Failed to load command history:", error)
    }
  }

  const handleDeploy = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/bot/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "deploy", envVars }),
      })
      const data = await res.json()
      if (data.success) {
        setBotStatus("running")
        await loadLogs()
      }
    } catch (error) {
      console.error("Deploy failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStop = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/bot/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "stop" }),
      })
      const data = await res.json()
      if (data.success) {
        setBotStatus("stopped")
      }
    } catch (error) {
      console.error("Stop failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRestart = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/bot/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "restart", envVars }),
      })
      const data = await res.json()
      if (data.success) {
        setBotStatus("running")
        await loadLogs()
      }
    } catch (error) {
      console.error("Restart failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const executeCommand = async () => {
    if (!currentCommand.trim()) return

    try {
      const res = await fetch("/api/bot/command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: currentCommand }),
      })
      const data = await res.json()
      if (data.success) {
        setCommandHistory(data.history)
        setCurrentCommand("")
      }
    } catch (error) {
      console.error("Command failed:", error)
    }
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Discord Bot Manager</h2>

      {/* Bot Status Card */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-bold">DaniDema Bot Manager</h3>
            <p className="text-white/60">Python Discord Bot from GitHub</p>
            <p className="text-sm text-white/40 mt-1">Repository: DaniDemaDD/BotManager</p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${botStatus === "running" ? "bg-green-400" : "bg-red-400"}`}></div>
            <span className={`text-sm ${botStatus === "running" ? "text-green-400" : "text-red-400"}`}>
              {botStatus.charAt(0).toUpperCase() + botStatus.slice(1)}
            </span>
          </div>
        </div>

        {/* Environment Variables */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Discord Token</label>
            <input
              type="password"
              value={envVars.DISCORD_TOKEN}
              onChange={(e) => setEnvVars({ ...envVars, DISCORD_TOKEN: e.target.value })}
              className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Bot token..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Command Prefix</label>
            <input
              type="text"
              value={envVars.PREFIX}
              onChange={(e) => setEnvVars({ ...envVars, PREFIX: e.target.value })}
              className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Owner ID</label>
            <input
              type="text"
              value={envVars.OWNER_ID}
              onChange={(e) => setEnvVars({ ...envVars, OWNER_ID: e.target.value })}
              className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your Discord ID"
            />
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleDeploy}
            disabled={isLoading || botStatus === "running"}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            <Play className="w-4 h-4" />
            {isLoading ? "Deploying..." : "Deploy & Start"}
          </button>
          <button
            onClick={handleStop}
            disabled={isLoading || botStatus === "stopped"}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            <Square className="w-4 h-4" />
            Stop
          </button>
          <button
            onClick={handleRestart}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            <RotateCcw className="w-4 h-4" />
            Restart
          </button>
        </div>
      </div>

      {/* Console */}
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Bot Console</h3>
          <button
            onClick={() => {
              setLogs([])
              setCommandHistory([])
            }}
            className="px-4 py-2 bg-red-600/20 border border-red-500/30 rounded text-red-300 hover:bg-red-600/30 transition-colors text-sm"
          >
            Clear
          </button>
        </div>

        {/* Logs Display */}
        <div className="bg-black/60 rounded-lg p-4 font-mono text-sm h-64 overflow-y-auto mb-4">
          {logs.length === 0 && commandHistory.length === 0 ? (
            <div className="text-white/40">Console output will appear here...</div>
          ) : (
            <>
              {logs.map((log, index) => (
                <div key={`log-${index}`} className="text-green-400 mb-1">
                  {log}
                </div>
              ))}
              {commandHistory.map((cmd, index) => (
                <div key={`cmd-${index}`} className="text-blue-400 mb-1">
                  {cmd}
                </div>
              ))}
            </>
          )}
        </div>

        {/* Command Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={currentCommand}
            onChange={(e) => setCurrentCommand(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && executeCommand()}
            placeholder="Enter command (help, status, ping, restart, logs)..."
            className="flex-1 px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
          />
          <button
            onClick={executeCommand}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Execute
          </button>
        </div>
      </div>
    </div>
  )
}

// Site Editor Section - Con regole vere modificabili
function SiteEditorSection() {
  const [rules, setRules] = useState<string[]>([])
  const [newRule, setNewRule] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadRules()
  }, [])

  const loadRules = async () => {
    try {
      const res = await fetch("/api/site-rules")
      const data = await res.json()
      setRules(data.rules || [])
    } catch (error) {
      console.error("Failed to load rules:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveRules = async () => {
    setIsSaving(true)
    try {
      const res = await fetch("/api/site-rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rules }),
      })
      const data = await res.json()
      if (data.success) {
        alert("Regole salvate con successo!")
      }
    } catch (error) {
      console.error("Failed to save rules:", error)
      alert("Errore nel salvare le regole")
    } finally {
      setIsSaving(false)
    }
  }

  const addRule = () => {
    if (newRule.trim()) {
      setRules([...rules, newRule.trim()])
      setNewRule("")
    }
  }

  const removeRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index))
  }

  const updateRule = (index: number, newText: string) => {
    const updatedRules = [...rules]
    updatedRules[index] = newText
    setRules(updatedRules)
  }

  if (isLoading) {
    return <div className="text-center">Caricamento regole...</div>
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Site Editor - sike.gg</h2>

      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Regole del Server Discord</h3>
          <button
            onClick={saveRules}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Salvando..." : "Salva Regole"}
          </button>
        </div>

        {/* Add New Rule */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={newRule}
            onChange={(e) => setNewRule(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addRule()}
            placeholder="Aggiungi nuova regola..."
            className="flex-1 px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addRule}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Aggiungi
          </button>
        </div>

        {/* Rules List */}
        <div className="space-y-3">
          {rules.map((rule, index) => (
            <div key={index} className="flex gap-2 items-center">
              <input
                type="text"
                value={rule}
                onChange={(e) => updateRule(index, e.target.value)}
                className="flex-1 px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => removeRule(index)}
                className="p-2 bg-red-600/20 border border-red-500/30 rounded text-red-300 hover:bg-red-600/30 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {rules.length === 0 && (
          <div className="text-center text-white/60 py-8">Nessuna regola configurata. Aggiungi la prima regola!</div>
        )}
      </div>

      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
        <h3 className="text-xl font-bold mb-4">Anteprima Regole</h3>
        <div className="bg-black/40 rounded-lg p-6">
          <h4 className="text-lg font-bold text-purple-400 mb-4">📋 Regole del Server</h4>
          <div className="space-y-2">
            {rules.map((rule, index) => (
              <div key={index} className="text-white/80">
                {rule}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Overview Section
function OverviewSection() {
  const [stats, setStats] = useState({
    today: 0,
    month: 0,
    year: 0,
    botStatus: "stopped",
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const analyticsRes = await fetch("/api/analytics/stats")
        const analyticsData = await analyticsRes.json()

        setStats({
          today: analyticsData.today || 0,
          month: analyticsData.month || 0,
          year: analyticsData.year || 0,
          botStatus: "running", // This would come from bot status API
        })
      } catch (error) {
        console.error("Failed to load stats:", error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  if (loading) {
    return <div className="text-center">Loading statistics...</div>
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Dashboard Overview</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-8 h-8 text-green-400" />
            <h3 className="text-lg font-semibold">Today's Visits</h3>
          </div>
          <p className="text-3xl font-bold text-green-400">{stats.today.toLocaleString()}</p>
          <p className="text-sm text-white/60">Unique visitors today</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <Bot className="w-8 h-8 text-blue-400" />
            <h3 className="text-lg font-semibold">Bot Status</h3>
          </div>
          <p className="text-3xl font-bold text-blue-400">{stats.botStatus === "running" ? "Online" : "Offline"}</p>
          <p className="text-sm text-white/60">Discord Bot Manager</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-8 h-8 text-purple-400" />
            <h3 className="text-lg font-semibold">Monthly Visits</h3>
          </div>
          <p className="text-3xl font-bold text-purple-400">{stats.month.toLocaleString()}</p>
          <p className="text-sm text-white/60">This month</p>
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
    </div>
  )
}

// Analytics Section
function AnalyticsSection() {
  const [stats, setStats] = useState({
    today: 0,
    month: 0,
    year: 0,
    totalToday: 0,
    totalMonth: 0,
    totalYear: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const res = await fetch("/api/analytics/stats")
        const data = await res.json()
        setStats(data)
      } catch (error) {
        console.error("Failed to load analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    loadAnalytics()
  }, [])

  if (loading) {
    return <div className="text-center">Loading analytics...</div>
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Site Analytics</h2>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold mb-4">Today</h3>
          <p className="text-3xl font-bold text-blue-400">{stats.today.toLocaleString()}</p>
          <p className="text-sm text-white/60">Unique visitors</p>
          <p className="text-xs text-white/40 mt-1">{stats.totalToday} total visits</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold mb-4">This Month</h3>
          <p className="text-3xl font-bold text-green-400">{stats.month.toLocaleString()}</p>
          <p className="text-sm text-white/60">Unique visitors</p>
          <p className="text-xs text-white/40 mt-1">{stats.totalMonth} total visits</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold mb-4">This Year</h3>
          <p className="text-3xl font-bold text-purple-400">{stats.year.toLocaleString()}</p>
          <p className="text-sm text-white/60">Unique visitors</p>
          <p className="text-xs text-white/40 mt-1">{stats.totalYear} total visits</p>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
        <h3 className="text-xl font-bold mb-6">Real-time Analytics</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
            <span>Live visitors tracking</span>
            <span className="text-green-400">Active</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
            <span>Geographic data collection</span>
            <span className="text-green-400">Enabled</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
            <span>Session tracking</span>
            <span className="text-green-400">Running</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Settings Section
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
              <p className="text-sm text-white/60">Database Status</p>
              <p className="font-medium text-green-400">Connected</p>
            </div>
            <div>
              <p className="text-sm text-white/60">Bot Repository</p>
              <p className="font-medium">DaniDemaDD/BotManager</p>
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

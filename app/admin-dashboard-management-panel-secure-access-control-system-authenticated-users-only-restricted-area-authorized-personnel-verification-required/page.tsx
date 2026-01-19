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
  Wrench,
  Power,
  PowerOff,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  ShoppingCart,
  Search,
} from "lucide-react"
import { AuthSession } from "@/lib/auth"

type DashboardSection =
  | "overview"
  | "analytics"
  | "site-editor"
  | "bot-manager"
  | "bolzano-applications"
  | "orders"
  | "maintenance"
  | "settings"

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
    { id: "bolzano-applications", label: "Bolzano Applications", icon: FileText },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "maintenance", label: "Maintenance", icon: Wrench },
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
          {activeSection === "bolzano-applications" && <BolzanoApplicationsSection />}
          {activeSection === "orders" && <OrdersSection />}
          {activeSection === "maintenance" && <MaintenanceSection />}
          {activeSection === "settings" && <SettingsSection />}
        </div>
      </div>
    </div>
  )
}

function OrdersSection() {
  const [searchCode, setSearchCode] = useState("")
  const [order, setOrder] = useState<any>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState("")
  const [recentOrders, setRecentOrders] = useState<any[]>([])

  const searchOrder = async () => {
    if (!searchCode.trim()) return

    setIsSearching(true)
    setError("")
    setOrder(null)

    try {
      const response = await fetch(`/api/orders/lookup?code=${encodeURIComponent(searchCode)}`)
      const data = await response.json()

      if (data.success) {
        setOrder(data.order)
        // Add to recent if not already there
        setRecentOrders((prev) => {
          const exists = prev.find((o) => o.orderCode === data.order.orderCode)
          if (exists) return prev
          return [data.order, ...prev].slice(0, 10)
        })
      } else {
        setError(data.error || "Order not found")
      }
    } catch (err) {
      setError("Failed to search order")
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Orders Management</h2>

      {/* Search Box */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-8">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Search className="w-5 h-5 text-blue-400" />
          Search Order by Code
        </h3>
        <div className="flex gap-4">
          <input
            type="text"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
            placeholder="Enter order code (e.g., DD-XXXXXXXX)"
            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-blue-500"
            onKeyDown={(e) => e.key === "Enter" && searchOrder()}
          />
          <button
            onClick={searchOrder}
            disabled={isSearching}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg font-bold transition-colors flex items-center gap-2"
          >
            {isSearching ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <Search className="w-5 h-5" />
            )}
            Search
          </button>
        </div>

        {error && (
          <div className="mt-4 bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-red-300">
            <XCircle className="w-5 h-5 inline mr-2" />
            {error}
          </div>
        )}
      </div>

      {/* Order Details */}
      {order && (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-green-400" />
              Order Details
            </h3>
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  window.open(`/api/orders/download-pdf?code=${order.orderCode}`, "_blank")
                }
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm"
              >
                <FileText className="w-4 h-4" />
                Download PDF
              </button>
              <span className="px-3 py-1 bg-green-900/30 border border-green-500/50 rounded-full text-green-300 text-sm">
                <CheckCircle className="w-4 h-4 inline mr-1" />
                Found
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <span className="text-white/60 text-sm">Order Code</span>
                <p className="font-mono text-purple-300 text-lg">{order.orderCode}</p>
              </div>
              <div>
                <span className="text-white/60 text-sm">Customer Name</span>
                <p className="font-medium">{order.name}</p>
              </div>
              <div>
                <span className="text-white/60 text-sm">Email</span>
                <p className="font-medium">{order.email}</p>
              </div>
              <div>
                <span className="text-white/60 text-sm">Discord</span>
                <p className="font-medium">{order.discord}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <span className="text-white/60 text-sm">Service</span>
                <p className="font-medium">{order.service}</p>
              </div>
              <div>
                <span className="text-white/60 text-sm">Price</span>
                <p className="font-bold text-green-400 text-xl">{order.price}</p>
              </div>
              <div>
                <span className="text-white/60 text-sm">Date</span>
                <p className="font-medium">{order.date}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <span className="text-white/60 text-sm">Request Details</span>
            <p className="mt-2 bg-black/20 rounded-lg p-4 text-white/90">{order.details}</p>
          </div>
        </div>
      )}

      {/* Recent Searches */}
      {recentOrders.length > 0 && (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-400" />
            Recent Searches
          </h3>
          <div className="space-y-3">
            {recentOrders.map((o) => (
              <div
                key={o.orderCode}
                className="flex items-center justify-between bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors cursor-pointer"
                onClick={() => {
                  setSearchCode(o.orderCode)
                  setOrder(o)
                }}
              >
                <div>
                  <p className="font-mono text-purple-300">{o.orderCode}</p>
                  <p className="text-sm text-white/60">
                    {o.name} - {o.service}
                  </p>
                </div>
                <span className="text-green-400 font-bold">{o.price}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Nuova sezione per le applicazioni Bolzano RP
function BolzanoApplicationsSection() {
  const [applications, setApplications] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [selectedApp, setSelectedApp] = useState<any>(null)

  useEffect(() => {
    loadApplications()
  }, [filter])

  const loadApplications = async () => {
    try {
      const res = await fetch(`/api/bolzano-rp/applications?status=${filter}`)
      const data = await res.json()
      setApplications(data)
    } catch (error) {
      console.error("Failed to load applications:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateApplicationStatus = async (id: string, status: string, notes?: string) => {
    try {
      const res = await fetch("/api/bolzano-rp/applications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          status,
          notes,
          reviewed_by: "admin",
        }),
      })

      if (res.ok) {
        await loadApplications()
        setSelectedApp(null)
        alert(`✅ Application ${status}!`)
      }
    } catch (error) {
      console.error("Failed to update application:", error)
      alert("❌ Failed to update application")
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-yellow-900/30 border border-yellow-500/50 rounded-full text-yellow-300 text-xs">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        )
      case "approved":
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-green-900/30 border border-green-500/50 rounded-full text-green-300 text-xs">
            <CheckCircle className="w-3 h-3" />
            Approved
          </span>
        )
      case "rejected":
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-red-900/30 border border-red-500/50 rounded-full text-red-300 text-xs">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        )
      default:
        return null
    }
  }

  if (isLoading) {
    return <div className="text-center">Loading applications...</div>
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">🇮🇹 Bolzano RP Admin Applications</h2>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-6 h-6 text-blue-400" />
            <h3 className="font-semibold">Total</h3>
          </div>
          <p className="text-3xl font-bold">{applications.length}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-6 h-6 text-yellow-400" />
            <h3 className="font-semibold">Pending</h3>
          </div>
          <p className="text-3xl font-bold">{applications.filter((a) => a.status === "pending").length}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <h3 className="font-semibold">Approved</h3>
          </div>
          <p className="text-3xl font-bold">{applications.filter((a) => a.status === "approved").length}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center gap-3 mb-2">
            <XCircle className="w-6 h-6 text-red-400" />
            <h3 className="font-semibold">Rejected</h3>
          </div>
          <p className="text-3xl font-bold">{applications.filter((a) => a.status === "rejected").length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {["all", "pending", "approved", "rejected"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === f ? "bg-blue-600 text-white" : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Applications List */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Nome Gioco</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Discord</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Età</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Data</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 text-sm">{app.nome_gioco}</td>
                  <td className="px-6 py-4 text-sm">{app.discord_tag}</td>
                  <td className="px-6 py-4 text-sm">{app.eta}</td>
                  <td className="px-6 py-4">{getStatusBadge(app.status)}</td>
                  <td className="px-6 py-4 text-sm text-white/70">
                    {new Date(app.submitted_at).toLocaleDateString("it-IT")}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedApp(app)}
                      className="flex items-center gap-2 px-3 py-1 bg-blue-600/20 border border-blue-500/30 rounded text-blue-300 hover:bg-blue-600/30 transition-colors text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {applications.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-white/40 mx-auto mb-4" />
            <p className="text-white/60">No applications found</p>
          </div>
        )}
      </div>

      {/* Application Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-gray-900 rounded-xl p-6 border border-white/20 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Application Details</h3>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-white/60 hover:text-white text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {/* Personal Info */}
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-lg font-bold text-green-300 mb-3">📋 Informazioni Personali</h4>
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-white/60">Nome nel gioco:</span>
                    <p className="font-medium">{selectedApp.nome_gioco}</p>
                  </div>
                  <div>
                    <span className="text-white/60">Discord Tag:</span>
                    <p className="font-medium">{selectedApp.discord_tag}</p>
                  </div>
                  <div>
                    <span className="text-white/60">Nome RP:</span>
                    <p className="font-medium">{selectedApp.nome_rp}</p>
                  </div>
                  <div>
                    <span className="text-white/60">Data di Nascita RP:</span>
                    <p className="font-medium">{selectedApp.data_nascita_rp}</p>
                  </div>
                  <div>
                    <span className="text-white/60">Età:</span>
                    <p className="font-medium">{selectedApp.eta}</p>
                  </div>
                  <div>
                    <span className="text-white/60">IP Address:</span>
                    <p className="font-medium text-xs">{selectedApp.ip_address}</p>
                  </div>
                </div>
              </div>

              {/* RP Questions */}
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-lg font-bold text-green-300 mb-3">🎮 Domande RP</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-white/60 font-medium">FailRP:</span>
                    <p className="mt-1">{selectedApp.failrp_spiegazione}</p>
                  </div>
                  <div>
                    <span className="text-white/60 font-medium">RDM:</span>
                    <p className="mt-1">{selectedApp.rdm_spiegazione}</p>
                  </div>
                  <div>
                    <span className="text-white/60 font-medium">VDM:</span>
                    <p className="mt-1">{selectedApp.vdm_spiegazione}</p>
                  </div>
                  <div>
                    <span className="text-white/60 font-medium">Metagaming:</span>
                    <p className="mt-1">{selectedApp.metagaming_spiegazione}</p>
                  </div>
                  <div>
                    <span className="text-white/60 font-medium">Powergaming:</span>
                    <p className="mt-1">{selectedApp.powergaming_spiegazione}</p>
                  </div>
                </div>
              </div>

              {/* Personal Questions */}
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-lg font-bold text-green-300 mb-3">💭 Domande Personali</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-white/60 font-medium">Motivo per diventare Admin:</span>
                    <p className="mt-1">{selectedApp.motivo_admin}</p>
                  </div>
                  <div>
                    <span className="text-white/60 font-medium">Consapevolezza Responsabilità:</span>
                    <p className="mt-1">{selectedApp.consapevolezza_responsabilita}</p>
                  </div>
                </div>
              </div>

              {/* Status & Actions */}
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-lg font-bold text-blue-300 mb-3">⚙️ Status & Actions</h4>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-white/60">Current Status:</span>
                  {getStatusBadge(selectedApp.status)}
                </div>

                {selectedApp.status === "pending" && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => updateApplicationStatus(selectedApp.id, "approved")}
                      className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-bold transition-colors"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Approve
                    </button>
                    <button
                      onClick={() => updateApplicationStatus(selectedApp.id, "rejected")}
                      className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-bold transition-colors"
                    >
                      <XCircle className="w-5 h-5" />
                      Reject
                    </button>
                  </div>
                )}

                {selectedApp.status !== "pending" && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => updateApplicationStatus(selectedApp.id, "pending")}
                      className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold transition-colors"
                    >
                      <RotateCcw className="w-5 h-5" />
                      Reset to Pending
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
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
    pendingApplications: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const analyticsRes = await fetch("/api/analytics/stats")
        const analyticsData = await analyticsRes.json()

        const applicationsRes = await fetch("/api/bolzano-rp/applications?status=pending")
        const applicationsData = await applicationsRes.json()

        setStats({
          today: analyticsData.today || 0,
          month: analyticsData.month || 0,
          year: analyticsData.year || 0,
          botStatus: "running", // This would come from bot status API
          pendingApplications: applicationsData.length || 0,
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
            <FileText className="w-8 h-8 text-yellow-400" />
            <h3 className="text-lg font-semibold">Pending Apps</h3>
          </div>
          <p className="text-3xl font-bold text-yellow-400">{stats.pendingApplications}</p>
          <p className="text-sm text-white/60">Bolzano RP applications</p>
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

// Maintenance Section - Completamente funzionale
function MaintenanceSection() {
  const [maintenanceSettings, setMaintenanceSettings] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadMaintenanceSettings()
  }, [])

  const loadMaintenanceSettings = async () => {
    try {
      const res = await fetch("/api/maintenance")
      const data = await res.json()
      setMaintenanceSettings(data)
    } catch (error) {
      console.error("Failed to load maintenance settings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateMaintenanceStatus = async (routePath: string, isMaintenanceMode: boolean, message?: string) => {
    setIsSaving(true)
    try {
      const res = await fetch("/api/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          route_path: routePath,
          is_maintenance: isMaintenanceMode,
          maintenance_message:
            message || "This page is currently under maintenance. We apologize for the inconvenience.",
        }),
      })

      if (res.ok) {
        await loadMaintenanceSettings()
        const action = isMaintenanceMode ? "enabled" : "disabled"
        const type = routePath === "__GLOBAL__" ? "Global maintenance" : `Route ${routePath} maintenance`
        alert(`✅ ${type} ${action} successfully!`)
      } else {
        throw new Error("Failed to update")
      }
    } catch (error) {
      console.error("Failed to update maintenance:", error)
      alert("❌ Failed to update maintenance status")
    } finally {
      setIsSaving(false)
    }
  }

  const toggleGlobalMaintenance = () => {
    const globalSetting = maintenanceSettings.find((s) => s.route_path === "__GLOBAL__")
    const newStatus = !globalSetting?.is_maintenance

    if (newStatus) {
      const confirmed = confirm(
        "🚨 This will put the ENTIRE SITE in maintenance mode (except login/2FA).\n\nAll visitors will see a maintenance page.\n\nContinue?",
      )
      if (!confirmed) return
    } else {
      const confirmed = confirm("✅ Remove global maintenance mode?\n\nThe site will be fully accessible again.")
      if (!confirmed) return
    }

    updateMaintenanceStatus(
      "__GLOBAL__",
      newStatus,
      "The entire site is currently under maintenance. We apologize for the inconvenience and will be back soon!",
    )
  }

  const toggleRouteMaintenance = (routePath: string) => {
    const routeSetting = maintenanceSettings.find((s) => s.route_path === routePath)
    const newStatus = !routeSetting?.is_maintenance

    const action = newStatus ? "enable" : "disable"
    const confirmed = confirm(
      `${newStatus ? "🔧" : "✅"} ${action.charAt(0).toUpperCase() + action.slice(1)} maintenance for ${routePath}?`,
    )
    if (!confirmed) return

    updateMaintenanceStatus(routePath, newStatus)
  }

  if (isLoading) {
    return (
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
        <p>Loading maintenance settings...</p>
      </div>
    )
  }

  const globalSetting = maintenanceSettings.find((s) => s.route_path === "__GLOBAL__")
  const routeSettings = maintenanceSettings.filter((s) => s.route_path !== "__GLOBAL__")

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">🛠️ Maintenance Management</h2>

      {/* Global Maintenance Control */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xl font-bold text-red-300">🚨 Global Site Maintenance</h3>
            <p className="text-white/60 text-sm">
              Puts the entire site in maintenance mode (login/2FA remain accessible)
            </p>
          </div>
          <button
            onClick={toggleGlobalMaintenance}
            disabled={isSaving}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${
              globalSetting?.is_maintenance
                ? "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-green-500/25"
                : "bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-red-500/25"
            }`}
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Updating...
              </>
            ) : globalSetting?.is_maintenance ? (
              <>
                <Power className="w-5 h-5" />
                Remove Global Maintenance
              </>
            ) : (
              <>
                <PowerOff className="w-5 h-5" />
                Enable Global Maintenance
              </>
            )}
          </button>
        </div>

        {globalSetting?.is_maintenance && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 animate-pulse">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-red-400 rounded-full animate-ping"></div>
              <p className="text-red-300 text-sm font-bold">🔴 GLOBAL MAINTENANCE ACTIVE</p>
            </div>
            <p className="text-red-200 text-xs">All pages except login and 2FA are showing maintenance page</p>
            <p className="text-red-100 text-xs mt-1 italic">Message: "{globalSetting.maintenance_message}"</p>
          </div>
        )}
      </div>

      {/* Individual Route Controls */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-bold mb-6">📄 Individual Page Maintenance</h3>

        <div className="space-y-4">
          {routeSettings.map((setting) => (
            <div
              key={setting.route_path}
              className={`flex justify-between items-center p-4 rounded-lg border transition-all duration-300 ${
                setting.is_maintenance
                  ? "bg-red-900/20 border-red-500/30"
                  : "bg-white/5 border-white/10 hover:bg-white/10"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${setting.is_maintenance ? "bg-red-400 animate-pulse" : "bg-green-400"}`}
                ></div>
                <div>
                  <p className="font-medium">{setting.route_path}</p>
                  <p className={`text-sm ${setting.is_maintenance ? "text-red-300" : "text-green-300"}`}>
                    {setting.is_maintenance ? "🔧 In maintenance mode" : "✅ Active and accessible"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => toggleRouteMaintenance(setting.route_path)}
                disabled={isSaving || globalSetting?.is_maintenance}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${
                  setting.is_maintenance
                    ? "bg-green-600/20 border border-green-500/30 text-green-300 hover:bg-green-600/30 hover:shadow-lg hover:shadow-green-500/25"
                    : "bg-red-600/20 border border-red-500/30 text-red-300 hover:bg-red-600/30 hover:shadow-lg hover:shadow-red-500/25"
                }`}
              >
                {setting.is_maintenance ? "✅ Remove Maintenance" : "🔧 Enable Maintenance"}
              </button>
            </div>
          ))}
        </div>

        {routeSettings.length === 0 && (
          <div className="text-center py-8">
            <p className="text-white/60">No individual routes configured for maintenance</p>
          </div>
        )}

        {globalSetting?.is_maintenance && (
          <div className="mt-6 text-center bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
            <p className="text-yellow-400 text-sm font-medium">⚠️ Individual controls disabled</p>
            <p className="text-yellow-300 text-xs mt-1">Remove global maintenance first to control individual pages</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 mt-8">
        <h3 className="text-lg font-bold mb-4">🚀 Quick Actions</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <button
            onClick={() => {
              const confirmed = confirm(
                "🔧 Enable maintenance for ALL individual pages?\n\nThis will not affect global settings.",
              )
              if (confirmed) {
                routeSettings.forEach((setting) => {
                  if (!setting.is_maintenance) {
                    updateMaintenanceStatus(setting.route_path, true)
                  }
                })
              }
            }}
            disabled={isSaving || globalSetting?.is_maintenance}
            className="px-4 py-3 bg-red-600/20 border border-red-500/30 rounded-lg text-red-300 hover:bg-red-600/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🔧 Enable All Page Maintenance
          </button>
          <button
            onClick={() => {
              const confirmed = confirm("✅ Remove maintenance from ALL individual pages?")
              if (confirmed) {
                routeSettings.forEach((setting) => {
                  if (setting.is_maintenance) {
                    updateMaintenanceStatus(setting.route_path, false)
                  }
                })
              }
            }}
            disabled={isSaving || globalSetting?.is_maintenance}
            className="px-4 py-3 bg-green-600/20 border border-green-500/30 rounded-lg text-green-300 hover:bg-green-600/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ✅ Remove All Page Maintenance
          </button>
        </div>
      </div>
    </div>
  )
}

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
          <h3 className="text-xl font-bold mb-4">Admin Accounts</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <p className="font-medium">daniele@demartini.biz</p>
                <p className="text-xs text-white/60">Primary Admin</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-xs text-green-400">Active</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <p className="font-medium">admin@danidema.xyz</p>
                <p className="text-xs text-white/60">Secondary Admin</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-xs text-green-400">Active</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-bold mb-4">Email Notifications</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Bolzano RP Applications</p>
                <p className="text-sm text-white/60">Receive email when new applications are submitted</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-sm text-green-400">Enabled</span>
              </div>
            </div>
            <p className="text-xs text-white/40">Notifications sent to: dani@danidema.xyz</p>
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

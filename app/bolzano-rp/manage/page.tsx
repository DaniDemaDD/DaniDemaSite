"use client"

import { useState, useEffect } from "react"
import { CheckCircle, XCircle, Loader, LogOut } from "lucide-react"

interface Application {
  id: string
  nomeGioco: string
  discordTag: string
  nomeRp: string
  eta: string
  status: "pending" | "accepted" | "rejected"
  createdAt: string
  data: Record<string, string>
}

export default function BolzanoRPManagePage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const response = await fetch("/api/bolzano-rp/applications")
      if (!response.ok) throw new Error("Failed to fetch applications")
      const data = await response.json()
      setApplications(data.applications || [])
    } catch (error) {
      console.error("Error fetching applications:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async (appId: string) => {
    setActionLoading(true)
    try {
      const response = await fetch("/api/bolzano-rp/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: appId, status: "accepted" }),
      })
      if (!response.ok) throw new Error("Failed to accept application")

      setApplications((prev) => prev.map((app) => (app.id === appId ? { ...app, status: "accepted" } : app)))
      setSelectedApp(null)
    } catch (error) {
      console.error("Error accepting application:", error)
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async (appId: string) => {
    setActionLoading(true)
    try {
      const response = await fetch("/api/bolzano-rp/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: appId, status: "rejected" }),
      })
      if (!response.ok) throw new Error("Failed to reject application")

      setApplications((prev) => prev.map((app) => (app.id === appId ? { ...app, status: "rejected" } : app)))
      setSelectedApp(null)
    } catch (error) {
      console.error("Error rejecting application:", error)
    } finally {
      setActionLoading(false)
    }
  }

  const handleLogout = () => {
    window.location.href = "/login"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-red-900 to-green-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-red-400">
              Bolzano RP - Gestione Candidature
            </h1>
            <p className="text-green-200 mt-2">Accetta o rifiuta le candidature per Admin</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <Loader className="w-12 h-12 animate-spin text-green-400" />
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 text-center">
            <p className="text-xl text-white/70">Nessuna candidatura al momento</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all cursor-pointer"
                onClick={() => setSelectedApp(app)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{app.nomeGioco}</h3>
                    <p className="text-green-200">Discord: {app.discordTag}</p>
                    <p className="text-green-200">Nome RP: {app.nomeRp}</p>
                    <p className="text-green-200">Età: {app.eta}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {app.status === "accepted" && (
                      <div className="flex items-center gap-2 text-green-400">
                        <CheckCircle className="w-6 h-6" />
                        <span>Accettata</span>
                      </div>
                    )}
                    {app.status === "rejected" && (
                      <div className="flex items-center gap-2 text-red-400">
                        <XCircle className="w-6 h-6" />
                        <span>Rifiutata</span>
                      </div>
                    )}
                    {app.status === "pending" && (
                      <div className="flex items-center gap-2 text-yellow-400">
                        <Loader className="w-6 h-6 animate-spin" />
                        <span>In Sospeso</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Detailed View Modal */}
        {selectedApp && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-gray-900 rounded-xl p-8 border border-white/20 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Candidatura di {selectedApp.nomeGioco}</h2>
                <button onClick={() => setSelectedApp(null)} className="text-white/60 hover:text-white text-2xl">
                  ×
                </button>
              </div>

              <div className="space-y-4 mb-8">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-green-300 font-bold">Nome Gioco</p>
                    <p className="text-white/80">{selectedApp.nomeGioco}</p>
                  </div>
                  <div>
                    <p className="text-green-300 font-bold">Discord Tag</p>
                    <p className="text-white/80">{selectedApp.discordTag}</p>
                  </div>
                  <div>
                    <p className="text-green-300 font-bold">Nome RP</p>
                    <p className="text-white/80">{selectedApp.nomeRp}</p>
                  </div>
                  <div>
                    <p className="text-green-300 font-bold">Età</p>
                    <p className="text-white/80">{selectedApp.eta}</p>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <h3 className="text-lg font-bold text-green-300 mb-4">Risposte</h3>
                  <div className="space-y-4">
                    {Object.entries(selectedApp.data).map(([key, value]) => (
                      <div key={key}>
                        <p className="text-green-300 font-semibold capitalize">{key.replace(/([A-Z])/g, " $1")}</p>
                        <p className="text-white/70 text-sm whitespace-pre-wrap">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {selectedApp.status === "pending" && (
                <div className="flex gap-4">
                  <button
                    onClick={() => handleAccept(selectedApp.id)}
                    disabled={actionLoading}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-6 py-3 rounded-lg font-bold transition-colors"
                  >
                    {actionLoading ? <Loader className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                    Accetta
                  </button>
                  <button
                    onClick={() => handleReject(selectedApp.id)}
                    disabled={actionLoading}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 px-6 py-3 rounded-lg font-bold transition-colors"
                  >
                    {actionLoading ? <Loader className="w-5 h-5 animate-spin" /> : <XCircle className="w-5 h-5" />}
                    Rifiuta
                  </button>
                </div>
              )}

              <button
                onClick={() => setSelectedApp(null)}
                className="w-full mt-4 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-lg font-bold transition-colors"
              >
                Chiudi
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

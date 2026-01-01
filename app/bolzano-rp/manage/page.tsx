"use client"

import { useState, useEffect } from "react"
import { CheckCircle, XCircle, Loader2, LogOut, FileText, Clock, Eye, Heart } from "lucide-react"
import { AuthSession } from "@/lib/auth"

interface Application {
  id: string
  nome_gioco: string
  discord_tag: string
  nome_rp: string
  data_nascita_rp: string
  eta: string
  failrp_spiegazione: string
  rdm_spiegazione: string
  vdm_spiegazione: string
  metagaming_spiegazione: string
  powergaming_spiegazione: string
  motivo_admin: string
  consapevolezza_responsabilita: string
  status: "pending" | "approved" | "rejected"
  submitted_at: string
  ip_address: string
}

export default function BolzanoRPManagePage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [filter, setFilter] = useState("all")
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    // Check if user is a Bolzano operator
    const checkAuth = () => {
      const isLoggedIn = AuthSession.getLoginStatus()
      if (!isLoggedIn) {
        window.location.href = "/login"
        return
      }
      setIsAuthorized(true)
    }
    checkAuth()
  }, [])

  useEffect(() => {
    if (isAuthorized) {
      fetchApplications()
    }
  }, [isAuthorized, filter])

  const fetchApplications = async () => {
    try {
      const response = await fetch(`/api/bolzano-rp/applications?status=${filter}`)
      if (!response.ok) throw new Error("Failed to fetch applications")
      const data = await response.json()
      setApplications(Array.isArray(data) ? data : data.applications || [])
    } catch (error) {
      console.error("Error fetching applications:", error)
      setApplications([])
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (appId: string, status: "approved" | "rejected") => {
    setActionLoading(true)
    try {
      const response = await fetch("/api/bolzano-rp/applications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: appId, status, reviewed_by: "operator" }),
      })
      if (!response.ok) throw new Error("Failed to update application")

      await fetchApplications()
      setSelectedApp(null)
      alert(`Candidatura ${status === "approved" ? "accettata" : "rifiutata"} con successo!`)
    } catch (error) {
      console.error("Error updating application:", error)
      alert("Errore nell'aggiornamento della candidatura")
    } finally {
      setActionLoading(false)
    }
  }

  const handleLogout = () => {
    AuthSession.clearSession()
    window.location.href = "/"
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-yellow-900/30 border border-yellow-500/50 rounded-full text-yellow-300 text-xs">
            <Clock className="w-3 h-3" />
            In Attesa
          </span>
        )
      case "approved":
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-green-900/30 border border-green-500/50 rounded-full text-green-300 text-xs">
            <CheckCircle className="w-3 h-3" />
            Accettata
          </span>
        )
      case "rejected":
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-red-900/30 border border-red-500/50 rounded-full text-red-300 text-xs">
            <XCircle className="w-3 h-3" />
            Rifiutata
          </span>
        )
      default:
        return null
    }
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-slate-900 to-red-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-slate-900 to-red-900 text-white">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-sm border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="text-4xl">🇮🇹</div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 via-white to-red-400 bg-clip-text text-transparent">
                Bolzano RP - Gestione Candidature
              </h1>
              <p className="text-white/60 text-sm">Pannello Operatore</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600/20 hover:bg-red-600/40 border border-red-500/30 px-4 py-2 rounded-lg transition-colors text-red-300"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-white/60">Totali</span>
            </div>
            <p className="text-2xl font-bold">{applications.length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-yellow-400" />
              <span className="text-sm text-white/60">In Attesa</span>
            </div>
            <p className="text-2xl font-bold text-yellow-400">
              {applications.filter((a) => a.status === "pending").length}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-sm text-white/60">Accettate</span>
            </div>
            <p className="text-2xl font-bold text-green-400">
              {applications.filter((a) => a.status === "approved").length}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-5 h-5 text-red-400" />
              <span className="text-sm text-white/60">Rifiutate</span>
            </div>
            <p className="text-2xl font-bold text-red-400">
              {applications.filter((a) => a.status === "rejected").length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {[
            { key: "all", label: "Tutte" },
            { key: "pending", label: "In Attesa" },
            { key: "approved", label: "Accettate" },
            { key: "rejected", label: "Rifiutate" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === f.key
                  ? "bg-green-600 text-white"
                  : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Applications List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-12 h-12 animate-spin text-green-400" />
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-12 text-center border border-white/20">
            <FileText className="w-16 h-16 text-white/40 mx-auto mb-4" />
            <p className="text-xl text-white/70">Nessuna candidatura trovata</p>
            <p className="text-sm text-white/50 mt-2">Le nuove candidature appariranno qui</p>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Nome Gioco</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Discord</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Nome RP</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Età</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Data</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Azioni</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-medium">{app.nome_gioco}</td>
                      <td className="px-6 py-4 text-sm text-white/70">{app.discord_tag}</td>
                      <td className="px-6 py-4 text-sm">{app.nome_rp}</td>
                      <td className="px-6 py-4 text-sm">{app.eta}</td>
                      <td className="px-6 py-4">{getStatusBadge(app.status)}</td>
                      <td className="px-6 py-4 text-sm text-white/60">
                        {new Date(app.submitted_at).toLocaleDateString("it-IT")}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-blue-600/20 border border-blue-500/30 rounded-lg text-blue-300 hover:bg-blue-600/30 transition-colors text-sm"
                        >
                          <Eye className="w-4 h-4" />
                          Dettagli
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-white/50 text-sm flex items-center justify-center gap-2">
          <span>Made by DaniDema</span>
          <Heart className="w-4 h-4 text-red-500 fill-red-500" />
        </div>
      </main>

      {/* Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-slate-900 rounded-2xl p-6 border border-white/20 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Candidatura di {selectedApp.nome_gioco}</h2>
                <p className="text-white/60 text-sm">
                  Inviata il {new Date(selectedApp.submitted_at).toLocaleString("it-IT")}
                </p>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {/* Info Personali */}
              <div className="bg-white/5 rounded-xl p-4">
                <h3 className="text-lg font-bold text-green-400 mb-4">📋 Informazioni Personali</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-white/60 text-sm">Nome nel Gioco</span>
                    <p className="font-medium">{selectedApp.nome_gioco}</p>
                  </div>
                  <div>
                    <span className="text-white/60 text-sm">Discord Tag</span>
                    <p className="font-medium">{selectedApp.discord_tag}</p>
                  </div>
                  <div>
                    <span className="text-white/60 text-sm">Nome RP</span>
                    <p className="font-medium">{selectedApp.nome_rp}</p>
                  </div>
                  <div>
                    <span className="text-white/60 text-sm">Data Nascita RP</span>
                    <p className="font-medium">{selectedApp.data_nascita_rp}</p>
                  </div>
                  <div>
                    <span className="text-white/60 text-sm">Età</span>
                    <p className="font-medium">{selectedApp.eta}</p>
                  </div>
                </div>
              </div>

              {/* Domande RP */}
              <div className="bg-white/5 rounded-xl p-4">
                <h3 className="text-lg font-bold text-green-400 mb-4">🎮 Conoscenza Regole RP</h3>
                <div className="space-y-4">
                  <div>
                    <span className="text-white/60 text-sm font-medium">Cos'è il FailRP?</span>
                    <p className="mt-1 text-white/90 bg-black/20 rounded-lg p-3">{selectedApp.failrp_spiegazione}</p>
                  </div>
                  <div>
                    <span className="text-white/60 text-sm font-medium">Cos'è il RDM?</span>
                    <p className="mt-1 text-white/90 bg-black/20 rounded-lg p-3">{selectedApp.rdm_spiegazione}</p>
                  </div>
                  <div>
                    <span className="text-white/60 text-sm font-medium">Cos'è il VDM?</span>
                    <p className="mt-1 text-white/90 bg-black/20 rounded-lg p-3">{selectedApp.vdm_spiegazione}</p>
                  </div>
                  <div>
                    <span className="text-white/60 text-sm font-medium">Cos'è il Metagaming?</span>
                    <p className="mt-1 text-white/90 bg-black/20 rounded-lg p-3">
                      {selectedApp.metagaming_spiegazione}
                    </p>
                  </div>
                  <div>
                    <span className="text-white/60 text-sm font-medium">Cos'è il Powergaming?</span>
                    <p className="mt-1 text-white/90 bg-black/20 rounded-lg p-3">
                      {selectedApp.powergaming_spiegazione}
                    </p>
                  </div>
                </div>
              </div>

              {/* Motivazione */}
              <div className="bg-white/5 rounded-xl p-4">
                <h3 className="text-lg font-bold text-green-400 mb-4">💭 Motivazione</h3>
                <div className="space-y-4">
                  <div>
                    <span className="text-white/60 text-sm font-medium">Perché vuoi diventare Admin?</span>
                    <p className="mt-1 text-white/90 bg-black/20 rounded-lg p-3">{selectedApp.motivo_admin}</p>
                  </div>
                  <div>
                    <span className="text-white/60 text-sm font-medium">Consapevolezza delle responsabilità</span>
                    <p className="mt-1 text-white/90 bg-black/20 rounded-lg p-3">
                      {selectedApp.consapevolezza_responsabilita}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status e Azioni */}
              <div className="bg-white/5 rounded-xl p-4">
                <h3 className="text-lg font-bold text-blue-400 mb-4">⚙️ Status e Azioni</h3>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-white/60">Status attuale:</span>
                  {getStatusBadge(selectedApp.status)}
                </div>

                {selectedApp.status === "pending" && (
                  <div className="flex gap-4">
                    <button
                      onClick={() => updateStatus(selectedApp.id, "approved")}
                      disabled={actionLoading}
                      className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-6 py-3 rounded-xl font-bold transition-colors"
                    >
                      {actionLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <CheckCircle className="w-5 h-5" />
                      )}
                      Accetta
                    </button>
                    <button
                      onClick={() => updateStatus(selectedApp.id, "rejected")}
                      disabled={actionLoading}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 px-6 py-3 rounded-xl font-bold transition-colors"
                    >
                      {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <XCircle className="w-5 h-5" />}
                      Rifiuta
                    </button>
                  </div>
                )}

                {selectedApp.status !== "pending" && (
                  <p className="text-white/60 text-center py-4">
                    Questa candidatura è già stata {selectedApp.status === "approved" ? "accettata" : "rifiutata"}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => setSelectedApp(null)}
              className="w-full mt-6 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl font-bold transition-colors"
            >
              Chiudi
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

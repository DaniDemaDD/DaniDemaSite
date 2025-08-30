"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Construction, Settings, Users, Shield, Database, Activity, LogOut } from "lucide-react"
import { AuthSession } from "@/lib/auth"

export default function AdminDashboardPage() {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      const isLoggedIn = AuthSession.getLoginStatus()
      const is2FAVerified = AuthSession.get2FAStatus()

      if (!isLoggedIn) {
        // Not logged in, redirect to login
        window.location.href = "/login"
        return
      }

      if (!is2FAVerified) {
        // Logged in but no 2FA, redirect to 2FA page
        window.location.href = "/2fa"
        return
      }

      // Both login and 2FA verified
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
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/abstract-geometric-pattern.png')] opacity-5"></div>

      <div className="relative z-10 container mx-auto px-6 py-16">
        {/* Header with Logout */}
        <div className="flex justify-between items-center mb-12">
          <div className="text-center flex-1">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-600 rounded-full mb-6">
              <Construction className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Admin Dashboard</h1>
            <p className="text-xl text-blue-300 mb-2">Secure Management Panel</p>
            <div className="inline-flex items-center gap-2 bg-green-600/20 border border-green-500/30 rounded-full px-4 py-2">
              <Shield className="w-5 h-5 text-green-400" />
              <span className="text-green-300 font-semibold">AUTHENTICATED & 2FA VERIFIED</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="absolute top-6 right-6 inline-flex items-center gap-2 bg-red-600/20 border border-red-500/30 rounded-full px-4 py-2 text-red-300 hover:bg-red-600/30 transition-all duration-300"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {/* Status Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-8 h-8 text-blue-400" />
                <h3 className="text-lg font-semibold">User Management</h3>
              </div>
              <p className="text-blue-200 text-sm mb-3">Sistema di gestione utenti e permessi</p>
              <div className="bg-orange-600/20 border border-orange-500/30 rounded-lg p-2 text-center">
                <span className="text-orange-300 text-xs font-medium">IN SVILUPPO</span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-4">
                <Database className="w-8 h-8 text-green-400" />
                <h3 className="text-lg font-semibold">Database Control</h3>
              </div>
              <p className="text-blue-200 text-sm mb-3">Controllo e monitoraggio database</p>
              <div className="bg-orange-600/20 border border-orange-500/30 rounded-lg p-2 text-center">
                <span className="text-orange-300 text-xs font-medium">IN SVILUPPO</span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-4">
                <Activity className="w-8 h-8 text-purple-400" />
                <h3 className="text-lg font-semibold">Analytics</h3>
              </div>
              <p className="text-blue-200 text-sm mb-3">Statistiche e monitoraggio attività</p>
              <div className="bg-orange-600/20 border border-orange-500/30 rounded-lg p-2 text-center">
                <span className="text-orange-300 text-xs font-medium">IN SVILUPPO</span>
              </div>
            </div>
          </div>

          {/* Main Message */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 text-center mb-8">
            <Construction className="w-16 h-16 text-orange-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">Dashboard in Costruzione</h2>
            <p className="text-blue-200 text-lg mb-6 leading-relaxed">
              Il pannello di amministrazione è attualmente in fase di sviluppo. Stiamo lavorando per implementare tutte
              le funzionalità di gestione e controllo.
            </p>

            <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-blue-300 mb-2">Funzionalità in Arrivo:</h3>
              <ul className="text-blue-200 text-sm space-y-1">
                <li>• Gestione utenti e permessi</li>
                <li>• Controllo contenuti del sito</li>
                <li>• Monitoraggio attività e statistiche</li>
                <li>• Configurazione sistema</li>
                <li>• Backup e sicurezza</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
              >
                <Shield className="w-5 h-5" />
                Torna alla Homepage
              </Link>
              <button
                disabled
                className="inline-flex items-center gap-2 bg-gray-600 text-gray-300 font-bold py-3 px-6 rounded-lg cursor-not-allowed"
              >
                <Settings className="w-5 h-5" />
                Impostazioni (Presto)
              </button>
            </div>
          </div>

          {/* Security Notice */}
          <div className="text-center">
            <p className="text-blue-400 text-sm">
              🔒 Area riservata - Accesso autorizzato tramite autenticazione sicura e 2FA
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

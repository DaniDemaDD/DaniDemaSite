"use client"

import Link from "next/link"
import { Construction, Settings, Users, Shield, Database, Activity } from "lucide-react"

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/abstract-geometric-pattern.png')] opacity-5"></div>

      <div className="relative z-10 container mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-600 rounded-full mb-6">
            <Construction className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Admin Dashboard</h1>
          <p className="text-xl text-blue-300 mb-2">Secure Management Panel</p>
          <div className="inline-flex items-center gap-2 bg-orange-600/20 border border-orange-500/30 rounded-full px-4 py-2">
            <Construction className="w-5 h-5 text-orange-400" />
            <span className="text-orange-300 font-semibold">LAVORI IN CORSO</span>
          </div>
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
              🔒 Area riservata - Accesso autorizzato tramite autenticazione sicura
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

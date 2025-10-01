"use client"

import type React from "react"

import { useState } from "react"
import { Send, CheckCircle, Flag, Shield, AlertCircle } from "lucide-react"

export default function BolzanoRPPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    // Personal Information
    nomeGioco: "",
    discordTag: "",
    nomeRP: "",
    dataNascitaRP: "",
    eta: "",

    // RP Knowledge
    failRP: "",
    rdm: "",
    vdm: "",
    metagaming: "",
    powergaming: "",

    // Personal Questions
    motivoAdmin: "",
    consapevolezzaResponsabilita: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/bolzano-rp/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsSubmitted(true)
        // Reset form
        setFormData({
          nomeGioco: "",
          discordTag: "",
          nomeRP: "",
          dataNascitaRP: "",
          eta: "",
          failRP: "",
          rdm: "",
          vdm: "",
          metagaming: "",
          powergaming: "",
          motivoAdmin: "",
          consapevolezzaResponsabilita: "",
        })
      } else {
        alert("Errore nell'invio della domanda. Riprova.")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("Errore di connessione. Riprova.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-green-900 text-white flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">Domanda Inviata! 🎉</h1>
          <p className="text-lg text-white/80 mb-6">
            La tua candidatura per diventare Admin di Bolzano RP è stata ricevuta con successo.
          </p>
          <p className="text-white/60 mb-8">Il nostro team esaminerà la tua domanda e ti contatteremo su Discord.</p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="px-8 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-bold transition-colors"
          >
            Invia un'altra domanda
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-green-900 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/abstract-geometric-pattern.png')] opacity-5"></div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Flag className="w-12 h-12 text-green-400" />
            <h1 className="text-4xl md:text-5xl font-bold">Bolzano RP</h1>
          </div>
          <p className="text-xl text-white/70">Domanda per diventare Admin</p>
        </div>

        {/* Info Banner */}
        <div className="max-w-4xl mx-auto mb-8 bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-bold text-blue-300 mb-2">Requisiti per diventare Admin</h3>
              <ul className="space-y-1 text-blue-100/80 text-sm">
                <li>• Conoscenza approfondita delle regole RP</li>
                <li>• Capacità di gestire situazioni complesse</li>
                <li>• Disponibilità e professionalità</li>
                <li>• Età minima: 16 anni</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
          {/* Personal Information */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-green-400" />
              Informazioni Personali
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="nomeGioco" className="block text-sm font-medium mb-2">
                  Nome nel Gioco *
                </label>
                <input
                  type="text"
                  id="nomeGioco"
                  name="nomeGioco"
                  value={formData.nomeGioco}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Es: Mario Rossi"
                />
              </div>

              <div>
                <label htmlFor="discordTag" className="block text-sm font-medium mb-2">
                  Discord Tag *
                </label>
                <input
                  type="text"
                  id="discordTag"
                  name="discordTag"
                  value={formData.discordTag}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Es: username#1234"
                />
              </div>

              <div>
                <label htmlFor="nomeRP" className="block text-sm font-medium mb-2">
                  Nome RP *
                </label>
                <input
                  type="text"
                  id="nomeRP"
                  name="nomeRP"
                  value={formData.nomeRP}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Es: Giovanni Verdi"
                />
              </div>

              <div>
                <label htmlFor="dataNascitaRP" className="block text-sm font-medium mb-2">
                  Data di Nascita RP *
                </label>
                <input
                  type="date"
                  id="dataNascitaRP"
                  name="dataNascitaRP"
                  value={formData.dataNascitaRP}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label htmlFor="eta" className="block text-sm font-medium mb-2">
                  Età *
                </label>
                <input
                  type="number"
                  id="eta"
                  name="eta"
                  value={formData.eta}
                  onChange={handleChange}
                  required
                  min="16"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Es: 18"
                />
              </div>
            </div>
          </div>

          {/* RP Knowledge */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Shield className="w-6 h-6 text-green-400" />
              Conoscenza delle Regole RP
            </h2>

            <div className="space-y-6">
              <div>
                <label htmlFor="failRP" className="block text-sm font-medium mb-2">
                  Cos'è il FailRP? Fai un esempio *
                </label>
                <textarea
                  id="failRP"
                  name="failRP"
                  value={formData.failRP}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  placeholder="Spiega cosa significa FailRP e fornisci un esempio..."
                />
              </div>

              <div>
                <label htmlFor="rdm" className="block text-sm font-medium mb-2">
                  Cos'è il RDM (Random Deathmatch)? *
                </label>
                <textarea
                  id="rdm"
                  name="rdm"
                  value={formData.rdm}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  placeholder="Spiega cosa significa RDM..."
                />
              </div>

              <div>
                <label htmlFor="vdm" className="block text-sm font-medium mb-2">
                  Cos'è il VDM (Vehicle Deathmatch)? *
                </label>
                <textarea
                  id="vdm"
                  name="vdm"
                  value={formData.vdm}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  placeholder="Spiega cosa significa VDM..."
                />
              </div>

              <div>
                <label htmlFor="metagaming" className="block text-sm font-medium mb-2">
                  Cos'è il Metagaming? *
                </label>
                <textarea
                  id="metagaming"
                  name="metagaming"
                  value={formData.metagaming}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  placeholder="Spiega cosa significa Metagaming..."
                />
              </div>

              <div>
                <label htmlFor="powergaming" className="block text-sm font-medium mb-2">
                  Cos'è il Powergaming? *
                </label>
                <textarea
                  id="powergaming"
                  name="powergaming"
                  value={formData.powergaming}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  placeholder="Spiega cosa significa Powergaming..."
                />
              </div>
            </div>
          </div>

          {/* Personal Questions */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Flag className="w-6 h-6 text-green-400" />
              Domande Personali
            </h2>

            <div className="space-y-6">
              <div>
                <label htmlFor="motivoAdmin" className="block text-sm font-medium mb-2">
                  Perché vuoi diventare Admin? *
                </label>
                <textarea
                  id="motivoAdmin"
                  name="motivoAdmin"
                  value={formData.motivoAdmin}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  placeholder="Spiega le tue motivazioni..."
                />
              </div>

              <div>
                <label htmlFor="consapevolezzaResponsabilita" className="block text-sm font-medium mb-2">
                  Sei consapevole delle responsabilità di un Admin? *
                </label>
                <textarea
                  id="consapevolezzaResponsabilita"
                  name="consapevolezzaResponsabilita"
                  value={formData.consapevolezzaResponsabilita}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  placeholder="Descrivi cosa significa per te essere un Admin..."
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-3 px-8 py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded-lg font-bold text-lg transition-colors disabled:cursor-not-allowed shadow-lg hover:shadow-green-500/25"
            >
              {isSubmitting ? (
                <>
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Invio in corso...
                </>
              ) : (
                <>
                  <Send className="w-6 h-6" />
                  Invia Candidatura
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

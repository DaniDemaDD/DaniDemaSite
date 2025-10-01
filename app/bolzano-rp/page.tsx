"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Send, CheckCircle, AlertCircle, Users, FileText, Shield } from "lucide-react"
import Link from "next/link"

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: any) => string
      reset: (widgetId: string) => void
      remove: (widgetId: string) => void
    }
  }
}

export default function BolzanoRPPage() {
  const [formData, setFormData] = useState({
    nomeGioco: "",
    discordTag: "",
    nomeRp: "",
    dataNascitaRp: "",
    eta: "",
    failrp: "",
    rdm: "",
    vdm: "",
    metagaming: "",
    powergaming: "",
    copBaiting: "",
    cuffRushing: "",
    azioneViolazioni: "",
    unrealisticPolice: "",
    gestioneTicket: "",
    proceduraSegnalazione: "",
    reazioneRifiuto: "",
    reazioneAccettazione: "",
    motivoAdmin: "",
    consapevolezzaResponsabilita: "",
  })

  const [termsAccepted, setTermsAccepted] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [turnstileToken, setTurnstileToken] = useState("")
  const [turnstileWidgetId, setTurnstileWidgetId] = useState<string>("")

  useEffect(() => {
    // Load Cloudflare Turnstile script
    const script = document.createElement("script")
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js"
    script.async = true
    script.defer = true
    script.onload = () => {
      if (window.turnstile) {
        const widgetId = window.turnstile.render("#turnstile-container", {
          sitekey: "0x4AAAAAAB4YaGS3dbfoeIAp",
          callback: (token: string) => {
            setTurnstileToken(token)
          },
        })
        setTurnstileWidgetId(widgetId)
      }
    }
    document.head.appendChild(script)

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!termsAccepted) {
      alert("⚠️ You must accept the Terms & Conditions to submit")
      return
    }

    if (!turnstileToken) {
      alert("⚠️ Please complete the captcha verification")
      return
    }

    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      const response = await fetch("/api/bolzano-rp/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          turnstileToken,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit application")
      }

      setSubmitStatus("success")
      setFormData({
        nomeGioco: "",
        discordTag: "",
        nomeRp: "",
        dataNascitaRp: "",
        eta: "",
        failrp: "",
        rdm: "",
        vdm: "",
        metagaming: "",
        powergaming: "",
        copBaiting: "",
        cuffRushing: "",
        azioneViolazioni: "",
        unrealisticPolice: "",
        gestioneTicket: "",
        proceduraSegnalazione: "",
        reazioneRifiuto: "",
        reazioneAccettazione: "",
        motivoAdmin: "",
        consapevolezzaResponsabilita: "",
      })
      setTermsAccepted(false)

      // Reset Turnstile
      if (window.turnstile && turnstileWidgetId) {
        window.turnstile.reset(turnstileWidgetId)
        setTurnstileToken("")
      }
    } catch (error) {
      console.error("Submit error:", error)
      setSubmitStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "An error occurred")

      // Reset Turnstile on error
      if (window.turnstile && turnstileWidgetId) {
        window.turnstile.reset(turnstileWidgetId)
        setTurnstileToken("")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-red-900 to-green-900 text-white">
      {/* Header */}
      <header className="container mx-auto px-6 py-8">
        <nav className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🇮🇹</span>
            <h1 className="text-2xl font-bold">Bolzano RP</h1>
          </div>
          <Link href="/" className="text-green-300 hover:text-white transition-colors duration-200">
            ← Back to DaniDema
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-16">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-red-400 mb-4">
            🍝 Bolzano RP 🍝
          </h1>
          <p className="text-xl md:text-2xl text-green-200 mb-8">Italian Roleplay Community on Roblox</p>

          {/* Discord Join Button */}
          <a
            href="https://discord.gg/a38CWHKkN4"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl mb-8"
          >
            <Users className="w-6 h-6" />
            Join Discord Server
          </a>
        </div>

        {/* Admin Application Form */}
        <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-full mb-4">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Bando per diventare Admin</h2>
            <p className="text-white/70">Complete this form to apply for admin position</p>
            <p className="text-yellow-300 text-sm mt-2">⚠️ Only one submission per IP address is allowed</p>
          </div>

          {submitStatus === "success" && (
            <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-4 mb-6 flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <div>
                <p className="text-green-300 font-semibold">Application Submitted Successfully!</p>
                <p className="text-green-200 text-sm">Your application has been received and is under review.</p>
              </div>
            </div>
          )}

          {submitStatus === "error" && (
            <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4 mb-6 flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-400" />
              <div>
                <p className="text-red-300 font-semibold">Submission Failed</p>
                <p className="text-red-200 text-sm">{errorMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Info Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-green-300">Domande Per Sapere Chi Sei</h3>

              <div>
                <label className="block text-sm font-medium mb-2">1. Il tuo nome nel gioco (Nome_Cognome) *</label>
                <input
                  type="text"
                  name="nomeGioco"
                  value={formData.nomeGioco}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">2. Il tuo Discord Tag *</label>
                <input
                  type="text"
                  name="discordTag"
                  value={formData.discordTag}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">3. Nome RP *</label>
                <input
                  type="text"
                  name="nomeRp"
                  value={formData.nomeRp}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">4. Data Di Nascita RP *</label>
                <input
                  type="text"
                  name="dataNascitaRp"
                  value={formData.dataNascitaRp}
                  onChange={handleChange}
                  required
                  placeholder="gg/mm/aaaa"
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">5. La tua età *</label>
                <input
                  type="number"
                  name="eta"
                  value={formData.eta}
                  onChange={handleChange}
                  required
                  min="13"
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            {/* RP Questions Section */}
            <div className="space-y-4 pt-6 border-t border-white/20">
              <h3 className="text-xl font-bold text-green-300">Domande RP</h3>

              <div>
                <label className="block text-sm font-medium mb-2">
                  6. Spiega cosa significa FailRP e fai un esempio. *
                </label>
                <textarea
                  name="failrp"
                  value={formData.failrp}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  7. Spiega cosa significa RDM e fai un esempio. *
                </label>
                <textarea
                  name="rdm"
                  value={formData.rdm}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  8. Spiega cosa significa VDM e fai un esempio. *
                </label>
                <textarea
                  name="vdm"
                  value={formData.vdm}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  9. Spiega cosa significa Metagaming e fai un esempio. *
                </label>
                <textarea
                  name="metagaming"
                  value={formData.metagaming}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  10. Spiega cosa significa Powergaming e fai un esempio. *
                </label>
                <textarea
                  name="powergaming"
                  value={formData.powergaming}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  11. Spiega cosa significa Cop Baiting e fai un esempio. *
                </label>
                <textarea
                  name="copBaiting"
                  value={formData.copBaiting}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  12. Che cos'è il Cuff Rushing? Dai anche un esempio *
                </label>
                <textarea
                  name="cuffRushing"
                  value={formData.cuffRushing}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  13. Cosa fai se Qualche giocatore fa qualche no fear o RDM? *
                </label>
                <textarea
                  name="azioneViolazioni"
                  value={formData.azioneViolazioni}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  14. Cosa cos'è l'Unrealistic Police? Dai anche un esempio *
                </label>
                <textarea
                  name="unrealisticPolice"
                  value={formData.unrealisticPolice}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            {/* Discord Questions Section */}
            <div className="space-y-4 pt-6 border-t border-white/20">
              <h3 className="text-xl font-bold text-green-300">Domande Discord</h3>

              <div>
                <label className="block text-sm font-medium mb-2">
                  15. Dimmi cosa devi fare per ogni variabile di ticket che si possono aprire (Altro, Partnership,
                  Segnala Giocatore, Consigli) *
                </label>
                <textarea
                  name="gestioneTicket"
                  value={formData.gestioneTicket}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  16. Se qualcuno apre un ticket che vuole segnalare una persona, cosa fai/chiedi? *
                </label>
                <textarea
                  name="proceduraSegnalazione"
                  value={formData.proceduraSegnalazione}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            {/* Personal Questions Section */}
            <div className="space-y-4 pt-6 border-t border-white/20">
              <h3 className="text-xl font-bold text-green-300">Domande Personali</h3>

              <div>
                <label className="block text-sm font-medium mb-2">
                  17. Come Reagisci se non vieni accettato al bando admin? *
                </label>
                <textarea
                  name="reazioneRifiuto"
                  value={formData.reazioneRifiuto}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  18. Come reagisci se vieni accettato al bando admin? *
                </label>
                <textarea
                  name="reazioneAccettazione"
                  value={formData.reazioneAccettazione}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">19. Perche' vuoi diventare un admin? *</label>
                <textarea
                  name="motivoAdmin"
                  value={formData.motivoAdmin}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  20. Sai quante responsabilita' derivano da questo ruolo? Se si, dimmelo. *
                </label>
                <textarea
                  name="consapevolezzaResponsabilita"
                  value={formData.consapevolezzaResponsabilita}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            {/* Cloudflare Turnstile */}
            <div className="pt-6 border-t border-white/20">
              <h3 className="text-xl font-bold text-green-300 mb-4">Captcha Verification</h3>
              <div id="turnstile-container" className="flex justify-center"></div>
            </div>

            {/* Terms Acceptance */}
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-white/20 bg-white/10 text-green-600 focus:ring-2 focus:ring-green-500"
                />
                <span className="text-white text-sm">
                  Io accetto i{" "}
                  <button
                    type="button"
                    onClick={() => setShowTerms(true)}
                    className="text-green-400 hover:text-green-300 underline"
                  >
                    Termini & Condizioni
                  </button>{" "}
                  di Bolzano RP. *
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !termsAccepted || !turnstileToken}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 to-red-600 hover:from-green-700 hover:to-red-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Application
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      {/* Terms Modal */}
      {showTerms && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-gray-900 rounded-xl p-6 border border-white/20 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 sticky top-0 bg-gray-900 pb-4">
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-green-400" />
                <h3 className="text-2xl font-bold">🇮🇹🍝 Termini e Condizioni – Bolzano RP 🍝🇮🇹</h3>
              </div>
              <button onClick={() => setShowTerms(false)} className="text-white/60 hover:text-white transition-colors">
                <span className="text-2xl">×</span>
              </button>
            </div>

            <div className="space-y-4 text-sm text-white/80 leading-relaxed">
              <p className="text-center text-white/90 italic">
                Accedendo e partecipando ai nostri server Discord o Roblox di 🇮🇹🍝 Bolzano RP 🍝🇮🇹, accetti
                automaticamente i seguenti Termini e Condizioni.
              </p>

              <div>
                <h4 className="text-lg font-bold text-green-300 mb-2">🔹 1. Comportamento nella Community</h4>
                <p className="mb-2">
                  La nostra community si basa sul rispetto reciproco, sull'inclusività e sul divertimento. È severamente
                  vietato:
                </p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Spam, flood o trolling</li>
                  <li>Contenuti inappropriati (offensivi, volgari, discriminatori, sessualmente espliciti)</li>
                  <li>Comportamenti tossici (insulti, minacce, molestie)</li>
                  <li>Uso scorretto dei canali Discord</li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-bold text-green-300 mb-2">🔹 2. Rispetto verso lo Staff</h4>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Le decisioni dello staff sono definitive</li>
                  <li>Divieto di abuso di potere da parte degli admin</li>
                  <li>Comunicazione rispettosa con lo staff tramite canali ufficiali</li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-bold text-green-300 mb-2">🔹 3. Sanzioni per Violazioni</h4>
                <p className="mb-2">Le possibili conseguenze includono:</p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Avvertimenti verbali o scritti</li>
                  <li>Mute temporaneo</li>
                  <li>Kick dal server</li>
                  <li>Ban temporaneo o permanente</li>
                  <li>Depx per admin che abusano del ruolo</li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-bold text-green-300 mb-2">
                  🔹 4. Processo di Selezione per lo Staff (Provino Vocale)
                </h4>
                <p className="mb-2">Requisiti preliminari:</p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Membro attivo per almeno 30 giorni</li>
                  <li>Comportamento esemplare</li>
                  <li>Almeno 13 anni (con verifica documento se necessario)</li>
                  <li>Microfono e videocamera funzionanti</li>
                  <li>Attivazione videocamera obbligatoria durante il provino</li>
                </ul>
                <p className="mt-2">Procedura del provino:</p>
                <ol className="list-decimal ml-6 space-y-1">
                  <li>Candidatura scritta tramite modulo</li>
                  <li>Programmazione colloquio vocale</li>
                  <li>Colloquio con video attivo</li>
                  <li>Prova pratica (se richiesta)</li>
                  <li>Risposta entro 7 giorni</li>
                </ol>
              </div>

              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                <h4 className="text-lg font-bold text-green-300 mb-2">🔹 5. Accettazione dei Termini</h4>
                <p>
                  Utilizzando i nostri server Discord o Roblox, accetti automaticamente questi Termini e Condizioni.
                  L'ignoranza delle regole non sarà considerata una giustificazione per eventuali violazioni.
                </p>
              </div>

              <p className="text-center text-white/90 italic pt-4">
                Grazie per essere parte di 🇮🇹🍝 Bolzano RP 🍝🇮🇹 e per contribuire a rendere la nostra community un luogo
                fantastico!
              </p>
            </div>

            <button
              onClick={() => setShowTerms(false)}
              className="mt-6 w-full py-3 bg-gradient-to-r from-green-600 to-red-600 hover:from-green-700 hover:to-red-700 rounded-lg text-white font-bold transition-colors"
            >
              Chiudi
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 border-t border-white/10 mt-16">
        <div className="text-center text-green-300">
          <p className="text-sm">
            © 2025 🇮🇹🍝 Bolzano RP 🍝🇮🇹 - Italian Roleplay Community by{" "}
            <Link href="/" className="text-green-400 hover:text-white transition-colors">
              DaniDema
            </Link>
          </p>
        </div>
      </footer>
    </div>
  )
}

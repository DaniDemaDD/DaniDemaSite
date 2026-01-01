"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ArrowLeft, ShoppingCart, CheckCircle, Download, Copy, Heart, Loader2 } from "lucide-react"
import Link from "next/link"

declare global {
  interface Window {
    turnstile: {
      render: (container: HTMLElement, options: { sitekey: string; callback: (token: string) => void }) => void
      reset: () => void
    }
  }
}

const serviceNames: Record<string, { it: string; en: string }> = {
  discordBots: { it: "Bot Discord", en: "Discord Bot" },
  websites: { it: "Sito Web", en: "Website" },
  websitesWithDomain: { it: "Sito Web + Dominio", en: "Website + Domain" },
  accounts: { it: "Account Email", en: "Email Account" },
  emails: { it: "Email Personalizzata", en: "Custom Email" },
  hosting: { it: "Hosting Forever", en: "Hosting Forever" },
  removeBranding: { it: "Rimuovi Branding", en: "Remove Branding" },
}

export function OrderContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const turnstileRef = useRef<HTMLDivElement>(null)

  const service = searchParams.get("service") || ""
  const price = searchParams.get("price") || ""

  const [language, setLanguage] = useState<"it" | "en">("en")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    discord: "",
    details: "",
  })
  const [turnstileToken, setTurnstileToken] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderCode, setOrderCode] = useState("")
  const [pdfUrl, setPdfUrl] = useState("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const savedLang = localStorage.getItem("danidema-language") as "it" | "en" | null
    if (savedLang) setLanguage(savedLang)
  }, [])

  useEffect(() => {
    // Initialize Turnstile
    if (typeof window !== "undefined" && window.turnstile && turnstileRef.current) {
      window.turnstile.render(turnstileRef.current, {
        sitekey: "0x4AAAAAAA0qKqj-bQsDd7W_",
        callback: (token: string) => setTurnstileToken(token),
      })
    }
  }, [])

  const t = {
    it: {
      title: "Ordina",
      back: "Torna Indietro",
      name: "Nome Completo",
      email: "Email",
      discord: "Discord Tag",
      details: "Dettagli Richiesta",
      detailsPlaceholder: "Descrivi cosa vuoi nel dettaglio...",
      submit: "Invia Ordine",
      submitting: "Invio in corso...",
      price: "Prezzo",
      verifyHuman: "Verifica che sei umano",
      orderSuccess: "Ordine Inviato!",
      orderCodeLabel: "Il tuo codice ordine:",
      orderCodeInfo: "Salva questo codice! Ti servirà per completare il pagamento.",
      downloadPdf: "Scarica PDF",
      copyCode: "Copia Codice",
      copied: "Copiato!",
      paymentInfo: "Per completare l'ordine, contatta dani.dema su Discord e fornisci il codice.",
      madeBy: "Made by DaniDema",
    },
    en: {
      title: "Order",
      back: "Go Back",
      name: "Full Name",
      email: "Email",
      discord: "Discord Tag",
      details: "Request Details",
      detailsPlaceholder: "Describe what you want in detail...",
      submit: "Submit Order",
      submitting: "Submitting...",
      price: "Price",
      verifyHuman: "Verify you are human",
      orderSuccess: "Order Submitted!",
      orderCodeLabel: "Your order code:",
      orderCodeInfo: "Save this code! You'll need it to complete the payment.",
      downloadPdf: "Download PDF",
      copyCode: "Copy Code",
      copied: "Copied!",
      paymentInfo: "To complete the order, contact dani.dema on Discord and provide the code.",
      madeBy: "Made by DaniDema",
    },
  }

  const labels = t[language]
  const serviceName = serviceNames[service]?.[language] || service

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!turnstileToken) {
      alert(language === "it" ? "Completa la verifica Cloudflare" : "Complete the Cloudflare verification")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          service,
          price,
          turnstileToken,
          language,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setOrderCode(data.orderCode)
        setPdfUrl(data.pdfUrl)
        setOrderComplete(true)
      } else {
        alert(data.error || "Error submitting order")
      }
    } catch (error) {
      console.error("Order error:", error)
      alert("Error submitting order")
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyOrderCode = () => {
    navigator.clipboard.writeText(orderCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl max-w-lg w-full text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">{labels.orderSuccess}</h1>
          </div>

          <div className="bg-white/10 rounded-xl p-6 mb-6">
            <p className="text-white/60 text-sm mb-2">{labels.orderCodeLabel}</p>
            <div className="flex items-center justify-center gap-2">
              <code className="text-lg font-mono text-purple-300 bg-black/30 px-4 py-2 rounded-lg break-all">
                {orderCode}
              </code>
              <button
                onClick={copyOrderCode}
                className="p-2 bg-purple-600/20 hover:bg-purple-600/40 rounded-lg transition-colors"
              >
                {copied ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <Copy className="w-5 h-5 text-purple-300" />
                )}
              </button>
            </div>
            <p className="text-white/50 text-xs mt-3">{labels.orderCodeInfo}</p>
          </div>

          <p className="text-white/70 text-sm mb-6">{labels.paymentInfo}</p>

          <div className="flex flex-col gap-3">
            {pdfUrl && (
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all"
              >
                <Download className="w-5 h-5" />
                {labels.downloadPdf}
              </a>
            )}
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-xl transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              {labels.back}
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-center gap-2 text-white/50 text-sm">
            <span>{labels.madeBy}</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          {labels.back}
        </Link>

        <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-7 h-7 text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {labels.title}: {serviceName}
              </h1>
              <p className="text-purple-300">
                {labels.price}: {price}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">{labels.name}</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">{labels.email}</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">{labels.discord}</label>
              <input
                type="text"
                required
                value={formData.discord}
                onChange={(e) => setFormData({ ...formData, discord: e.target.value })}
                placeholder="username#0000"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">{labels.details}</label>
              <textarea
                required
                rows={4}
                value={formData.details}
                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                placeholder={labels.detailsPlaceholder}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-purple-500 transition-colors resize-none"
              />
            </div>

            {/* Cloudflare Turnstile */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">{labels.verifyHuman}</label>
              <div ref={turnstileRef} className="cf-turnstile"></div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !turnstileToken}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {labels.submitting}
                </>
              ) : (
                labels.submit
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-center gap-2 text-white/50 text-sm">
            <span>{labels.madeBy}</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
          </div>
        </div>
      </div>
    </div>
  )
}

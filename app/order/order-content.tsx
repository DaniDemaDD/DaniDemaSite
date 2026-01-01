"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ArrowLeft, ShoppingCart, CheckCircle, Download, Copy, Heart, Loader2 } from "lucide-react"
import Link from "next/link"
import Script from "next/script"

declare global {
  interface Window {
    turnstile: {
      render: (
        container: HTMLElement,
        options: { sitekey: string; callback: (token: string) => void; theme?: string },
      ) => string
      reset: (widgetId?: string) => void
    }
  }
}

const serviceNames: Record<string, Record<string, string>> = {
  discordBots: {
    it: "Bot Discord",
    en: "Discord Bot",
    de: "Discord Bot",
    fr: "Bot Discord",
    es: "Bot Discord",
    pt: "Bot Discord",
    nl: "Discord Bot",
    pl: "Bot Discord",
    ru: "Discord Бот",
    ja: "Discord ボット",
  },
  websites: {
    it: "Sito Web",
    en: "Website",
    de: "Website",
    fr: "Site Web",
    es: "Sitio Web",
    pt: "Site",
    nl: "Website",
    pl: "Strona",
    ru: "Сайт",
    ja: "ウェブサイト",
  },
  websitesWithDomain: {
    it: "Sito Web + Dominio",
    en: "Website + Domain",
    de: "Website + Domain",
    fr: "Site + Domaine",
    es: "Sitio + Dominio",
    pt: "Site + Domínio",
    nl: "Website + Domein",
    pl: "Strona + Domena",
    ru: "Сайт + Домен",
    ja: "サイト + ドメイン",
  },
  accounts: {
    it: "Account Email",
    en: "Email Account",
    de: "E-Mail-Konto",
    fr: "Compte Email",
    es: "Cuenta Email",
    pt: "Conta Email",
    nl: "Email Account",
    pl: "Konto Email",
    ru: "Email Аккаунт",
    ja: "メールアカウント",
  },
  emails: {
    it: "Email Personalizzata",
    en: "Custom Email",
    de: "Custom E-Mail",
    fr: "Email Custom",
    es: "Email Custom",
    pt: "Email Custom",
    nl: "Custom Email",
    pl: "Custom Email",
    ru: "Custom Email",
    ja: "カスタムメール",
  },
  hosting: {
    it: "Hosting Forever",
    en: "Hosting Forever",
    de: "Hosting Forever",
    fr: "Hébergement Forever",
    es: "Hosting Forever",
    pt: "Hosting Forever",
    nl: "Hosting Forever",
    pl: "Hosting Forever",
    ru: "Хостинг Навсегда",
    ja: "永久ホスティング",
  },
  removeBranding: {
    it: "Rimuovi Branding",
    en: "Remove Branding",
    de: "Branding Entfernen",
    fr: "Retirer Branding",
    es: "Eliminar Branding",
    pt: "Remover Branding",
    nl: "Branding Verwijderen",
    pl: "Usuń Branding",
    ru: "Убрать Брендинг",
    ja: "ブランディング削除",
  },
}

interface CartItem {
  key: string
  price: number
  quantity: number
}

export function OrderContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const turnstileRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string>("")

  const cartParam = searchParams.get("cart")
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  const [language, setLanguage] = useState<string>("en")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    discord: "",
    details: "",
  })
  const [turnstileToken, setTurnstileToken] = useState("")
  const [turnstileLoaded, setTurnstileLoaded] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderCode, setOrderCode] = useState("")
  const [pdfUrl, setPdfUrl] = useState("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const savedLang = localStorage.getItem("danidema-language") as string | null
    if (savedLang) setLanguage(savedLang)

    if (cartParam) {
      try {
        const parsed = JSON.parse(decodeURIComponent(cartParam))
        setCartItems(parsed)
      } catch {
        console.error("Failed to parse cart")
      }
    }
  }, [cartParam])

  useEffect(() => {
    if (turnstileLoaded && turnstileRef.current && !widgetIdRef.current) {
      widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
        sitekey: "0x4AAAAAACKFFCsRdY0S5NpG",
        theme: "dark",
        callback: (token: string) => setTurnstileToken(token),
      })
    }
  }, [turnstileLoaded])

  const t: Record<string, Record<string, string>> = {
    it: {
      title: "Checkout",
      back: "Torna Indietro",
      name: "Nome Completo",
      email: "Email",
      discord: "Discord Tag",
      details: "Dettagli Richiesta",
      detailsPlaceholder: "Descrivi cosa vuoi nel dettaglio...",
      submit: "Completa Ordine",
      submitting: "Invio in corso...",
      total: "Totale",
      verifyHuman: "Verifica che sei umano",
      orderSuccess: "Ordine Inviato!",
      orderCodeLabel: "Il tuo codice ordine:",
      orderCodeInfo: "Salva questo codice! Ti servirà per completare il pagamento.",
      downloadPdf: "Scarica PDF",
      copyCode: "Copia Codice",
      copied: "Copiato!",
      paymentInfo: "Per completare l'ordine, contatta dani.dema su Discord e fornisci il codice.",
      madeBy: "Made by DaniDema",
      emptyCart: "Il carrello è vuoto",
      yourOrder: "Il tuo ordine",
    },
    en: {
      title: "Checkout",
      back: "Go Back",
      name: "Full Name",
      email: "Email",
      discord: "Discord Tag",
      details: "Request Details",
      detailsPlaceholder: "Describe what you want in detail...",
      submit: "Complete Order",
      submitting: "Submitting...",
      total: "Total",
      verifyHuman: "Verify you are human",
      orderSuccess: "Order Submitted!",
      orderCodeLabel: "Your order code:",
      orderCodeInfo: "Save this code! You'll need it to complete the payment.",
      downloadPdf: "Download PDF",
      copyCode: "Copy Code",
      copied: "Copied!",
      paymentInfo: "To complete the order, contact dani.dema on Discord and provide the code.",
      madeBy: "Made by DaniDema",
      emptyCart: "Cart is empty",
      yourOrder: "Your order",
    },
  }

  const labels = t[language] || t.en
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

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
          items: cartItems,
          total: cartTotal,
          turnstileToken,
          language,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setOrderCode(data.orderCode)
        setPdfUrl(data.pdfUrl)
        setOrderComplete(true)
        localStorage.removeItem("danidema-cart")
      } else {
        alert(data.error || "Error submitting order")
        if (window.turnstile && widgetIdRef.current) {
          window.turnstile.reset(widgetIdRef.current)
        }
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
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-zinc-900 rounded-3xl p-8 md:p-12 border border-zinc-800 shadow-2xl max-w-lg w-full text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">{labels.orderSuccess}</h1>
          </div>

          <div className="bg-zinc-800/50 rounded-xl p-6 mb-6 border border-zinc-700">
            <p className="text-zinc-400 text-sm mb-2">{labels.orderCodeLabel}</p>
            <div className="flex items-center justify-center gap-2">
              <code className="text-lg font-mono text-blue-400 bg-black/50 px-4 py-2 rounded-lg break-all">
                {orderCode}
              </code>
              <button
                onClick={copyOrderCode}
                className="p-2 bg-blue-500/20 hover:bg-blue-500/40 rounded-lg transition-colors"
              >
                {copied ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <Copy className="w-5 h-5 text-blue-400" />
                )}
              </button>
            </div>
            <p className="text-zinc-500 text-xs mt-3">{labels.orderCodeInfo}</p>
          </div>

          <p className="text-zinc-400 text-sm mb-6">{labels.paymentInfo}</p>

          <div className="flex flex-col gap-3">
            {pdfUrl && (
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-all"
              >
                <Download className="w-5 h-5" />
                {labels.downloadPdf}
              </a>
            )}
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 px-6 rounded-xl transition-all border border-zinc-700"
            >
              <ArrowLeft className="w-5 h-5" />
              {labels.back}
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-zinc-800 flex items-center justify-center gap-2 text-zinc-500 text-sm">
            <span>{labels.madeBy}</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
          </div>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center">
          <ShoppingCart className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
          <p className="text-zinc-400 text-xl mb-6">{labels.emptyCart}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            {labels.back}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" onLoad={() => setTurnstileLoaded(true)} />
      <div className="min-h-screen bg-black py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            {labels.back}
          </Link>

          <div className="bg-zinc-900 rounded-3xl p-8 border border-zinc-800 shadow-2xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-7 h-7 text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{labels.title}</h1>
                <p className="text-zinc-400">{labels.yourOrder}</p>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-zinc-800/50 rounded-xl p-4 mb-6 border border-zinc-700">
              {cartItems.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between py-2 border-b border-zinc-700 last:border-0"
                >
                  <div>
                    <span className="text-white">{serviceNames[item.key]?.[language] || item.key}</span>
                    <span className="text-zinc-500 ml-2">x{item.quantity}</span>
                  </div>
                  <span className="text-blue-400 font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex items-center justify-between pt-4 mt-2 border-t border-zinc-600">
                <span className="text-lg font-bold text-white">{labels.total}</span>
                <span className="text-2xl font-bold text-blue-400">${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-zinc-300 text-sm font-medium mb-2">{labels.name}</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-zinc-300 text-sm font-medium mb-2">{labels.email}</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-zinc-300 text-sm font-medium mb-2">{labels.discord}</label>
                <input
                  type="text"
                  required
                  value={formData.discord}
                  onChange={(e) => setFormData({ ...formData, discord: e.target.value })}
                  placeholder="username"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-zinc-300 text-sm font-medium mb-2">{labels.details}</label>
                <textarea
                  required
                  rows={4}
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  placeholder={labels.detailsPlaceholder}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                />
              </div>

              {/* Cloudflare Turnstile */}
              <div>
                <label className="block text-zinc-300 text-sm font-medium mb-2">{labels.verifyHuman}</label>
                <div ref={turnstileRef} className="cf-turnstile" data-theme="dark"></div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !turnstileToken}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
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

            <div className="mt-8 pt-6 border-t border-zinc-800 flex items-center justify-center gap-2 text-zinc-500 text-sm">
              <span>{labels.madeBy}</span>
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

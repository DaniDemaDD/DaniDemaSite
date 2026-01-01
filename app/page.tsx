"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Globe, Code, Sparkles, ArrowRight, Heart } from "lucide-react"

type Language = "it" | "en"

const translations = {
  it: {
    selectLanguage: "Seleziona la tua lingua",
    italian: "Italiano",
    english: "English",
    welcome: "Benvenuto",
    heroTitle: "Sono DaniDema",
    heroSubtitle: "Developer & Creator",
    heroDescription: "Creo bot Discord, siti web e molto altro. Tutto con passione e qualità.",
    viewServices: "Vedi i Servizi",
    viewProfile: "Il Mio Profilo",
    servicesTitle: "I Miei Servizi",
    discordBots: "Bot Discord",
    discordBotsDesc: "Bot personalizzati per il tuo server Discord",
    websites: "Siti Web",
    websitesDesc: "Siti web moderni e responsive",
    websitesWithDomain: "Siti Web + Dominio",
    websitesWithDomainDesc: "Sito web completo con dominio incluso",
    accounts: "Account Email",
    accountsDesc: "Account @sl4ve.xyz o @danidema.xyz",
    emails: "Email Personalizzate",
    emailsDesc: "Email @lol.danidema.xyz o @ilove.sl4ve.xyz",
    hosting: "Hosting Forever",
    hostingDesc: "Hosting permanente, paghi una volta sola",
    removeBranding: "Rimuovi Branding",
    removeBrandingDesc: 'Rimuovi "Made by DaniDema" dai tuoi prodotti',
    from: "Da",
    oneTime: "Una tantum",
    orderNow: "Ordina Ora",
    contactTitle: "Contattami",
    contactDesc: "Hai domande? Contattami su Discord o via email",
    discord: "Discord",
    email: "Email",
    community: "Community Discord",
    skillsTitle: "Le Mie Skills",
    python: "Python",
    nodejs: "Node.js",
    footerText: "Made by DaniDema",
    terms: "Termini di Servizio",
    privacy: "Privacy Policy",
    installments: "Pagamenti a rate disponibili (da concordare)",
    paypal: "Pagamento via PayPal",
  },
  en: {
    selectLanguage: "Select your language",
    italian: "Italiano",
    english: "English",
    welcome: "Welcome",
    heroTitle: "I'm DaniDema",
    heroSubtitle: "Developer & Creator",
    heroDescription: "I create Discord bots, websites and much more. All with passion and quality.",
    viewServices: "View Services",
    viewProfile: "My Profile",
    servicesTitle: "My Services",
    discordBots: "Discord Bots",
    discordBotsDesc: "Custom bots for your Discord server",
    websites: "Websites",
    websitesDesc: "Modern and responsive websites",
    websitesWithDomain: "Websites + Domain",
    websitesWithDomainDesc: "Complete website with domain included",
    accounts: "Email Accounts",
    accountsDesc: "Account @sl4ve.xyz or @danidema.xyz",
    emails: "Custom Emails",
    emailsDesc: "Email @lol.danidema.xyz or @ilove.sl4ve.xyz",
    hosting: "Hosting Forever",
    hostingDesc: "Permanent hosting, pay once",
    removeBranding: "Remove Branding",
    removeBrandingDesc: 'Remove "Made by DaniDema" from your products',
    from: "From",
    oneTime: "One time",
    orderNow: "Order Now",
    contactTitle: "Contact Me",
    contactDesc: "Got questions? Contact me on Discord or via email",
    discord: "Discord",
    email: "Email",
    community: "Discord Community",
    skillsTitle: "My Skills",
    python: "Python",
    nodejs: "Node.js",
    footerText: "Made by DaniDema",
    terms: "Terms of Service",
    privacy: "Privacy Policy",
    installments: "Installment payments available (to be agreed)",
    paypal: "Payment via PayPal",
  },
}

const services = [
  { key: "discordBots", descKey: "discordBotsDesc", price: "3$", icon: "🤖", from: true },
  { key: "websites", descKey: "websitesDesc", price: "7$", icon: "🌐", from: false },
  { key: "websitesWithDomain", descKey: "websitesWithDomainDesc", price: "12$", icon: "🔗", from: false },
  { key: "accounts", descKey: "accountsDesc", price: "3$", icon: "👤", from: false },
  { key: "emails", descKey: "emailsDesc", price: "0.99$", icon: "📧", from: false },
  { key: "hosting", descKey: "hostingDesc", price: "15$", icon: "🚀", from: false, oneTime: true },
  { key: "removeBranding", descKey: "removeBrandingDesc", price: "7$", icon: "✨", from: false },
]

export default function HomePage() {
  const [language, setLanguage] = useState<Language | null>(null)
  const [showLanguageSelector, setShowLanguageSelector] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if language was already selected
    const savedLang = localStorage.getItem("danidema-language") as Language | null
    if (savedLang) {
      setLanguage(savedLang)
      setShowLanguageSelector(false)
    }
    setIsLoaded(true)
  }, [])

  const selectLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("danidema-language", lang)
    setShowLanguageSelector(false)
  }

  const t = language ? translations[language] : translations.en

  // Language Selector Modal
  if (showLanguageSelector) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className={`transition-all duration-700 ${isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
          <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl max-w-md w-full">
            <div className="text-center mb-8">
              <Globe className="w-16 h-16 text-purple-400 mx-auto mb-4 animate-pulse" />
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{translations.en.selectLanguage}</h1>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => selectLanguage("it")}
                className="w-full group relative overflow-hidden bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/25"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <span className="text-2xl">🇮🇹</span>
                  <span>Italiano</span>
                </span>
              </button>

              <button
                onClick={() => selectLanguage("en")}
                className="w-full group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <span className="text-2xl">🇬🇧</span>
                  <span>English</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-900 to-slate-900"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div
            className={`transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            {/* Profile Image */}
            <div className="mb-8 relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <img
                src="/cat2.jpg"
                alt="DaniDema"
                className="relative w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white/20 shadow-2xl"
              />
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              {t.heroTitle}
            </h1>
            <p className="text-xl md:text-2xl text-purple-300 mb-4 font-medium">{t.heroSubtitle}</p>
            <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">{t.heroDescription}</p>

            {/* Skills */}
            <div className="flex justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <Code className="w-5 h-5 text-yellow-400" />
                <span className="font-medium">Python</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <Code className="w-5 h-5 text-green-400" />
                <span className="font-medium">Node.js</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#services"
                className="group inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
              >
                <Sparkles className="w-5 h-5" />
                {t.viewServices}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <button
                onClick={() => router.push("/profile")}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                {t.viewProfile}
              </button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-white/50 rounded-full animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">{t.servicesTitle}</h2>
          <p className="text-center text-white/60 mb-12">
            {t.paypal} • {t.installments}
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div
                key={service.key}
                className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-xl hover:shadow-purple-500/10"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold mb-2">{t[service.key as keyof typeof t]}</h3>
                <p className="text-white/60 mb-4 text-sm">{t[service.descKey as keyof typeof t]}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-white/60 text-sm">{service.from ? t.from : ""}</span>
                    <span className="text-2xl font-bold text-purple-400 ml-1">{service.price}</span>
                    {service.oneTime && <span className="text-xs text-white/50 ml-2">({t.oneTime})</span>}
                  </div>
                  <button
                    onClick={() => router.push(`/order?service=${service.key}&price=${service.price}`)}
                    className="px-4 py-2 bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 rounded-lg text-purple-300 font-medium transition-all duration-300 text-sm"
                  >
                    {t.orderNow}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{t.contactTitle}</h2>
          <p className="text-white/60 mb-12">{t.contactDesc}</p>

          <div className="grid md:grid-cols-3 gap-6">
            <a
              href="https://discord.com/users/dani.dema"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-[#5865F2]/20 backdrop-blur-sm rounded-2xl p-6 border border-[#5865F2]/30 hover:border-[#5865F2]/60 transition-all duration-300 hover:transform hover:scale-105"
            >
              <img
                src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/discord.svg"
                alt="Discord"
                className="w-12 h-12 mx-auto mb-4 filter invert"
              />
              <h3 className="font-bold text-lg">{t.discord}</h3>
              <p className="text-white/60 text-sm">dani.dema</p>
            </a>

            <a
              href="mailto:support@danidema.xyz"
              className="group bg-red-500/20 backdrop-blur-sm rounded-2xl p-6 border border-red-500/30 hover:border-red-500/60 transition-all duration-300 hover:transform hover:scale-105"
            >
              <img
                src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/gmail.svg"
                alt="Email"
                className="w-12 h-12 mx-auto mb-4 filter invert"
              />
              <h3 className="font-bold text-lg">{t.email}</h3>
              <p className="text-white/60 text-sm">support@danidema.xyz</p>
            </a>

            <a
              href="https://discord.gg/BTWsXaUme3"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-purple-500/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 hover:transform hover:scale-105"
            >
              <img
                src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/discord.svg"
                alt="Community"
                className="w-12 h-12 mx-auto mb-4 filter invert"
              />
              <h3 className="font-bold text-lg">{t.community}</h3>
              <p className="text-white/60 text-sm">discord.gg/BTWsXaUme3</p>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white/60">
            <span>{t.footerText}</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
          </div>
          <div className="flex gap-6 text-sm text-white/60">
            <a
              href="https://home.danidema.xyz/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              {t.terms}
            </a>
            <a
              href="https://home.danidema.xyz/policy"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              {t.privacy}
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Globe, Code, Sparkles, ArrowRight, Heart, ShoppingCart, Plus, Minus, X, Check, Settings, Trash2 } from "lucide-react"

type Language = "it" | "en" | "de" | "fr" | "es" | "pt" | "nl" | "pl" | "ru" | "ja"

const languages: { code: Language; name: string; nativeName: string; flag: string }[] = [
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹" },
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇵🇹" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands", flag: "🇳🇱" },
  { code: "pl", name: "Polish", nativeName: "Polski", flag: "🇵🇱" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
]

const translations: Record<Language, Record<string, string>> = {
  it: {
    selectLanguage: "Scegli la tua lingua",
    continue: "Continua",
    welcome: "Benvenuto",
    heroTitle: "DaniDema",
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
    removeBrandingDesc: 'Rimuovi "Made by DaniDema ❤️" dai tuoi prodotti',
    from: "Da",
    oneTime: "Una tantum",
    addToCart: "Aggiungi",
    cart: "Carrello",
    checkout: "Checkout",
    emptyCart: "Carrello vuoto",
    total: "Totale",
    contactTitle: "Contattami",
    contactDesc: "Hai domande? Contattami su Discord o via email",
    discord: "Discord",
    email: "Email",
    community: "Community Discord",
    footerText: "Made by DaniDema",
    terms: "Termini di Servizio",
    privacy: "Privacy Policy",
    installments: "Pagamenti a rate disponibili (da concordare)",
    paypal: "Pagamento via PayPal",
    removeItem: "Rimuovi",
  },
  en: {
    selectLanguage: "Choose your language",
    continue: "Continue",
    welcome: "Welcome",
    heroTitle: "DaniDema",
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
    removeBrandingDesc: 'Remove "Made by DaniDema ❤️" from your products',
    from: "From",
    oneTime: "One time",
    addToCart: "Add",
    cart: "Cart",
    checkout: "Checkout",
    emptyCart: "Cart is empty",
    total: "Total",
    contactTitle: "Contact Me",
    contactDesc: "Got questions? Contact me on Discord or via email",
    discord: "Discord",
    email: "Email",
    community: "Discord Community",
    footerText: "Made by DaniDema",
    terms: "Terms of Service",
    privacy: "Privacy Policy",
    installments: "Installment payments available (to be agreed)",
    paypal: "Payment via PayPal",
    removeItem: "Remove",
  },
  de: {
    selectLanguage: "Wähle deine Sprache",
    continue: "Weiter",
    welcome: "Willkommen",
    heroTitle: "DaniDema",
    heroSubtitle: "Entwickler & Ersteller",
    heroDescription: "Ich erstelle Discord-Bots, Websites und vieles mehr. Alles mit Leidenschaft und Qualität.",
    viewServices: "Dienste ansehen",
    viewProfile: "Mein Profil",
    servicesTitle: "Meine Dienste",
    discordBots: "Discord Bots",
    discordBotsDesc: "Individuelle Bots für deinen Discord-Server",
    websites: "Websites",
    websitesDesc: "Moderne und responsive Websites",
    websitesWithDomain: "Websites + Domain",
    websitesWithDomainDesc: "Komplette Website mit Domain inklusive",
    accounts: "E-Mail-Konten",
    accountsDesc: "Konto @sl4ve.xyz oder @danidema.xyz",
    emails: "Individuelle E-Mails",
    emailsDesc: "E-Mail @lol.danidema.xyz oder @ilove.sl4ve.xyz",
    hosting: "Hosting Forever",
    hostingDesc: "Permanentes Hosting, einmalig zahlen",
    removeBranding: "Branding entfernen",
    removeBrandingDesc: '"Made by DaniDema ❤️" von deinen Produkten entfernen',
    from: "Ab",
    oneTime: "Einmalig",
    addToCart: "Hinzufügen",
    cart: "Warenkorb",
    checkout: "Zur Kasse",
    emptyCart: "Warenkorb ist leer",
    total: "Gesamt",
    contactTitle: "Kontakt",
    contactDesc: "Fragen? Kontaktiere mich auf Discord oder per E-Mail",
    discord: "Discord",
    email: "Email",
    community: "Discord Community",
    footerText: "Made by DaniDema",
    terms: "Nutzungsbedingungen",
    privacy: "Datenschutz",
    installments: "Ratenzahlung möglich (nach Vereinbarung)",
    paypal: "Zahlung per PayPal",
    removeItem: "Entfernen",
  },
  fr: {
    selectLanguage: "Choisissez votre langue",
    continue: "Continuer",
    welcome: "Bienvenue",
    heroTitle: "DaniDema",
    heroSubtitle: "Développeur & Créateur",
    heroDescription: "Je crée des bots Discord, des sites web et bien plus. Tout avec passion et qualité.",
    viewServices: "Voir les Services",
    viewProfile: "Mon Profil",
    servicesTitle: "Mes Services",
    discordBots: "Bots Discord",
    discordBotsDesc: "Bots personnalisés pour votre serveur Discord",
    websites: "Sites Web",
    websitesDesc: "Sites web modernes et responsifs",
    websitesWithDomain: "Sites Web + Domaine",
    websitesWithDomainDesc: "Site web complet avec domaine inclus",
    accounts: "Comptes Email",
    accountsDesc: "Compte @sl4ve.xyz ou @danidema.xyz",
    emails: "Emails Personnalisés",
    emailsDesc: "Email @lol.danidema.xyz ou @ilove.sl4ve.xyz",
    hosting: "Hébergement Forever",
    hostingDesc: "Hébergement permanent, payez une fois",
    removeBranding: "Retirer le Branding",
    removeBrandingDesc: 'Retirer "Made by DaniDema ❤️" de vos produits',
    from: "À partir de",
    oneTime: "Une fois",
    addToCart: "Ajouter",
    cart: "Panier",
    checkout: "Commander",
    emptyCart: "Panier vide",
    total: "Total",
    contactTitle: "Contactez-moi",
    contactDesc: "Des questions? Contactez-moi sur Discord ou par email",
    discord: "Discord",
    email: "Email",
    community: "Communauté Discord",
    footerText: "Made by DaniDema",
    terms: "Conditions d'utilisation",
    privacy: "Politique de confidentialité",
    installments: "Paiement en plusieurs fois disponible (à convenir)",
    paypal: "Paiement par PayPal",
    removeItem: "Retirer",
  },
  es: {
    selectLanguage: "Elige tu idioma",
    continue: "Continuar",
    welcome: "Bienvenido",
    heroTitle: "DaniDema",
    heroSubtitle: "Desarrollador & Creador",
    heroDescription: "Creo bots de Discord, sitios web y mucho más. Todo con pasión y calidad.",
    viewServices: "Ver Servicios",
    viewProfile: "Mi Perfil",
    servicesTitle: "Mis Servicios",
    discordBots: "Bots Discord",
    discordBotsDesc: "Bots personalizados para tu servidor Discord",
    websites: "Sitios Web",
    websitesDesc: "Sitios web modernos y responsivos",
    websitesWithDomain: "Sitios Web + Dominio",
    websitesWithDomainDesc: "Sitio web completo con dominio incluido",
    accounts: "Cuentas Email",
    accountsDesc: "Cuenta @sl4ve.xyz o @danidema.xyz",
    emails: "Emails Personalizados",
    emailsDesc: "Email @lol.danidema.xyz o @ilove.sl4ve.xyz",
    hosting: "Hosting Forever",
    hostingDesc: "Hosting permanente, paga una vez",
    removeBranding: "Eliminar Branding",
    removeBrandingDesc: 'Eliminar "Made by DaniDema ❤️" de tus productos',
    from: "Desde",
    oneTime: "Una vez",
    addToCart: "Añadir",
    cart: "Carrito",
    checkout: "Pagar",
    emptyCart: "Carrito vacío",
    total: "Total",
    contactTitle: "Contáctame",
    contactDesc: "¿Preguntas? Contáctame en Discord o por email",
    discord: "Discord",
    email: "Email",
    community: "Comunidad Discord",
    footerText: "Made by DaniDema",
    terms: "Términos de Servicio",
    privacy: "Política de Privacidad",
    installments: "Pagos a plazos disponibles (a acordar)",
    paypal: "Pago por PayPal",
    removeItem: "Eliminar",
  },
  pt: {
    selectLanguage: "Escolha seu idioma",
    continue: "Continuar",
    welcome: "Bem-vindo",
    heroTitle: "DaniDema",
    heroSubtitle: "Desenvolvedor & Criador",
    heroDescription: "Crio bots Discord, sites e muito mais. Tudo com paixão e qualidade.",
    viewServices: "Ver Serviços",
    viewProfile: "Meu Perfil",
    servicesTitle: "Meus Serviços",
    discordBots: "Bots Discord",
    discordBotsDesc: "Bots personalizados para seu servidor Discord",
    websites: "Sites",
    websitesDesc: "Sites modernos e responsivos",
    websitesWithDomain: "Sites + Domínio",
    websitesWithDomainDesc: "Site completo com domínio incluído",
    accounts: "Contas Email",
    accountsDesc: "Conta @sl4ve.xyz ou @danidema.xyz",
    emails: "Emails Personalizados",
    emailsDesc: "Email @lol.danidema.xyz ou @ilove.sl4ve.xyz",
    hosting: "Hosting Forever",
    hostingDesc: "Hosting permanente, pague uma vez",
    removeBranding: "Remover Branding",
    removeBrandingDesc: 'Remover "Made by DaniDema ❤️" dos seus produtos',
    from: "A partir de",
    oneTime: "Uma vez",
    addToCart: "Adicionar",
    cart: "Carrinho",
    checkout: "Finalizar",
    emptyCart: "Carrinho vazio",
    total: "Total",
    contactTitle: "Contacte-me",
    contactDesc: "Perguntas? Contacte-me no Discord ou por email",
    discord: "Discord",
    email: "Email",
    community: "Comunidade Discord",
    footerText: "Made by DaniDema",
    terms: "Termos de Serviço",
    privacy: "Política de Privacidade",
    installments: "Pagamentos parcelados disponíveis (a combinar)",
    paypal: "Pagamento por PayPal",
    removeItem: "Remover",
  },
  nl: {
    selectLanguage: "Kies je taal",
    continue: "Doorgaan",
    welcome: "Welkom",
    heroTitle: "DaniDema",
    heroSubtitle: "Ontwikkelaar & Maker",
    heroDescription: "Ik maak Discord bots, websites en nog veel meer. Alles met passie en kwaliteit.",
    viewServices: "Bekijk Services",
    viewProfile: "Mijn Profiel",
    servicesTitle: "Mijn Services",
    discordBots: "Discord Bots",
    discordBotsDesc: "Aangepaste bots voor je Discord server",
    websites: "Websites",
    websitesDesc: "Moderne en responsieve websites",
    websitesWithDomain: "Websites + Domein",
    websitesWithDomainDesc: "Complete website met domein inbegrepen",
    accounts: "Email Accounts",
    accountsDesc: "Account @sl4ve.xyz of @danidema.xyz",
    emails: "Aangepaste Emails",
    emailsDesc: "Email @lol.danidema.xyz of @ilove.sl4ve.xyz",
    hosting: "Hosting Forever",
    hostingDesc: "Permanente hosting, betaal eenmalig",
    removeBranding: "Branding Verwijderen",
    removeBrandingDesc: '"Made by DaniDema ❤️" van je producten verwijderen',
    from: "Vanaf",
    oneTime: "Eenmalig",
    addToCart: "Toevoegen",
    cart: "Winkelwagen",
    checkout: "Afrekenen",
    emptyCart: "Winkelwagen is leeg",
    total: "Totaal",
    contactTitle: "Neem Contact Op",
    contactDesc: "Vragen? Neem contact op via Discord of email",
    discord: "Discord",
    email: "Email",
    community: "Discord Community",
    footerText: "Made by DaniDema",
    terms: "Servicevoorwaarden",
    privacy: "Privacybeleid",
    installments: "Betaling in termijnen mogelijk (af te spreken)",
    paypal: "Betaling via PayPal",
    removeItem: "Verwijderen",
  },
  pl: {
    selectLanguage: "Wybierz język",
    continue: "Kontynuuj",
    welcome: "Witaj",
    heroTitle: "DaniDema",
    heroSubtitle: "Programista & Twórca",
    heroDescription: "Tworzę boty Discord, strony internetowe i wiele więcej. Wszystko z pasją i jakością.",
    viewServices: "Zobacz Usługi",
    viewProfile: "Mój Profil",
    servicesTitle: "Moje Usługi",
    discordBots: "Boty Discord",
    discordBotsDesc: "Niestandardowe boty dla Twojego serwera Discord",
    websites: "Strony Internetowe",
    websitesDesc: "Nowoczesne i responsywne strony",
    websitesWithDomain: "Strony + Domena",
    websitesWithDomainDesc: "Kompletna strona z domeną w zestawie",
    accounts: "Konta Email",
    accountsDesc: "Konto @sl4ve.xyz lub @danidema.xyz",
    emails: "Niestandardowe Emaile",
    emailsDesc: "Email @lol.danidema.xyz lub @ilove.sl4ve.xyz",
    hosting: "Hosting Forever",
    hostingDesc: "Stały hosting, zapłać raz",
    removeBranding: "Usuń Branding",
    removeBrandingDesc: 'Usuń "Made by DaniDema ❤️" z Twoich produktów',
    from: "Od",
    oneTime: "Jednorazowo",
    addToCart: "Dodaj",
    cart: "Koszyk",
    checkout: "Zamów",
    emptyCart: "Koszyk jest pusty",
    total: "Suma",
    contactTitle: "Skontaktuj się",
    contactDesc: "Pytania? Skontaktuj się na Discord lub przez email",
    discord: "Discord",
    email: "Email",
    community: "Społeczność Discord",
    footerText: "Made by DaniDema",
    terms: "Regulamin",
    privacy: "Polityka Prywatności",
    installments: "Płatność ratalna dostępna (do uzgodnienia)",
    paypal: "Płatność przez PayPal",
    removeItem: "Usuń",
  },
  ru: {
    selectLanguage: "Выберите язык",
    continue: "Продолжить",
    welcome: "Добро пожаловать",
    heroTitle: "DaniDema",
    heroSubtitle: "Разработчик & Создатель",
    heroDescription: "Создаю Discord ботов, сайты и многое другое. Всё с страстью и качеством.",
    viewServices: "Услуги",
    viewProfile: "Мой Профиль",
    servicesTitle: "Мои Услуги",
    discordBots: "Discord Боты",
    discordBotsDesc: "Кастомные боты для вашего Discord сервера",
    websites: "Сайты",
    websitesDesc: "Современные и адаптивные сайты",
    websitesWithDomain: "Сайты + Домен",
    websitesWithDomainDesc: "Полный сайт с доменом включительно",
    accounts: "Email Аккаунты",
    accountsDesc: "Аккаунт @sl4ve.xyz или @danidema.xyz",
    emails: "Кастомные Email",
    emailsDesc: "Email @lol.danidema.xyz или @ilove.sl4ve.xyz",
    hosting: "Хостинг Навсегда",
    hostingDesc: "Постоянный хостинг, оплата один раз",
    removeBranding: "Убрать Брендинг",
    removeBrandingDesc: 'Убрать "Made by DaniDema ❤️" с ваших продуктов',
    from: "От",
    oneTime: "Разово",
    addToCart: "Добавить",
    cart: "Корзина",
    checkout: "Оформить",
    emptyCart: "Корзина пуста",
    total: "Итого",
    contactTitle: "Связаться",
    contactDesc: "Вопросы? Свяжитесь со мной в Discord или по email",
    discord: "Discord",
    email: "Email",
    community: "Discord Сообщество",
    footerText: "Made by DaniDema",
    terms: "Условия Использования",
    privacy: "Политика Конфиденциальности",
    installments: "Рассрочка доступна (по договорённости)",
    paypal: "Оплата через PayPal",
    removeItem: "Удалить",
  },
  ja: {
    selectLanguage: "言語を選択",
    continue: "続行",
    welcome: "ようこそ",
    heroTitle: "DaniDema",
    heroSubtitle: "開発者 & クリエイター",
    heroDescription: "Discordボット、ウェブサイトなどを作成します。すべて情熱と品質で。",
    viewServices: "サービスを見る",
    viewProfile: "プロフィール",
    servicesTitle: "サービス",
    discordBots: "Discord ボット",
    discordBotsDesc: "あなたのDiscordサーバー用のカスタムボット",
    websites: "ウェブサイト",
    websitesDesc: "モダンでレスポンシブなウェブサイト",
    websitesWithDomain: "ウェブサイト + ドメイン",
    websitesWithDomainDesc: "ドメイン付きの完全なウェブサイト",
    accounts: "メールアカウント",
    accountsDesc: "@sl4ve.xyzまたは@danidema.xyzのアカウント",
    emails: "カスタムメール",
    emailsDesc: "@lol.danidema.xyzまたは@ilove.sl4ve.xyzのメール",
    hosting: "永久ホスティング",
    hostingDesc: "永久ホスティング、一度だけ支払い",
    removeBranding: "ブランディング削除",
    removeBrandingDesc: '製品から"Made by DaniDema ❤️"を削除',
    from: "から",
    oneTime: "一回限り",
    addToCart: "追加",
    cart: "カート",
    checkout: "購入",
    emptyCart: "カートは空です",
    total: "合計",
    contactTitle: "お問い合わせ",
    contactDesc: "質問がありますか？Discordまたはメールでお問い合わせください",
    discord: "Discord",
    email: "メール",
    community: "Discord コミュニティ",
    footerText: "Made by DaniDema",
    terms: "利用規約",
    privacy: "プライバシーポリシー",
    installments: "分割払い可能（要相談）",
    paypal: "PayPalで支払い",
    removeItem: "削除",
  },
}

interface CartItem {
  key: string
  price: number
  quantity: number
}

const services = [
  {
    key: "discordBots",
    price: 3,
    icon: "🤖",
    from: true,
    stripeBuyButtonId: "buy_btn_1SrMhVRWjkV59RDtQF4GYKN0",
  },
  {
    key: "websites",
    price: 7,
    icon: "🌐",
    from: false,
    stripeBuyButtonId: "buy_btn_1SrMiqRWjkV59RDtQ5MMjw0e",
  },
  {
    key: "websitesWithDomain",
    price: 12,
    icon: "🔗",
    from: false,
    stripeBuyButtonId: "buy_btn_1SrMkgRWjkV59RDtsrUHlAkD",
  },
  {
    key: "accounts",
    price: 3,
    icon: "👤",
    from: false,
    stripeBuyButtonId: "buy_btn_1SrMljRWjkV59RDtDyOh1ono",
  },
  {
    key: "emails",
    price: 0.99,
    icon: "📧",
    from: false,
    stripeBuyButtonId: "buy_btn_1SrMmzRWjkV59RDt2h1sTT1W",
  },
  {
    key: "hosting",
    price: 15,
    icon: "🚀",
    from: false,
    oneTime: true,
    stripeBuyButtonId: "buy_btn_1SrMnlRWjkV59RDtVMr6himC",
  },
  {
    key: "removeBranding",
    price: 7,
    icon: "✨",
    from: false,
    stripeBuyButtonId: "buy_btn_1SrMdiRWjkV59RDtJSg3LKLh",
  },
]

export default function HomePage() {
  const [selectedLang, setSelectedLang] = useState<"en" | "it" | null>(null)
  const [showLanguageSelector, setShowLanguageSelector] = useState(true)
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [language, setLanguage] = useState<"en" | "it" | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const savedLang = localStorage.getItem("danidema-language") as Language | null
    const savedCart = localStorage.getItem("danidema-cart")

    if (savedLang) {
      setLanguage(savedLang)
      setSelectedLang(savedLang)
      setShowLanguageSelector(false)
    }
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    localStorage.setItem("danidema-cart", JSON.stringify(cart))
  }, [cart])

  const addToCart = (serviceKey: string, price: number) => {
    const existing = cart.find((item) => item.key === serviceKey)
    if (existing) {
      setCart(cart.map((item) => (item.key === serviceKey ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      setCart([...cart, { key: serviceKey, price, quantity: 1 }])
    }
    setShowCart(true)
  }

  const removeFromCart = (serviceKey: string) => {
    setCart((prev) => prev.filter((item) => item.key !== serviceKey))
  }

  const updateQuantity = (serviceKey: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.key === serviceKey) {
            const newQty = item.quantity + delta
            return newQty > 0 ? { ...item, quantity: newQty } : item
          }
          return item
        })
        .filter((item) => item.quantity > 0)
    })
  }

  const clearAllOrders = () => {
    setCart([])
    localStorage.removeItem("danidema-cart")
  }

  const clearAllData = () => {
    localStorage.removeItem("danidema-language")
    localStorage.removeItem("danidema-cart")
    setLanguage(null)
    setSelectedLang("en")
    setShowLanguageSelector(true)
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const t = language ? translations[language] : translations.en

  if (showLanguageSelector) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <div
          className={`w-full max-w-md transition-all duration-1000 ${isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
        >
          {/* Logo/Icon */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center shadow-2xl">
              <Globe className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-light text-white tracking-tight">DaniDema</h1>
          </div>

          {/* Language Selection - Apple Style */}
          <div className="mb-8">
            <p className="text-zinc-500 text-center text-sm mb-6 font-light">
              {translations[selectedLang || "en"].selectLanguage}
            </p>

            <div className="bg-zinc-900/50 rounded-2xl overflow-hidden border border-zinc-800">
              {languages.map((lang, index) => (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLang(lang.code)}
                  className={`w-full flex items-center justify-between px-5 py-4 transition-all duration-200 ${
                    index !== languages.length - 1 ? "border-b border-zinc-800" : ""
                  } ${selectedLang === lang.code ? "bg-zinc-800/50" : "hover:bg-zinc-800/30"}`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{lang.flag}</span>
                    <div className="text-left">
                      <p className="text-white font-medium">{lang.nativeName}</p>
                      <p className="text-zinc-500 text-sm">{lang.name}</p>
                    </div>
                  </div>
                  {selectedLang === lang.code && <Check className="w-5 h-5 text-blue-500" />}
                </button>
              ))}
            </div>
          </div>

          {/* Continue Button - Apple Style */}
          <button
            onClick={() => {
              if (selectedLang) {
                setLanguage(selectedLang)
                localStorage.setItem("danidema-language", selectedLang)
                setShowLanguageSelector(false)
              }
            }}
            disabled={!selectedLang}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-4 px-6 rounded-xl transition-all duration-300 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {translations[selectedLang || "en"].continue}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Cart Button - Fixed */}
      <button
        onClick={() => setShowCart(true)}
        className="fixed top-6 right-6 z-50 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-full p-3 transition-all duration-300 shadow-lg"
      >
        <ShoppingCart className="w-6 h-6" />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
            {cartCount}
          </span>
        )}
      </button>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowCart(false)} />
          <div className="relative w-full max-w-md bg-zinc-900 border-l border-zinc-800 h-full overflow-y-auto animate-slide-in">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold">{t.cart}</h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {cart.length === 0 ? (
                <p className="text-zinc-500 text-center py-12">{t.emptyCart}</p>
              ) : (
                <>
                  <div className="space-y-4 mb-8">
                    {cart.map((item) => {
                      const service = services.find((s) => s.key === item.key)
                      return (
                        <div key={item.key} className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{service?.icon}</span>
                              <div>
                                <p className="font-medium">{t[item.key as keyof typeof t]}</p>
                                <p className="text-zinc-500 text-sm">${item.price.toFixed(2)}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.key)}
                              className="text-zinc-500 hover:text-red-400 transition-colors"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(item.key, -1)}
                                className="w-8 h-8 bg-zinc-700 hover:bg-zinc-600 rounded-lg flex items-center justify-center transition-colors"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-8 text-center font-medium">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.key, 1)}
                                className="w-8 h-8 bg-zinc-700 hover:bg-zinc-600 rounded-lg flex items-center justify-center transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="border-t border-zinc-700 pt-6">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-lg">{t.total}</span>
                      <span className="text-2xl font-bold">${cartTotal.toFixed(2)}</span>
                    </div>
                    <button
                      onClick={() => {
                        const cartData = encodeURIComponent(JSON.stringify(cart))
                        router.push(`/order?cart=${cartData}`)
                      }}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300"
                    >
                      {t.checkout}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div
            className={`transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            {/* Profile Image */}
            <div className="mb-8 relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-2xl" />
              <img
                src="/cat2.jpg"
                alt="DaniDema"
                className="relative w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-2 border-zinc-700 shadow-2xl"
              />
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              {t.heroTitle}
            </h1>
            <p className="text-xl md:text-2xl text-zinc-400 mb-4 font-medium">{t.heroSubtitle}</p>
            <p className="text-lg text-zinc-500 mb-8 max-w-2xl mx-auto">{t.heroDescription}</p>

            {/* Skills */}
            <div className="flex justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-full border border-zinc-800">
                <Code className="w-5 h-5 text-yellow-500" />
                <span className="font-medium">Python</span>
              </div>
              <div className="flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-full border border-zinc-800">
                <Code className="w-5 h-5 text-green-500" />
                <span className="font-medium">Node.js</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#services"
                className="group inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300"
              >
                <Sparkles className="w-5 h-5" />
                {t.viewServices}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <button
                onClick={() => router.push("/profile")}
                className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300"
              >
                {t.viewProfile}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">{t.servicesTitle}</h2>
          <p className="text-center text-zinc-500 mb-12">
            {t.paypal} • {t.installments}
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div
                key={service.key}
                className="group bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800 hover:border-zinc-700 transition-all duration-500 hover:transform hover:scale-[1.02]"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold mb-2">{t[service.key as keyof typeof t]}</h3>
                <p className="text-zinc-500 mb-4 text-sm">{t[`${service.key}Desc` as keyof typeof t]}</p>
                <div className="mb-4">
                  <span className="text-zinc-500 text-sm">{service.from ? t.from : ""}</span>
                  <span className="text-2xl font-bold text-blue-400 ml-1">${service.price}</span>
                  {service.oneTime && <span className="text-xs text-zinc-500 ml-2">({t.oneTime})</span>}
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => addToCart(service.key, service.price)}
                    className="w-full px-4 py-2 bg-blue-500/20 hover:bg-blue-500/40 border border-blue-500/30 rounded-lg text-blue-400 font-medium transition-all duration-300 text-sm flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    {t.addToCart}
                  </button>
                  <div className="stripe-buy-button-container">
                    <stripe-buy-button
                      buy-button-id={service.stripeBuyButtonId}
                      publishable-key="pk_live_51SrLxnRWjkV59RDtBaObW0jb9DdZhb414JJkOPQOG92nB97xhJazBtMXhwZj5L6eAWFeNPEw8QhQLZeqV1ZZW7t200BV4dC842"
                    ></stripe-buy-button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{t.contactTitle}</h2>
          <p className="text-zinc-500 mb-12">{t.contactDesc}</p>

          <div className="grid md:grid-cols-3 gap-6">
            <a
              href="https://discord.com/users/dani.dema"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800 hover:border-[#5865F2]/50 transition-all duration-300 hover:transform hover:scale-105"
            >
              <img
                src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/discord.svg"
                alt="Discord"
                className="w-12 h-12 mx-auto mb-4 filter invert opacity-70 group-hover:opacity-100 transition-opacity"
              />
              <h3 className="font-bold text-lg">{t.discord}</h3>
              <p className="text-zinc-500 text-sm">dani.dema</p>
            </a>

            <a
              href="mailto:support@danidema.xyz"
              className="group bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800 hover:border-red-500/50 transition-all duration-300 hover:transform hover:scale-105"
            >
              <img
                src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/gmail.svg"
                alt="Email"
                className="w-12 h-12 mx-auto mb-4 filter invert opacity-70 group-hover:opacity-100 transition-opacity"
              />
              <h3 className="font-bold text-lg">{t.email}</h3>
              <p className="text-zinc-500 text-sm">support@danidema.xyz</p>
            </a>

            <a
              href="https://discord.gg/BTWsXaUme3"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105"
            >
              <img
                src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/discord.svg"
                alt="Community"
                className="w-12 h-12 mx-auto mb-4 filter invert opacity-70 group-hover:opacity-100 transition-opacity"
              />
              <h3 className="font-bold text-lg">{t.community}</h3>
              <p className="text-zinc-500 text-sm">discord.gg/BTWsXaUme3</p>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-8 px-4 border-t border-zinc-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center gap-6 mb-6">
            <iframe
              width="380"
              height="82"
              style={{ border: 0 }}
              src="https://climate.stripe.com/badge/6jbMva?theme=dark&size=large&locale=it-IT"
              title="Stripe Climate Badge"
            ></iframe>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-zinc-500">
              <span>{t.footerText}</span>
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            </div>
            <div className="flex gap-6 text-sm text-zinc-500">
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
        </div>
      </footer>

      {/* Settings Button (Fixed Bottom Right) */}
      <button
        onClick={() => setShowSettings(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-blue-500 hover:bg-blue-600 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
      >
        <Settings className="w-6 h-6" />
      </button>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Settings</h2>
              <button onClick={() => setShowSettings(false)} className="text-zinc-500 hover:text-white">
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <button
                onClick={clearAllOrders}
                className="w-full p-4 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 font-medium transition-all flex items-center justify-between"
              >
                <span>Clear All My Orders</span>
                <Trash2 className="w-5 h-5" />
              </button>

              <button
                onClick={clearAllData}
                className="w-full p-4 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 rounded-lg text-orange-400 font-medium transition-all flex items-center justify-between"
              >
                <span>Delete All My Data</span>
                <Trash2 className="w-5 h-5" />
              </button>

              <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
                <label className="text-sm text-zinc-400 mb-2 block">Change Language</label>
                <select
                  value={selectedLang}
                  onChange={(e) => {
                    setSelectedLang(e.target.value as Language)
                    setShowLanguageSelector(true)
                    setShowSettings(false)
                  }}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white"
                >
                  <option value="en">English</option>
                  <option value="it">Italiano</option>
                  <option value="de">Deutsch</option>
                  <option value="fr">Français</option>
                  <option value="es">Español</option>
                  <option value="pt">Português</option>
                  <option value="nl">Nederlands</option>
                  <option value="pl">Polski</option>
                  <option value="ru">Русский</option>
                  <option value="ja">日本語</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

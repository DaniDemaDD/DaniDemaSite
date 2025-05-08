import type React from "react"
import Script from "next/script"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import { AuthProvider } from "@/components/auth/auth-context"
import { Toaster } from "@/components/ui/toaster"
import { FloatingSettingsButton } from "@/components/floating-settings-button"
import { CookieConsent } from "@/components/cookie-consent"
import { BrowserDetector } from "@/components/browser-detector"
import { InteractiveTutorial } from "@/components/interactive-tutorial"
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "DaniDema | Assistente AI, Bot Discord, Soluzioni Software su Misura",
  description:
    "Scopri DaniDema: assistente AI personale, bot AI per Discord e WhatsApp, soluzioni software personalizzate per aziende e sviluppatori.",
  keywords: [
    "social danidema",
    "discord danidema",
    "CMDProtector",
    "DaniDema",
    "THE-LAST-DS",
    "thelastds",
    "discord mod",
    "AI danidema",
  ],
  verification: {
    google: "lw5tZQFV25NKeJTqWDTp0F8g-lS3pph3fUNYtEMlkWI",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Microsoft Clarity Script */}
        <Script id="clarity-script" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i+"?ref=bwt";
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "rd93c6mf8j");
          `}
        </Script>

        {/* Google Analytics Script */}
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtag/js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','G-DY7J70X205');
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-DY7J70X205');
            `,
          }}
        />

        {/* Framer Motion Script */}
        <Script
          id="framer-motion"
          src="https://unpkg.com/framer-motion@10.16.4/dist/framer-motion.js"
          strategy="afterInteractive"
        />

        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            {/* Browser detector */}
            <BrowserDetector />

            <Navbar />
            <div className="pt-16">{children}</div>
            <FloatingSettingsButton />
            <Toaster />
            <CookieConsent />

            {/* Interactive tutorial */}
            <InteractiveTutorial />

            {/* Vercel Speed Insights */}
            <SpeedInsights />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

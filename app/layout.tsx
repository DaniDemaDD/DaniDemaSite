import type React from "react"
import Script from "next/script"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import { AuthProvider } from "@/components/auth/auth-context"
import { Toaster } from "@/components/ui/toaster"
import { FloatingSettingsButton } from "@/components/floating-settings-button"

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

        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <Navbar />
            <div className="pt-16">{children}</div>
            <FloatingSettingsButton />
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

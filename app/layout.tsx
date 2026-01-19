import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import Script from "next/script"
import { MaintenanceCheck } from "@/components/maintenance-check"

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "DaniDema",
  description: "Developer • Creator • Made with love",
  keywords: ["DaniDema", "developer", "creator", "tech", "programming", "discord bots", "websites"],
  authors: [{ name: "DaniDema" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#000000",
  openGraph: {
    title: "DaniDema",
    description: "Developer • Creator • Made with love",
    type: "website",
    locale: "en_US",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        {/* Cloudflare Turnstile */}
        <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
        {/* Stripe Buy Button */}
        <script async src="https://js.stripe.com/v3/buy-button.js"></script>
      </head>
      <body className="antialiased">
        <MaintenanceCheck>{children}</MaintenanceCheck>

        {/* Tawk.to Chat Widget */}
        <Script id="tawk-to" strategy="afterInteractive">
          {`
            var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
            (function(){
              var s1=document.createElement("script"),
                  s0=document.getElementsByTagName("script")[0];
              s1.async=true;
              s1.src='https://embed.tawk.to/6951b7c45823b7197c1548ec/default';
              s1.charset='UTF-8';
              s1.setAttribute('crossorigin','*');
              s0.parentNode.insertBefore(s1,s0);
            })();
          `}
        </Script>
      </body>
    </html>
  )
}

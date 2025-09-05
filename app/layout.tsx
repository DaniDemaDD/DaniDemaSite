import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { MaintenanceCheck } from "@/components/maintenance-check"

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"], // Rimosso '900' che non è disponibile
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "DANIDEMA",
  description: "Developer • Creator • :)",
  keywords: ["DaniDema", "developer", "creator", "tech", "programming"],
  authors: [{ name: "DaniDema" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#000000",
  openGraph: {
    title: "DANIDEMA",
    description: "Developer • Creator • :)",
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
      <body className="antialiased">
        <MaintenanceCheck>{children}</MaintenanceCheck>
      </body>
    </html>
  )
}

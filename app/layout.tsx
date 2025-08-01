import type React from "react"
import type { Metadata } from "next"
import { Orbitron, Rajdhani } from "next/font/google" // Import fonts from next/font/google
import "./globals.css"

// Configure Orbitron font
const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["700"], // Only import the weight used
  variable: "--font-orbitron", // Define CSS variable for Orbitron
  display: "swap",
})

// Configure Rajdhani font
const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "600"], // Only import the weights used
  variable: "--font-rajdhani", // Define CSS variable for Rajdhani
  display: "swap",
})

export const metadata: Metadata = {
  title: "Sito in Manutenzione",
  description: "Il sito è attualmente in fase di manutenzione.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="it" className={`${orbitron.variable} ${rajdhani.variable}`}>
      <body className="font-rajdhani">{children}</body>
    </html>
  )
}

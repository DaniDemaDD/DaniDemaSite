import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import { AuthProvider } from "@/components/auth/auth-context"
import { Toaster } from "@/components/ui/toaster"
import { FloatingSettingsButton } from "@/components/floating-settings-button"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "DaniDema",
  description: "Explore DaniDema's AI assistant, products, software solutions, and connect on social media.",
  verification: {
    google: "lw5tZQFV25NKeJTqWDTp0F8g-lS3pph3fUNYtEMlkWI"
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

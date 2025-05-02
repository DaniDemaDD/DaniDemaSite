"use client"

import { Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuth } from "@/components/auth/auth-context"
import { usePathname } from "next/navigation"

export function FloatingSettingsButton() {
  const { user } = useAuth()
  const pathname = usePathname()

  // Don't show on settings or auth pages
  if (!user || pathname.startsWith("/settings") || pathname.startsWith("/auth")) {
    return null
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button asChild size="icon" className="h-12 w-12 rounded-full shadow-lg">
        <Link href="/settings">
          <Settings className="h-6 w-6" />
          <span className="sr-only">Settings</span>
        </Link>
      </Button>
    </div>
  )
}

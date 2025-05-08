"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export function BrowserDetector() {
  const router = useRouter()

  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window !== "undefined") {
      // Detect Windows version
      const isObsoleteWindows = detectObsoleteWindows()

      // Detect browser version
      const browserInfo = detectObsoleteBrowser()

      // If either is obsolete, redirect to warning page
      if (isObsoleteWindows || browserInfo.isObsolete) {
        const queryParams = new URLSearchParams()

        if (isObsoleteWindows) {
          queryParams.append("os", "windows")
        }

        if (browserInfo.isObsolete) {
          queryParams.append("browser", browserInfo.name)
        }

        router.push(`/obsolete?${queryParams.toString()}`)
      }
    }
  }, [router])

  return null
}

function detectObsoleteWindows(): boolean {
  const userAgent = window.navigator.userAgent

  // Check for Windows versions 8 or lower
  if (userAgent.indexOf("Windows NT 6.2") !== -1) return true // Windows 8
  if (userAgent.indexOf("Windows NT 6.1") !== -1) return true // Windows 7
  if (userAgent.indexOf("Windows NT 6.0") !== -1) return true // Windows Vista
  if (userAgent.indexOf("Windows NT 5.1") !== -1) return true // Windows XP
  if (userAgent.indexOf("Windows NT 5.0") !== -1) return true // Windows 2000

  return false
}

function detectObsoleteBrowser(): { isObsolete: boolean; name: string } {
  const userAgent = window.navigator.userAgent
  let isObsolete = false
  let name = ""

  // Chrome
  if (userAgent.indexOf("Chrome") !== -1) {
    const chromeVersion = Number.parseInt(userAgent.match(/Chrome\/(\d+)/)?.[1] || "0")
    if (chromeVersion < 90) {
      isObsolete = true
      name = "Chrome"
    }
  }
  // Firefox
  else if (userAgent.indexOf("Firefox") !== -1) {
    const firefoxVersion = Number.parseInt(userAgent.match(/Firefox\/(\d+)/)?.[1] || "0")
    if (firefoxVersion < 85) {
      isObsolete = true
      name = "Firefox"
    }
  }
  // Safari
  else if (userAgent.indexOf("Safari") !== -1 && userAgent.indexOf("Chrome") === -1) {
    const safariVersion = Number.parseInt(userAgent.match(/Version\/(\d+)/)?.[1] || "0")
    if (safariVersion < 14) {
      isObsolete = true
      name = "Safari"
    }
  }
  // Edge (Chromium-based)
  else if (userAgent.indexOf("Edg") !== -1) {
    const edgeVersion = Number.parseInt(userAgent.match(/Edg\/(\d+)/)?.[1] || "0")
    if (edgeVersion < 90) {
      isObsolete = true
      name = "Edge"
    }
  }
  // Internet Explorer
  else if (userAgent.indexOf("MSIE") !== -1 || userAgent.indexOf("Trident/") !== -1) {
    isObsolete = true
    name = "Internet Explorer"
  }

  return { isObsolete, name }
}

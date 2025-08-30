"use client"

import { useEffect, useState } from "react"

declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void
      execute: (siteKey: string, options: { action: string }) => Promise<string>
    }
  }
}

export function SecurityCheck() {
  const [isVerified, setIsVerified] = useState(false)

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return

    // Load reCAPTCHA v3 for general site protection
    const script = document.createElement("script")
    script.src = "https://www.google.com/recaptcha/api.js?render=6LeXmbgrAAAAAAf7iAEJJ1igfrlfGkmab1KUeZx_"
    script.async = true

    script.onload = () => {
      if (window.grecaptcha) {
        // Execute reCAPTCHA v3 for general site access
        window.grecaptcha.ready(() => {
          if (window.grecaptcha) {
            window.grecaptcha
              .execute("6LeXmbgrAAAAAAf7iAEJJ1igfrlfGkmab1KUeZx_", { action: "site_access" })
              .then((token: string) => {
                if (token) {
                  setIsVerified(true)
                  console.log("Site access verified with reCAPTCHA v3")
                }
              })
              .catch((error: any) => {
                console.error("reCAPTCHA verification failed:", error)
              })
          }
        })
      }
    }

    script.onerror = () => {
      console.error("Failed to load reCAPTCHA script")
    }

    document.head.appendChild(script)

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  return null // This component doesn't render anything visible
}

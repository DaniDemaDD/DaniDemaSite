"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem("cookie-consent")
    if (!cookieConsent) {
      // Show the consent popup after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "accepted")
    setIsVisible(false)
    // Here you would initialize your analytics, etc.
  }

  const rejectCookies = () => {
    localStorage.setItem("cookie-consent", "rejected")
    // Redirect to a different site or show a message
    window.location.href = "https://www.google.com"
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md">
      <Card className="border-2 border-purple-500 shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Accept the cookies 🍪?</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsVisible(false)}>
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <CardDescription>
            We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our
            traffic.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm pb-2">
          <p>
            By clicking "Accept All", you consent to our use of cookies and other tracking technologies. You can read
            more about our cookie policy in our Privacy Policy.
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={rejectCookies}>
            Rifiuta
          </Button>
          <Button onClick={acceptCookies}>Accept All</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

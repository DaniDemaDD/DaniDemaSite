"use client"

import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

export default function ObsoletePage() {
  const searchParams = useSearchParams()
  const browser = searchParams.get("browser")
  const os = searchParams.get("os")

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4 text-amber-500">
            <AlertTriangle size={64} />
          </div>
          <CardTitle className="text-2xl text-center">Compatibility Warning</CardTitle>
          <CardDescription className="text-center">We've detected you're using outdated software</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-md text-amber-800">
            <p className="text-center font-medium mb-2">⚠️ Warning</p>
            {browser && <p className="text-center mb-2">Your version of {browser} is obsolete.</p>}
            {os && <p className="text-center mb-2">Your version of Windows is obsolete (Windows 8 or lower).</p>}
            <p className="text-center">
              For security and compatibility reasons, please update your {browser ? "browser" : ""}
              {browser && os ? " and " : ""}
              {os ? "operating system" : ""}.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Why is this important?</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Security vulnerabilities in outdated software</li>
              <li>Modern web features may not work correctly</li>
              <li>Improved performance with newer versions</li>
              <li>Better compatibility with our services</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button className="w-full" onClick={() => window.history.back()}>
            Continue Anyway (Limited Experience)
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() =>
              (window.location.href = browser
                ? getBrowserUpdateLink(browser)
                : "https://www.microsoft.com/en-us/windows/get-windows-11")
            }
          >
            Get Update Information
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

function getBrowserUpdateLink(browser: string): string {
  switch (browser.toLowerCase()) {
    case "chrome":
      return "https://www.google.com/chrome/"
    case "firefox":
      return "https://www.mozilla.org/firefox/new/"
    case "safari":
      return "https://support.apple.com/downloads/safari"
    case "edge":
      return "https://www.microsoft.com/edge"
    case "internet explorer":
      return "https://www.microsoft.com/edge"
    default:
      return "https://browsehappy.com/"
  }
}

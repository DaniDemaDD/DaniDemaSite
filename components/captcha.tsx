"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RefreshCw } from "lucide-react"

interface CaptchaProps {
  onVerify: (verified: boolean) => void
}

export function Captcha({ onVerify }: CaptchaProps) {
  const [challenge, setChallenge] = useState<string>("")
  const [userAnswer, setUserAnswer] = useState<string>("")
  const [isVerified, setIsVerified] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [simpleCaptcha, setSimpleCaptcha] = useState(true)

  // Generate a simple math challenge
  const generateMathChallenge = () => {
    const num1 = Math.floor(Math.random() * 10) + 1
    const num2 = Math.floor(Math.random() * 10) + 1
    setChallenge(`${num1} + ${num2}`)
    return (num1 + num2).toString()
  }

  // Generate an image-based challenge (simplified for demo)
  const generateImageChallenge = () => {
    // In a real implementation, this would generate an image with text
    // For this demo, we'll just use a different math problem
    const num1 = Math.floor(Math.random() * 10) + 1
    const num2 = Math.floor(Math.random() * 10) + 1
    setChallenge(`${num1} × ${num2}`)
    return (num1 * num2).toString()
  }

  const [expectedAnswer, setExpectedAnswer] = useState<string>("")

  useEffect(() => {
    refreshCaptcha()
  }, [])

  const refreshCaptcha = () => {
    setUserAnswer("")
    setIsVerified(false)

    if (simpleCaptcha) {
      setExpectedAnswer(generateMathChallenge())
    } else {
      setExpectedAnswer(generateImageChallenge())
    }
  }

  const handleVerify = () => {
    setIsLoading(true)

    // Simulate network request
    setTimeout(() => {
      const verified = userAnswer === expectedAnswer
      setIsVerified(verified)
      onVerify(verified)
      setIsLoading(false)
    }, 500)
  }

  const handleSimpleVerify = (checked: boolean) => {
    setIsLoading(true)

    // Simulate network request for the "I'm not a robot" checkbox
    setTimeout(() => {
      setIsVerified(checked)
      onVerify(checked)
      setIsLoading(false)
    }, 500)
  }

  return (
    <Card className="border border-gray-200">
      <CardContent className="pt-4">
        {simpleCaptcha ? (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="captcha-checkbox"
              checked={isVerified}
              onCheckedChange={handleSimpleVerify}
              disabled={isLoading}
            />
            <Label
              htmlFor="captcha-checkbox"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I'm not a robot
            </Label>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="bg-gray-100 p-3 rounded-md font-mono text-lg">{challenge}</div>
              <Button variant="ghost" size="icon" onClick={refreshCaptcha} disabled={isLoading}>
                <RefreshCw className="h-4 w-4" />
                <span className="sr-only">Refresh CAPTCHA</span>
              </Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="captcha-answer">Enter the result</Label>
              <div className="flex space-x-2">
                <input
                  id="captcha-answer"
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Answer"
                  disabled={isLoading || isVerified}
                />
                <Button onClick={handleVerify} disabled={isLoading || isVerified || !userAnswer}>
                  {isLoading ? "Verifying..." : "Verify"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

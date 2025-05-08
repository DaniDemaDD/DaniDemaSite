"use client"

import { useState, useEffect } from "react"
import { X, ChevronRight, ChevronLeft, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

type TutorialStep = {
  title: string
  content: string
  target?: string // CSS selector for the element to highlight
  position?: "top" | "right" | "bottom" | "left"
}

const tutorialSteps: TutorialStep[] = [
  {
    title: "Welcome to DaniDema!",
    content:
      'This quick tutorial will guide you through the main features of our platform. Click "Next" to continue or "Skip" to exit the tutorial.',
  },
  {
    title: "Navigation",
    content: "Use the navigation bar at the top to access different sections of the site.",
    target: "nav",
    position: "bottom",
  },
  {
    title: "AI Assistant",
    content: "Our AI assistant can help answer your questions and provide support.",
    target: ".ai-section",
    position: "right",
  },
  {
    title: "Software Downloads",
    content: "Browse and download our software products from the Software section.",
    target: ".software-section",
    position: "left",
  },
  {
    title: "Support Tickets",
    content: "Need help? Create a support ticket and our team will assist you.",
    target: ".support-link",
    position: "bottom",
  },
  {
    title: "Settings",
    content: "Customize your experience using the settings button in the bottom right corner.",
    target: ".floating-settings-button",
    position: "top",
  },
  {
    title: "All Set!",
    content:
      "You're all set to explore DaniDema. If you need this tutorial again, you can find it in the settings menu.",
  },
]

export function InteractiveTutorial() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null)

  useEffect(() => {
    // Check if this is the user's first visit
    const hasSeenTutorial = localStorage.getItem("hasSeenTutorial")

    if (!hasSeenTutorial) {
      // Wait a bit before showing the tutorial to ensure the page has loaded
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const step = tutorialSteps[currentStep]

    // Clear previous highlight
    if (highlightedElement) {
      highlightedElement.classList.remove("tutorial-highlight")
    }

    // Add highlight to new element if target is specified
    if (step.target) {
      const element = document.querySelector(step.target) as HTMLElement
      if (element) {
        element.classList.add("tutorial-highlight")
        setHighlightedElement(element)

        // Scroll element into view if needed
        element.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }

    return () => {
      // Clean up highlight when component unmounts
      if (highlightedElement) {
        highlightedElement.classList.remove("tutorial-highlight")
      }
    }
  }, [currentStep, isVisible, highlightedElement])

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      completeTutorial()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    completeTutorial()
  }

  const completeTutorial = () => {
    // Clean up highlight
    if (highlightedElement) {
      highlightedElement.classList.remove("tutorial-highlight")
    }

    // Mark tutorial as seen
    localStorage.setItem("hasSeenTutorial", "true")

    // Hide tutorial
    setIsVisible(false)
  }

  if (!isVisible) return null

  const step = tutorialSteps[currentStep]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
      <Card className="w-full max-w-md mx-4 animate-scale">
        <CardHeader className="relative">
          <Button variant="ghost" size="icon" className="absolute right-2 top-2" onClick={handleSkip}>
            <X className="h-4 w-4" />
          </Button>
          <CardTitle>{step.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{step.content}</p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div>
            {currentStep > 0 && (
              <Button variant="outline" onClick={handlePrevious}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={handleSkip}>
              Skip
            </Button>
            <Button onClick={handleNext}>
              {currentStep < tutorialSteps.length - 1 ? (
                <>
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Finish
                  <Check className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

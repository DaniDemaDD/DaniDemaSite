"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Bot, Send, User, Mic, StopCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

type Message = {
  role: "user" | "assistant"
  content: string
}

export default function AISection() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm DaniDema's AI assistant. How can I help you today?",
    },
  ])
  const [isRecording, setIsRecording] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom of messages when new message is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsThinking(true)

    try {
      // Get AI response
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: input }),
      })

      if (response.ok) {
        const data = await response.json()
        setIsThinking(false)

        const aiMessage: Message = {
          role: "assistant",
          content: data.response,
        }
        setMessages((prev) => [...prev, aiMessage])
      } else {
        throw new Error("Failed to get AI response")
      }
    } catch (error) {
      console.error("Error getting AI response:", error)
      setIsThinking(false)

      // Fallback response
      const aiMessage: Message = {
        role: "assistant",
        content: "I'm sorry, I'm having trouble processing your request right now. Please try again later.",
      }
      setMessages((prev) => [...prev, aiMessage])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const toggleRecording = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false)
      // In a real app, this would process the audio and convert to text
      setInput("This is a simulated voice input from speech recognition.")
    } else {
      // Start recording
      setIsRecording(true)
      // In a real app, this would start the speech recognition API
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle>AI Assistant</CardTitle>
        <CardDescription>Chat with DaniDema's AI assistant to learn more about the work</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 h-[400px] overflow-y-auto p-4 rounded-lg bg-secondary">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                message.role === "assistant" ? "text-foreground" : "flex-row-reverse"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.role === "assistant" ? "bg-purple-100 dark:bg-purple-900" : "bg-indigo-100 dark:bg-indigo-900"
                }`}
              >
                {message.role === "assistant" ? (
                  <Bot className="w-5 h-5 text-purple-700 dark:text-purple-300" />
                ) : (
                  <User className="w-5 h-5 text-indigo-700 dark:text-indigo-300" />
                )}
              </div>
              <div
                className={`rounded-lg px-4 py-2 max-w-[80%] ${
                  message.role === "assistant"
                    ? "bg-background border border-border"
                    : "bg-indigo-600 dark:bg-indigo-700 text-white"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isThinking && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-purple-100 dark:bg-purple-900">
                <Bot className="w-5 h-5 text-purple-700 dark:text-purple-300" />
              </div>
              <div className="rounded-lg px-4 py-2 bg-background border border-border">
                <div className="flex space-x-2">
                  <div
                    className="w-2 h-2 rounded-full bg-purple-500 animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-purple-500 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-purple-500 animate-bounce"
                    style={{ animationDelay: "600ms" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleRecording}
            className={isRecording ? "text-red-500 border-red-500 animate-pulse" : ""}
          >
            {isRecording ? <StopCircle className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            <span className="sr-only">{isRecording ? "Stop recording" : "Start recording"}</span>
          </Button>
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
            disabled={isRecording || isThinking}
          />
          <Button onClick={handleSend} type="submit" size="icon" disabled={!input.trim() || isThinking}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

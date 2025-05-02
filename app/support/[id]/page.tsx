"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

type SupportRequest = {
  id: string
  subject: string
  message: string
  status: "open" | "in-progress" | "resolved"
  createdAt: string
  responses: {
    id: string
    adminId: string
    message: string
    createdAt: string
  }[]
}

export default function SupportRequestPage({ params }: { params: { id: string } }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [request, setRequest] = useState<SupportRequest | null>(null)
  const [isLoadingRequest, setIsLoadingRequest] = useState(true)
  const [reply, setReply] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/signin")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    const fetchRequest = async () => {
      if (user) {
        // Skip fetching if we're on the "new" page
        if (params.id === "new") {
          setIsLoadingRequest(false)
          return
        }

        try {
          const response = await fetch(`/api/support/${params.id}`)
          if (response.ok) {
            const data = await response.json()
            setRequest(data)
          } else {
            toast({
              title: "Error",
              description: "Failed to load support request. It may not exist or you don't have permission to view it.",
              variant: "destructive",
            })
            router.push("/profile")
          }
        } catch (error) {
          console.error("Error fetching support request:", error)
          toast({
            title: "Error",
            description: "An unexpected error occurred. Please try again.",
            variant: "destructive",
          })
        } finally {
          setIsLoadingRequest(false)
        }
      }
    }

    if (user) {
      fetchRequest()
    }
  }, [user, params.id, router, toast])

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reply.trim()) return

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/support/${params.id}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: reply }),
      })

      if (response.ok) {
        toast({
          title: "Reply sent",
          description: "Your reply has been sent successfully.",
        })
        setReply("")

        // Update the request with the new reply
        const updatedRequest = await response.json()
        setRequest(updatedRequest)
      } else {
        toast({
          title: "Error",
          description: "Failed to send reply. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error sending reply:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  if (isLoading || isLoadingRequest) {
    return <div className="container py-10 text-center">Loading...</div>
  }

  if (!user || !request) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container py-10">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{request.subject}</CardTitle>
                <CardDescription>Support Request #{request.id}</CardDescription>
              </div>
              <Badge
                variant="outline"
                className={
                  request.status === "open"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    : request.status === "in-progress"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                }
              >
                {request.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Original Request</h3>
              <div className="p-4 bg-secondary rounded-lg">
                <div className="flex justify-between items-start">
                  <p>{request.message}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-4">Submitted on {formatDate(request.createdAt)}</p>
              </div>
            </div>

            {request.responses.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Responses</h3>
                {request.responses.map((response) => (
                  <div key={response.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <p>{response.message}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-4">
                      Response from Admin on {formatDate(response.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {request.status !== "resolved" && (
              <form onSubmit={handleReplySubmit} className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Add Reply</h3>
                  <Textarea
                    placeholder="Type your reply here..."
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    className="min-h-[100px]"
                    required
                  />
                </div>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Reply"}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => router.push("/profile")}>
              Back to Profile
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

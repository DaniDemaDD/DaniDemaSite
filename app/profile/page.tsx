"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Settings, Download, MessageSquare } from "lucide-react"
import { useAuth } from "@/components/auth/auth-context"
import { Badge } from "@/components/ui/badge"

type Software = {
  id: string
  name: string
  description: string
  image: string
  tags: string[]
  demoUrl: string
  downloadUrl: string
  githubUrl: string
}

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

export default function ProfilePage() {
  const { user, isLoading, isAdmin } = useAuth()
  const router = useRouter()
  const [downloadedSoftware, setDownloadedSoftware] = useState<Software[]>([])
  const [supportRequests, setSupportRequests] = useState<SupportRequest[]>([])
  const [isLoadingSoftware, setIsLoadingSoftware] = useState(true)
  const [isLoadingSupport, setIsLoadingSupport] = useState(true)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/signin")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          // Fetch downloaded software
          const softwareResponse = await fetch("/api/software/downloaded")
          if (softwareResponse.ok) {
            const softwareData = await softwareResponse.json()
            setDownloadedSoftware(softwareData)
          }
          setIsLoadingSoftware(false)

          // Fetch support requests
          const supportResponse = await fetch("/api/support")
          if (supportResponse.ok) {
            const supportData = await supportResponse.json()
            setSupportRequests(supportData)
          }
          setIsLoadingSupport(false)
        } catch (error) {
          console.error("Error fetching profile data:", error)
          setIsLoadingSoftware(false)
          setIsLoadingSupport(false)
        }
      }
    }

    if (user) {
      fetchData()
    }
  }, [user])

  if (isLoading) {
    return <div className="container py-10 text-center">Loading...</div>
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  // Get initials for avatar fallback
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <div className="flex gap-2">
            {isAdmin && (
              <Button asChild variant="outline">
                <Link href="/admin">
                  <Badge className="mr-2">Admin</Badge>
                  Dashboard
                </Link>
              </Button>
            )}
            <Button asChild>
              <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </Button>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatar || "/default-avatar.png"} alt={user.name} />
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
              {user.role === "admin" && (
                <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 mt-1">
                  Administrator
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">About</h3>
                <p className="text-muted-foreground mt-1">
                  {user.bio || "No bio provided. You can add one in your settings."}
                </p>
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-4">Account Information</h3>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Name</dt>
                    <dd className="mt-1">{user.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                    <dd className="mt-1">{user.email}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Language</dt>
                    <dd className="mt-1">{user.language || "English"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Member since</dt>
                    <dd className="mt-1">{user.registeredAt ? formatDate(user.registeredAt) : "Unknown"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Last login</dt>
                    <dd className="mt-1">{user.lastLogin ? formatDate(user.lastLogin) : "Unknown"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Account type</dt>
                    <dd className="mt-1 capitalize">{user.role}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mb-8">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>My Downloaded Software</CardTitle>
                  <CardDescription>Software you've downloaded and have access to</CardDescription>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href="/software">
                    <Download className="mr-2 h-4 w-4" />
                    Browse More
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingSoftware ? (
                <div className="text-center py-4">Loading your software...</div>
              ) : downloadedSoftware.length === 0 ? (
                <div className="text-center py-4">
                  <p className="mb-4">You haven't downloaded any software yet.</p>
                  <Button asChild>
                    <Link href="/software">Browse Software</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {downloadedSoftware.map((software) => (
                    <div
                      key={software.id}
                      className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg hover:bg-secondary/50 transition-colors"
                    >
                      <div className="w-full md:w-24 h-16 bg-muted rounded overflow-hidden flex-shrink-0">
                        <img
                          src={software.image || "/placeholder.svg"}
                          alt={software.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                          <h4 className="font-medium">{software.name}</h4>
                          <div className="flex flex-wrap gap-2">
                            {software.tags.map((tag) => (
                              <Badge key={tag} variant="secondary">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{software.description}</p>
                        <div className="flex gap-2 mt-2">
                          <Button asChild size="sm" variant="outline">
                            <a href={software.downloadUrl} target="_blank" rel="noopener noreferrer">
                              <Download className="mr-1 h-3 w-3" />
                              Download
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Support Requests</CardTitle>
                  <CardDescription>Your support tickets and their status</CardDescription>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href="/support/new">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    New Request
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingSupport ? (
                <div className="text-center py-4">Loading your support requests...</div>
              ) : supportRequests.length === 0 ? (
                <div className="text-center py-4">
                  <p className="mb-4">You haven't submitted any support requests yet.</p>
                  <Button asChild>
                    <Link href="/support/new">Submit a Request</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {supportRequests.map((request) => (
                    <div key={request.id} className="p-4 border rounded-lg hover:bg-secondary/50 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <h4 className="font-medium">{request.subject}</h4>
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
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{request.message}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-muted-foreground">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </span>
                        <Button asChild size="sm" variant="ghost">
                          <Link href={`/support/${request.id}`}>View Details</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

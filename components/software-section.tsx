"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, Github, Globe } from "lucide-react"
import { useAuth } from "@/components/auth/auth-context"

type Software = {
  id: string
  name: string
  description: string
  image: string
  tags: string[]
  demoUrl: string
  downloadUrl: string
  githubUrl: string
  createdAt: string
  updatedAt: string
  version: string
  downloads: number
}

export default function SoftwareSection() {
  const { user } = useAuth()
  const [downloadedSoftware, setDownloadedSoftware] = useState<Software[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDownloadedSoftware = async () => {
      try {
        if (user) {
          // In a real app, this would be an API call
          const response = await fetch("/api/software/downloaded")
          if (response.ok) {
            const data = await response.json()
            setDownloadedSoftware(data)
          }
        } else {
          // Show sample software for non-logged in users
          setDownloadedSoftware([])
        }
      } catch (error) {
        console.error("Error fetching downloaded software:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDownloadedSoftware()
  }, [user])

  const handleDownload = async (softwareId: string) => {
    try {
      const response = await fetch("/api/software/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ softwareId }),
      })

      if (response.ok) {
        // Add the software to the downloaded list
        const softwareResponse = await fetch(`/api/software/${softwareId}`)
        if (softwareResponse.ok) {
          const software = await softwareResponse.json()
          setDownloadedSoftware((prev) => [...prev, software as Software])
        }
      }
    } catch (error) {
      console.error("Error downloading software:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <p>Loading your software...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-medium mb-4">Sign in to see your downloaded software</h3>
        <p className="mb-4">Create an account or sign in to download and track your software.</p>
        <Button asChild>
          <a href="/auth/signin">Sign In</a>
        </Button>
      </div>
    )
  }

  if (downloadedSoftware.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-medium mb-4">You haven't downloaded any software yet</h3>
        <p className="mb-4">Browse our available software and download what interests you.</p>
        <Button asChild>
          <a href="/software">Browse Software</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {downloadedSoftware.map((software) => (
        <Card key={software.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="aspect-video w-full overflow-hidden bg-muted">
            <img
              src={software.image || "/placeholder.svg"}
              alt={software.name}
              className="w-full h-full object-cover transition-transform hover:scale-105"
            />
          </div>
          <CardHeader>
            <CardTitle>{software.name}</CardTitle>
            <div className="flex flex-wrap gap-2 mt-2">
              {software.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Version {software.version} • {software.downloads} downloads
            </div>
          </CardHeader>
          <CardContent>
            <p className="line-clamp-3">{software.description}</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm" asChild>
              <a href={software.demoUrl} target="_blank" rel="noopener noreferrer">
                <Globe className="mr-2 h-4 w-4" />
                Demo
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href={software.githubUrl} target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </a>
            </Button>
            <Button variant="default" size="sm" asChild>
              <a href={software.downloadUrl} target="_blank" rel="noopener noreferrer">
                <Download className="mr-2 h-4 w-4" />
                Download
              </a>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

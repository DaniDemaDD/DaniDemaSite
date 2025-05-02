"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, Github, Globe } from "lucide-react"
import { useAuth } from "@/components/auth/auth-context"
import { useToast } from "@/hooks/use-toast"

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

export default function SoftwarePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [downloadedIds, setDownloadedIds] = useState<string[]>([])
  const [software, setSoftware] = useState<Software[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all software
        const softwareResponse = await fetch("/api/admin/software")
        if (softwareResponse.ok) {
          const softwareData = await softwareResponse.json()
          setSoftware(softwareData)
        }

        // Fetch downloaded software IDs if user is logged in
        if (user) {
          const response = await fetch("/api/software/downloaded")
          if (response.ok) {
            const data = await response.json()
            setDownloadedIds(data.map((software: any) => software.id))
          }
        }
      } catch (error) {
        console.error("Error fetching software data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user])

  const handleDownload = async (softwareId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to download software",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/software/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ softwareId }),
      })

      if (response.ok) {
        setDownloadedIds((prev) => [...prev, softwareId])
        toast({
          title: "Download successful",
          description: "The software has been added to your downloads",
        })
      } else {
        toast({
          title: "Download failed",
          description: "There was an error downloading the software",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error downloading software:", error)
      toast({
        title: "Download failed",
        description: "There was an error downloading the software",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="container py-10 text-center">
        <p>Loading software...</p>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Available Software</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {software.map((sw) => {
            const isDownloaded = downloadedIds.includes(sw.id)
            return (
              <Card key={sw.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video w-full overflow-hidden bg-muted">
                  <img
                    src={sw.image || "/placeholder.svg"}
                    alt={sw.name}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{sw.name}</CardTitle>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {sw.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Version {sw.version} • {sw.downloads} downloads
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3">{sw.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm" asChild>
                    <a href={sw.demoUrl} target="_blank" rel="noopener noreferrer">
                      <Globe className="mr-2 h-4 w-4" />
                      Demo
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href={sw.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" />
                      GitHub
                    </a>
                  </Button>
                  <Button
                    variant={isDownloaded ? "secondary" : "default"}
                    size="sm"
                    onClick={() => !isDownloaded && handleDownload(sw.id)}
                    disabled={isDownloaded}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {isDownloaded ? "Downloaded" : "Download"}
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}

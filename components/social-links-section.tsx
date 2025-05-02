"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Github, Mail, Link } from "lucide-react"

type SocialLink = {
  id: string
  name: string
  url: string
  icon: string
  color: string
}

export default function SocialLinksSection() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const response = await fetch("/api/social")
        if (response.ok) {
          const data = await response.json()
          setSocialLinks(data)
        }
      } catch (error) {
        console.error("Error fetching social links:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSocialLinks()
  }, [])

  // Map icon names to Lucide components
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "Facebook":
        return Facebook
      case "Twitter":
        return Twitter
      case "Instagram":
        return Instagram
      case "Linkedin":
        return Linkedin
      case "Youtube":
        return Youtube
      case "Github":
        return Github
      case "Mail":
        return Mail
      default:
        return Link
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 animate-pulse">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="h-24 bg-muted rounded-lg"></div>
        ))}
      </div>
    )
  }

  if (socialLinks.length === 0) {
    return <div className="text-center py-4 text-muted-foreground">No social links available</div>
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
      {socialLinks.map((social) => {
        const Icon = getIconComponent(social.icon)
        return (
          <a
            key={social.id}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block transition-transform hover:scale-105"
          >
            <Card className="overflow-hidden h-full">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <div className={`${social.color} text-white p-3 rounded-full mb-3`}>
                  <Icon className="h-6 w-6" />
                </div>
                <span className="font-medium">{social.name}</span>
              </CardContent>
            </Card>
          </a>
        )
      })}
    </div>
  )
}

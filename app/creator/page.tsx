"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UserTable } from "@/components/user-table"
import { BackupManager } from "@/components/admin/backup-manager"
import { logActivity } from "@/lib/activity-logger"

type User = {
  id: string
  name: string
  email: string
  role: string
  ipAddress?: string
  lastLogin?: string
  registeredAt: string
  avatar?: string
  status?: string
  deleted?: boolean
}

type SupportRequest = {
  id: string
  userId: string
  subject: string
  message: string
  status: "open" | "in-progress" | "resolved" | "closed" | "redeemed"
  createdAt: string
  responses: {
    id: string
    adminId: string
    message: string
    createdAt: string
  }[]
}

type SocialLink = {
  id: string
  name: string
  url: string
  icon: string
  color: string
}

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

type AIResponse = {
  id: string
  keywords: string[]
  response: string
  createdAt: string
  updatedAt: string
}

type SiteSettings = {
  siteTitle: string
  siteDescription: string
}

type Permission =
  | "manage_users"
  | "manage_roles"
  | "manage_permissions"
  | "manage_software"
  | "manage_social"
  | "manage_ai"
  | "manage_site_settings"
  | "manage_support"

type Role = {
  name: string
  permissions: Permission[]
  canBeDeleted: boolean
  canChangePassword: boolean
  isActive: boolean
  color: string
}

export default function CreatorDashboard() {
  const { user, isLoading, isCreator } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [supportRequests, setSupportRequests] = useState<SupportRequest[]>([])
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
  const [software, setSoftware] = useState<Software[]>([])
  const [aiResponses, setAIResponses] = useState<AIResponse[]>([])
  const [selectedRequest, setSelectedRequest] = useState<SupportRequest | null>(null)
  const [responseMessage, setResponseMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    siteTitle: "DaniDema",
    siteDescription: "Explore DaniDema's AI assistant, software solutions, and connect on social media.",
  })

  // Social link state
  const [newSocialLink, setNewSocialLink] = useState({
    name: "",
    url: "",
    icon: "Link",
    color: "bg-blue-600 dark:bg-blue-700",
  })
  const [editingSocialLink, setEditingSocialLink] = useState<SocialLink | null>(null)

  // Software state
  const [newSoftware, setNewSoftware] = useState({
    name: "",
    description: "",
    image: "/placeholder.svg?height=200&width=300",
    tags: ["Web"],
    demoUrl: "#",
    downloadUrl: "#",
    githubUrl: "#",
    version: "1.0.0",
  })
  const [editingSoftware, setEditingSoftware] = useState<Software | null>(null)

  // AI response state
  const [newAIResponse, setNewAIResponse] = useState({
    keywords: [""],
    response: "",
  })
  const [editingAIResponse, setEditingAIResponse] = useState<AIResponse | null>(null)

  // Role management state
  const [roles, setRoles] = useState<Role[]>([])
  const [newRole, setNewRole] = useState({
    name: "",
    permissions: [] as Permission[],
    canBeDeleted: true,
    canChangePassword: true,
    isActive: true,
    color: "#6366f1", // Default indigo color
  })
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [assignRoleDialogOpen, setAssignRoleDialogOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)

  // Activity logs state
  const [activityLogs, setActivityLogs] = useState<any[]>([])
  const [isLoadingLogs, setIsLoadingLogs] = useState(false)

  // Available permissions for roles
  const availablePermissions: Permission[] = [
    "manage_users",
    "manage_roles",
    "manage_permissions",
    "manage_software",
    "manage_social",
    "manage_ai",
    "manage_site_settings",
    "manage_support",
  ]

  useEffect(() => {
    if (!isLoading && !isCreator) {
      router.push("/")
    }
  }, [isLoading, isCreator, router])

  useEffect(() => {
    const fetchData = async () => {
      if (isCreator) {
        try {
          // Fetch users
          const usersResponse = await fetch("/api/admin/users")
          if (usersResponse.ok) {
            const usersData = await usersResponse.json()
            setUsers(usersData)
          }

          // Fetch support requests
          const requestsResponse = await fetch("/api/admin/support")
          if (requestsResponse.ok) {
            const requestsData = await requestsResponse.json()
            setSupportRequests(requestsData)
          }

          // Fetch social links
          const socialResponse = await fetch("/api/admin/social")
          if (socialResponse.ok) {
            const socialData = await socialResponse.json()
            setSocialLinks(socialData)
          }

          // Fetch software
          const softwareResponse = await fetch("/api/admin/software")
          if (softwareResponse.ok) {
            const softwareData = await softwareResponse.json()
            setSoftware(softwareData)
          }

          // Fetch AI responses
          const aiResponse = await fetch("/api/admin/ai")
          if (aiResponse.ok) {
            const aiData = await aiResponse.json()
            setAIResponses(aiData)
          }

          // Fetch site settings
          const siteSettingsResponse = await fetch("/api/admin/site-settings")
          if (siteSettingsResponse.ok) {
            const siteSettingsData = await siteSettingsResponse.json()
            setSiteSettings(siteSettingsData)
          }

          // Fetch roles
          const rolesResponse = await fetch("/api/admin/roles")
          if (rolesResponse.ok) {
            const rolesData = await rolesResponse.json()
            setRoles(rolesData)
          }
        } catch (error) {
          console.error("Error fetching admin data:", error)
        }
      }
    }

    fetchData()
  }, [isCreator])

  const fetchActivityLogs = async () => {
    try {
      setIsLoadingLogs(true)
      // In a real app, this would fetch from an API endpoint
      // For now, we'll simulate some activity logs
      const mockLogs = [
        {
          id: "log_1",
          userId: "creator",
          username: "Creator",
          activityType: "login",
          details: { ipAddress: "192.168.1.1" },
          timestamp: new Date().toISOString(),
        },
        {
          id: "log_2",
          userId: "admin",
          username: "Admin",
          activityType: "site_settings_updated",
          details: { setting: "maintenanceMode", value: true },
          timestamp: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: "log_3",
          userId: "user1",
          username: "User 1",
          activityType: "password_reset",
          details: {},
          timestamp: new Date(Date.now() - 7200000).toISOString(),
        },
      ]
      setActivityLogs(mockLogs)
    } catch (error) {
      console.error("Error fetching activity logs:", error)
      toast({
        title: "Error",
        description: "Failed to fetch activity logs",
        variant: "destructive",
      })
    } finally {
      setIsLoadingLogs(false)
    }
  }

  useEffect(() => {
    if (isCreator) {
      fetchActivityLogs()
    }
  }, [isCreator])

  const handleResponseSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRequest || !responseMessage.trim()) return

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/admin/support/${selectedRequest.id}/respond`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: responseMessage }),
      })

      if (response.ok) {
        toast({
          title: "Response sent",
          description: "Your response has been sent to the user.",
        })

        // Update the local state
        setSupportRequests((prev) =>
          prev.map((req) => {
            if (req.id === selectedRequest.id) {
              return {
                ...req,
                status: "in-progress",
                responses: [
                  ...req.responses,
                  {
                    id: `temp-${Date.now()}`,
                    adminId: user?.id || "",
                    message: responseMessage,
                    createdAt: new Date().toISOString(),
                  },
                ],
              }
            }
            return req
          }),
        )

        // Log the activity
        await logActivity(user?.id || "", user?.name || "Creator", "support_request_responded", {
          requestId: selectedRequest.id,
          message: responseMessage,
        })

        setResponseMessage("")
      } else {
        toast({
          title: "Error",
          description: "Failed to send response. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error responding to support request:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Social link functions
  const handleAddSocialLink = async () => {
    try {
      const response = await fetch("/api/admin/social", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSocialLink),
      })

      if (response.ok) {
        const newLink = await response.json()
        setSocialLinks((prev) => [...prev, newLink])
        setNewSocialLink({
          name: "",
          url: "",
          icon: "Link",
          color: "bg-blue-600 dark:bg-blue-700",
        })

        // Log the activity
        await logActivity(user?.id || "", user?.name || "Creator", "social_link_added", {
          linkId: newLink.id,
          linkName: newLink.name,
        })

        toast({
          title: "Social link added",
          description: "The social link has been added successfully.",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to add social link. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error adding social link:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateSocialLink = async () => {
    if (!editingSocialLink) return

    try {
      const response = await fetch(`/api/admin/social/${editingSocialLink.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editingSocialLink.name,
          url: editingSocialLink.url,
          icon: editingSocialLink.icon,
          color: editingSocialLink.color,
        }),
      })

      if (response.ok) {
        const updatedLink = await response.json()
        setSocialLinks((prev) => prev.map((link) => (link.id === updatedLink.id ? updatedLink : link)))
        setEditingSocialLink(null)

        // Log the activity
        await logActivity(user?.id || "", user?.name || "Creator", "social_link_updated", {
          linkId: updatedLink.id,
          linkName: updatedLink.name,
        })

        toast({
          title: "Social link updated",
          description: "The social link has been updated successfully.",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to update social link. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating social link:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteSocialLink = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/social/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setSocialLinks((prev) => prev.filter((link) => link.id !== id))

        // Log the activity
        await logActivity(user?.id || "", user?.name || "Creator", "social_link_deleted", {
          linkId: id,
        })

        toast({
          title: "Social link deleted",
          description: "The social link has been deleted successfully.",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to delete social link. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting social link:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Software functions
  const handleAddSoftware = async () => {
    try {
      const response = await fetch("/api/admin/software", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSoftware),
      })

      if (response.ok) {
        const addedSoftware = await response.json()
        setSoftware((prev) => [...prev, addedSoftware])
        setNewSoftware({
          name: "",
          description: "",
          image: "/placeholder.svg?height=200&width=300",
          tags: ["Web"],
          demoUrl: "#",
          downloadUrl: "#",
          githubUrl: "#",
          version: "1.0.0",
        })

        // Log the activity
        await logActivity(user?.id || "", user?.name || "Creator", "software_added", {
          softwareId: addedSoftware.id,
          softwareName: addedSoftware.name,
        })

        toast({
          title: "Software added",
          description: "The software has been added successfully.",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to add software. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error adding software:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateSoftware = async () => {
    if (!editingSoftware) return

    try {
      const response = await fetch(`/api/admin/software/${editingSoftware.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editingSoftware.name,
          description: editingSoftware.description,
          image: editingSoftware.image,
          tags: editingSoftware.tags,
          demoUrl: editingSoftware.demoUrl,
          downloadUrl: editingSoftware.downloadUrl,
          githubUrl: editingSoftware.githubUrl,
          version: editingSoftware.version,
        }),
      })

      if (response.ok) {
        const updatedSoftware = await response.json()
        setSoftware((prev) => prev.map((s) => (s.id === updatedSoftware.id ? updatedSoftware : s)))
        setEditingSoftware(null)

        // Log the activity
        await logActivity(user?.id || "", user?.name || "Creator", "software_updated", {
          softwareId: updatedSoftware.id,
          softwareName: updatedSoftware.name,
        })

        toast({
          title: "Software updated",
          description: "The software has been updated successfully.",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to update software. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating software:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteSoftware = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/software/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setSoftware((prev) => prev.filter((s) => s.id !== id))

        // Log the activity
        await logActivity(user?.id || "", user?.name || "Creator", "software_deleted", {
          softwareId: id,
        })

        toast({
          title: "Software deleted",
          description: "The software has been deleted successfully.",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to delete software. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting software:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  // AI response functions
  const handleAddAIResponse = async () => {
    try {
      const response = await fetch("/api/admin/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          keywords: newAIResponse.keywords.filter((k) => k.trim() !== ""),
          response: newAIResponse.response,
        }),
      })

      if (response.ok) {
        const addedResponse = await response.json()
        setAIResponses((prev) => [...prev, addedResponse])
        setNewAIResponse({
          keywords: [""],
          response: "",
        })

        // Log the activity
        await logActivity(user?.id || "", user?.name || "Creator", "ai_response_added", {
          responseId: addedResponse.id,
          keywords: addedResponse.keywords,
        })

        toast({
          title: "AI response added",
          description: "The AI response has been added successfully.",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to add AI response. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error adding AI response:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateAIResponse = async () => {
    if (!editingAIResponse) return

    try {
      const response = await fetch(`/api/admin/ai/${editingAIResponse.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          keywords: editingAIResponse.keywords.filter((k) => k.trim() !== ""),
          response: editingAIResponse.response,
        }),
      })

      if (response.ok) {
        const updatedResponse = await response.json()
        setAIResponses((prev) => prev.map((r) => (r.id === updatedResponse.id ? updatedResponse : r)))
        setEditingAIResponse(null)

        // Log the activity
        await logActivity(user?.id || "", user?.name || "Creator", "ai_response_updated", {
          responseId: updatedResponse.id,
          keywords: updatedResponse.keywords,
        })

        toast({
          title: "AI response updated",
          description: "The AI response has been updated successfully.",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to update AI response. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating AI response:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteAIResponse = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/ai/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setAIResponses((prev) => prev.filter((r) => r.id !== id))

        // Log the activity
        await logActivity(user?.id || "", user?.name || "Creator", "ai_response_deleted", {
          responseId: id,
        })

        toast({
          title: "AI response deleted",
          description: "The AI response has been deleted successfully.",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to delete AI response. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting AI response:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  // User management functions
  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      })

      if (response.ok) {
        setUsers((prev) =>
          prev.map((u) => {
            if (u.id === userId) {
              return { ...u, role: newRole }
            }
            return u
          }),
        )

        // Log the activity
        await logActivity(user?.id || "", user?.name || "Creator", "role_change", {
          userId,
          newRole,
        })

        toast({
          title: "User role updated",
          description: `User has been ${newRole === "admin" ? "promoted to admin" : "assigned to " + newRole}.`,
        })
        return true
      } else {
        toast({
          title: "Error",
          description: "Failed to update user role. Please try again.",
          variant: "destructive",
        })
        return false
      }
    } catch (error) {
      console.error("Error updating user role:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
      return false
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setUsers((prev) =>
          prev.map((u) => {
            if (u.id === userId) {
              return { ...u, deleted: true }
            }
            return u
          }),
        )

        // Log the activity
        await logActivity(user?.id || "", user?.name || "Creator", "user_delete", {
          userId,
        })

        toast({
          title: "User deleted",
          description: "The user has been marked as deleted.",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to delete user. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting user:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  // Update the handleUpdateSiteSettings function to ensure changes persist
  const handleUpdateSiteSettings = async (data: Partial<SiteSettings>) => {
    try {
      setIsSubmitting(true)
      const response = await fetch("/api/admin/site-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const updatedSettings = await response.json()
        setSiteSettings(updatedSettings)

        // Log the activity
        await logActivity(user?.id || "", user?.name || "Creator", "site_settings_updated", {
          settings: data,
        })

        toast({
          title: "Settings updated",
          description: "Site settings have been updated successfully.",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to update site settings. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating site settings:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUnbanUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/unban`, {
        method: "PUT",
      })

      if (response.ok) {
        setUsers((prev) =>
          prev.map((u) => {
            if (u.id === userId) {
              return { ...u, role: "user" }
            }
            return u
          }),
        )

        // Log the activity
        await logActivity(user?.id || "", user?.name || "Creator", "user_unban", {
          userId,
        })

        toast({
          title: "User unbanned",
          description: "The user has been unbanned.",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to unban user. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error unbanning user:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleBanUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/ban`, {
        method: "PUT",
      })

      if (response.ok) {
        setUsers((prev) =>
          prev.map((u) => {
            if (u.id === userId) {
              return { ...u, role: "banned" }
            }
            return u
          }),
        )

        // Log the activity
        await logActivity(user?.id || "", user?.name || "Creator", "user_ban", {
          userId,
        })

        toast({
          title: "User banned",
          description: "The user has been banned.",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to ban user. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error banning user:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleResetUserPassword = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/reset-password`, {
        method: "POST",
      })

      if (response.ok) {
        // Log the activity
        await logActivity(user?.id || "", user?.name || "Creator", "password_reset", {
          userId,
        })

        toast({
          title: "Password reset",
          description: "The user's password has been reset.",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to reset user password. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error resetting user password:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateRole = async () => {
    if (!editingRole) return

    try {
      const response = await fetch(`/api/admin/roles/${editingRole.name}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          permissions: editingRole.permissions,
          isActive: editingRole.isActive,
          color: editingRole.color,
        }),
      })

      if (response.ok) {
        const updatedRole = await response.json()
        setRoles((prev) => prev.map((r) => (r.name === updatedRole.name ? updatedRole : r)))
        setEditingRole(null)

        // Log the activity
        await logActivity(user?.id || "", user?.name || "Creator", "role_updated", {
          roleName: updatedRole.name,
          permissions: updatedRole.permissions,
        })

        toast({
          title: "Role updated",
          description: "The role has been updated successfully.",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to update role. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating role:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteRole = async (roleName: string) => {
    try {
      const response = await fetch(`/api/admin/roles/${roleName}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setRoles((prev) => prev.filter((r) => r.name !== roleName))

        // Log the activity
        await logActivity(user?.id || "", user?.name || "Creator", "role_deleted", {
          roleName,
        })

        toast({
          title: "Role deleted",
          description: "The role has been deleted successfully.",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to delete role. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting role:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAddRole = async () => {
    try {
      const response = await fetch("/api/admin/roles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRole),
      })

      if (response.ok) {
        const addedRole = await response.json()
        setRoles((prev) => [...prev, addedRole])
        setNewRole({
          name: "",
          permissions: [] as Permission[],
          canBeDeleted: true,
          canChangePassword: true,
          isActive: true,
          color: "#6366f1",
        })

        // Log the activity
        await logActivity(user?.id || "", user?.name || "Creator", "role_added", {
          roleName: addedRole.name,
          permissions: addedRole.permissions,
        })

        toast({
          title: "Role added",
          description: "The role has been added successfully.",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to add role. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error adding role:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleOpenAssignRoleDialog = (role: Role) => {
    setSelectedRole(role)
    setAssignRoleDialogOpen(true)
  }

  const handleAssignRole = async (userId: string, roleName: string) => {
    return await handleUpdateUserRole(userId, roleName)
  }

  const getRoleBadgeStyle = (roleName: string) => {
    const role = roles.find((r) => r.name === roleName)
    if (role) {
      return { backgroundColor: role.color || "#6366f1", color: "#ffffff" }
    }

    // Default colors for built-in roles
    if (roleName === "admin") return { backgroundColor: "#ef4444", color: "#ffffff" } // Red
    if (roleName === "creator") return { backgroundColor: "#8b5cf6", color: "#ffffff" } // Purple
    if (roleName === "banned") return { backgroundColor: "#6b7280", color: "#ffffff" } // Gray

    return { backgroundColor: "#3b82f6", color: "#ffffff" } // Default blue
  }

  if (isLoading) {
    return <div className="container py-10 text-center">Loading...</div>
  }

  if (!isCreator) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Creator Dashboard</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Logged in as {user?.name}</span>
            <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
              Creator
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="flex flex-wrap">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="support">Support Requests</TabsTrigger>
            <TabsTrigger value="software">Software</TabsTrigger>
            <TabsTrigger value="ai">AI Responses</TabsTrigger>
            <TabsTrigger value="site">Site Management</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="roles">Roles</TabsTrigger>
            <TabsTrigger value="backup">Backup & Restore</TabsTrigger>
            <TabsTrigger value="activity">Activity Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View and manage all registered users</CardDescription>
              </CardHeader>
              <CardContent>
                <UserTable
                  users={users}
                  handleUpdateUserRole={handleUpdateUserRole}
                  handleDeleteUser={handleDeleteUser}
                  handleBanUser={handleBanUser}
                  handleUnbanUser={handleUnbanUser}
                  handleResetUserPassword={handleResetUserPassword}
                  getRoleBadgeStyle={getRoleBadgeStyle}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="backup">
            <BackupManager />
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Activity Logs</CardTitle>
                <CardDescription>View all user and system activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Activity</TableHead>
                        <TableHead>Details</TableHead>
                        <TableHead>Date & Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoadingLogs ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-4">
                            Loading activity logs...
                          </TableCell>
                        </TableRow>
                      ) : activityLogs.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-4">
                            No activity logs found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        activityLogs.map((log) => (
                          <TableRow key={log.id}>
                            <TableCell>{log.username}</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  log.activityType.includes("login") || log.activityType.includes("signin")
                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                    : log.activityType.includes("delete") || log.activityType.includes("ban")
                                      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                      : log.activityType.includes("create") || log.activityType.includes("add")
                                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                        : log.activityType.includes("update") || log.activityType.includes("edit")
                                          ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                                          : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                                }
                              >
                                {log.activityType.replace(/_/g, " ")}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="max-w-[300px] truncate">
                                {Object.entries(log.details).map(([key, value]) => (
                                  <div key={key} className="text-xs">
                                    <span className="font-medium">{key}: </span>
                                    <span>{String(value).substring(0, 30)}</span>
                                    {String(value).length > 30 && "..."}
                                  </div>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" onClick={fetchActivityLogs} disabled={isLoadingLogs}>
                    {isLoadingLogs ? "Loading..." : "Refresh Logs"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tabs content would go here */}
        </Tabs>
      </div>
    </div>
  )
}

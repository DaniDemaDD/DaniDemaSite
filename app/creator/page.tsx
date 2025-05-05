"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Trash2, Edit, MoreVertical, Plus, Shield, ShieldOff, UserX, Key, Ban, UserCheck, Users } from "lucide-react"
import { ColorPicker } from "@/components/ui/color-picker"

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
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View and manage all registered users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">User</TableHead>
                        <TableHead className="w-[200px]">Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="hidden md:table-cell">IP Address</TableHead>
                        <TableHead className="hidden md:table-cell">Registered</TableHead>
                        <TableHead className="hidden md:table-cell">Last Login</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id} className={user.deleted ? "opacity-50" : ""}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                                <AvatarFallback>
                                  {user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()
                                    .substring(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="truncate">{user.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="truncate">{user.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline" style={getRoleBadgeStyle(user.role)}>
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{user.ipAddress || "Unknown"}</TableCell>
                          <TableCell className="hidden md:table-cell">{formatDate(user.registeredAt)}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            {user.lastLogin ? formatDate(user.lastLogin) : "Never"}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {user.role === "user" ? (
                                  <DropdownMenuItem
                                    onClick={() => handleUpdateUserRole(user.id, "admin")}
                                    className="text-blue-600"
                                  >
                                    <Shield className="mr-2 h-4 w-4" />
                                    Make Admin
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem
                                    onClick={() => handleUpdateUserRole(user.id, "user")}
                                    className="text-yellow-600"
                                    disabled={user.role === "creator"}
                                  >
                                    <ShieldOff className="mr-2 h-4 w-4" />
                                    Remove Admin
                                  </DropdownMenuItem>
                                )}
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <DropdownMenuItem
                                      onSelect={(e) => e.preventDefault()}
                                      className="text-red-600"
                                      disabled={user.role === "creator" || user.email === "daniele@demartini.biz"}
                                    >
                                      <UserX className="mr-2 h-4 w-4" />
                                      Delete User
                                    </DropdownMenuItem>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This action cannot be undone. This will mark the user account as deleted.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteUser(user.id)}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                                {user.role === "banned" ? (
                                  <DropdownMenuItem onClick={() => handleUnbanUser(user.id)} className="text-green-600">
                                    <UserCheck className="mr-2 h-4 w-4" />
                                    Unban User
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem
                                    onClick={() => handleBanUser(user.id)}
                                    className="text-red-600"
                                    disabled={user.role === "creator" || user.email === "daniele@demartini.biz"}
                                  >
                                    <Ban className="mr-2 h-4 w-4" />
                                    Ban User
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  onClick={() => handleResetUserPassword(user.id)}
                                  className="text-blue-600"
                                  disabled={user.role === "creator" || user.email === "daniele@demartini.biz"}
                                >
                                  <Key className="mr-2 h-4 w-4" />
                                  Reset Password
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Support Requests</CardTitle>
                  <CardDescription>Manage user support requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-[600px] overflow-y-auto">
                    {supportRequests.length === 0 ? (
                      <p className="text-center py-4 text-muted-foreground">No support requests</p>
                    ) : (
                      supportRequests.map((request) => (
                        <div
                          key={request.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedRequest?.id === request.id ? "bg-secondary" : "hover:bg-secondary/50"
                          }`}
                          onClick={() => setSelectedRequest(request)}
                        >
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium">{request.subject}</h3>
                            <Badge
                              variant="outline"
                              className={
                                request.status === "open"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                  : request.status === "in-progress"
                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                    : request.status === "closed"
                                      ? "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                                      : request.status === "redeemed"
                                        ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                                        : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              }
                            >
                              {request.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{request.message}</p>
                          <p className="text-xs text-muted-foreground mt-2">{formatDate(request.createdAt)}</p>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Request Details</CardTitle>
                  <CardDescription>View and respond to the selected request</CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedRequest ? (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium">Request Information</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="font-medium">Status:</span>{" "}
                            <Badge
                              variant="outline"
                              className={
                                selectedRequest.status === "open"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                  : selectedRequest.status === "in-progress"
                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                    : selectedRequest.status === "closed"
                                      ? "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                                      : selectedRequest.status === "redeemed"
                                        ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                                        : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              }
                            >
                              {selectedRequest.status}
                            </Badge>
                          </div>
                          <div>
                            <span className="font-medium">Date:</span> {formatDate(selectedRequest.createdAt)}
                          </div>
                          <div>
                            <span className="font-medium">User ID:</span> {selectedRequest.userId}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-lg font-medium">Subject</h3>
                        <p>{selectedRequest.subject}</p>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-lg font-medium">Message</h3>
                        <div className="p-4 bg-secondary rounded-lg">{selectedRequest.message}</div>
                      </div>

                      {selectedRequest.responses.length > 0 && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Responses</h3>
                          <div className="max-h-[300px] overflow-y-auto space-y-4">
                            {selectedRequest.responses.map((response) => (
                              <div key={response.id} className="p-4 border rounded-lg">
                                <div className="flex justify-between items-start">
                                  <p className="font-medium">Admin Response</p>
                                  <span className="text-xs text-muted-foreground">
                                    {formatDate(response.createdAt)}
                                  </span>
                                </div>
                                <p className="mt-2">{response.message}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <form onSubmit={handleResponseSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <h3 className="text-lg font-medium">Respond</h3>
                          <Textarea
                            placeholder="Type your response here..."
                            value={responseMessage}
                            onChange={(e) => setResponseMessage(e.target.value)}
                            className="min-h-[100px]"
                            required
                          />
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Sending..." : "Send Response"}
                          </Button>

                          {selectedRequest &&
                            selectedRequest.status !== "closed" &&
                            selectedRequest.status !== "redeemed" && (
                              <>
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    fetch(`/api/admin/support/${selectedRequest.id}/status`, {
                                      method: "PUT",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({ status: "closed" }),
                                    }).then((res) => {
                                      if (res.ok) {
                                        setSupportRequests((prev) =>
                                          prev.map((req) =>
                                            req.id === selectedRequest.id ? { ...req, status: "closed" } : req,
                                          ),
                                        )
                                        setSelectedRequest({ ...selectedRequest, status: "closed" })
                                        toast({
                                          title: "Ticket closed",
                                          description: "The ticket has been closed successfully.",
                                        })
                                      }
                                    })
                                  }}
                                >
                                  Close Ticket
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    fetch(`/api/admin/support/${selectedRequest.id}/status`, {
                                      method: "PUT",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({ status: "redeemed" }),
                                    }).then((res) => {
                                      if (res.ok) {
                                        setSupportRequests((prev) =>
                                          prev.map((req) =>
                                            req.id === selectedRequest.id ? { ...req, status: "redeemed" } : req,
                                          ),
                                        )
                                        setSelectedRequest({ ...selectedRequest, status: "redeemed" })
                                        toast({
                                          title: "Ticket redeemed",
                                          description: "The ticket has been marked as redeemed.",
                                        })
                                      }
                                    })
                                  }}
                                >
                                  Mark as Redeemed
                                </Button>
                              </>
                            )}
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className="text-center py-10 text-muted-foreground">
                      <p>Select a support request to view details</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="software">
            <Card>
              <CardHeader>
                <CardTitle>Software Management</CardTitle>
                <CardDescription>Add and manage software projects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead className="hidden md:table-cell">Description</TableHead>
                          <TableHead className="hidden md:table-cell">Version</TableHead>
                          <TableHead className="hidden md:table-cell">Downloads</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {software.map((sw) => (
                          <TableRow key={sw.id}>
                            <TableCell className="font-medium">{sw.name}</TableCell>
                            <TableCell className="hidden md:table-cell max-w-[300px] truncate">
                              {sw.description}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">{sw.version}</TableCell>
                            <TableCell className="hidden md:table-cell">{sw.downloads}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="outline" size="icon" onClick={() => setEditingSoftware(sw)}>
                                      <Edit className="h-4 w-4" />
                                      <span className="sr-only">Edit</span>
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Edit Software</DialogTitle>
                                      <DialogDescription>Make changes to the software details.</DialogDescription>
                                    </DialogHeader>
                                    {editingSoftware && (
                                      <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                          <label className="text-sm font-medium">Name</label>
                                          <Input
                                            value={editingSoftware.name}
                                            onChange={(e) =>
                                              setEditingSoftware({ ...editingSoftware, name: e.target.value })
                                            }
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <label className="text-sm font-medium">Description</label>
                                          <Textarea
                                            value={editingSoftware.description}
                                            onChange={(e) =>
                                              setEditingSoftware({ ...editingSoftware, description: e.target.value })
                                            }
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <label className="text-sm font-medium">Version</label>
                                          <Input
                                            value={editingSoftware.version}
                                            onChange={(e) =>
                                              setEditingSoftware({ ...editingSoftware, version: e.target.value })
                                            }
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <label className="text-sm font-medium">Demo URL</label>
                                          <Input
                                            value={editingSoftware.demoUrl}
                                            onChange={(e) =>
                                              setEditingSoftware({ ...editingSoftware, demoUrl: e.target.value })
                                            }
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <label className="text-sm font-medium">Download URL</label>
                                          <Input
                                            value={editingSoftware.downloadUrl}
                                            onChange={(e) =>
                                              setEditingSoftware({ ...editingSoftware, downloadUrl: e.target.value })
                                            }
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <label className="text-sm font-medium">GitHub URL</label>
                                          <Input
                                            value={editingSoftware.githubUrl}
                                            onChange={(e) =>
                                              setEditingSoftware({ ...editingSoftware, githubUrl: e.target.value })
                                            }
                                          />
                                        </div>
                                      </div>
                                    )}
                                    <DialogFooter>
                                      <Button onClick={handleUpdateSoftware}>Save changes</Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>

                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="outline" size="icon" className="text-red-600">
                                      <Trash2 className="h-4 w-4" />
                                      <span className="sr-only">Delete</span>
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This will permanently delete the software from your system.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteSoftware(sw.id)}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium mb-4">Add New Software</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Name</label>
                        <Input
                          placeholder="e.g. My Awesome App"
                          value={newSoftware.name}
                          onChange={(e) => setNewSoftware({ ...newSoftware, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <Textarea
                          placeholder="Describe your software..."
                          value={newSoftware.description}
                          onChange={(e) => setNewSoftware({ ...newSoftware, description: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Version</label>
                          <Input
                            placeholder="e.g. 1.0.0"
                            value={newSoftware.version}
                            onChange={(e) => setNewSoftware({ ...newSoftware, version: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Tags (comma separated)</label>
                          <Input
                            placeholder="e.g. Web, Tool, Utility"
                            value={newSoftware.tags.join(", ")}
                            onChange={(e) =>
                              setNewSoftware({
                                ...newSoftware,
                                tags: e.target.value.split(",").map((tag) => tag.trim()),
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Demo URL</label>
                          <Input
                            placeholder="https://..."
                            value={newSoftware.demoUrl}
                            onChange={(e) => setNewSoftware({ ...newSoftware, demoUrl: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Download URL</label>
                          <Input
                            placeholder="https://..."
                            value={newSoftware.downloadUrl}
                            onChange={(e) => setNewSoftware({ ...newSoftware, downloadUrl: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">GitHub URL</label>
                          <Input
                            placeholder="https://github.com/..."
                            value={newSoftware.githubUrl}
                            onChange={(e) => setNewSoftware({ ...newSoftware, githubUrl: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                    <Button className="mt-4" onClick={handleAddSoftware}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Software
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai">
            <Card>
              <CardHeader>
                <CardTitle>AI Response Management</CardTitle>
                <CardDescription>Configure AI responses for specific keywords</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Keywords</TableHead>
                          <TableHead className="hidden md:table-cell">Response</TableHead>
                          <TableHead className="hidden md:table-cell">Last Updated</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {aiResponses.map((response) => (
                          <TableRow key={response.id}>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {response.keywords.slice(0, 3).map((keyword, index) => (
                                  <Badge key={index} variant="outline">
                                    {keyword}
                                  </Badge>
                                ))}
                                {response.keywords.length > 3 && (
                                  <Badge variant="outline">+{response.keywords.length - 3} more</Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell max-w-[300px] truncate">
                              {response.response}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">{formatDate(response.updatedAt)}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() => setEditingAIResponse(response)}
                                    >
                                      <Edit className="h-4 w-4" />
                                      <span className="sr-only">Edit</span>
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Edit AI Response</DialogTitle>
                                      <DialogDescription>
                                        Make changes to the AI response configuration.
                                      </DialogDescription>
                                    </DialogHeader>
                                    {editingAIResponse && (
                                      <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                          <label className="text-sm font-medium">Keywords (comma separated)</label>
                                          <Input
                                            value={editingAIResponse.keywords.join(", ")}
                                            onChange={(e) =>
                                              setEditingAIResponse({
                                                ...editingAIResponse,
                                                keywords: e.target.value.split(",").map((k) => k.trim()),
                                              })
                                            }
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <label className="text-sm font-medium">Response</label>
                                          <Textarea
                                            value={editingAIResponse.response}
                                            onChange={(e) =>
                                              setEditingAIResponse({
                                                ...editingAIResponse,
                                                response: e.target.value,
                                              })
                                            }
                                            className="min-h-[200px]"
                                          />
                                        </div>
                                      </div>
                                    )}
                                    <DialogFooter>
                                      <Button onClick={handleUpdateAIResponse}>Save changes</Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>

                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="outline" size="icon" className="text-red-600">
                                      <Trash2 className="h-4 w-4" />
                                      <span className="sr-only">Delete</span>
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This will permanently delete the AI response from your system.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteAIResponse(response.id)}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium mb-4">Add New AI Response</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Keywords (comma separated)</label>
                        <Input
                          placeholder="e.g. help, support, assistance"
                          value={newAIResponse.keywords.join(", ")}
                          onChange={(e) =>
                            setNewAIResponse({
                              ...newAIResponse,
                              keywords: e.target.value.split(",").map((k) => k.trim()),
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Response</label>
                        <Textarea
                          placeholder="Enter the AI response..."
                          value={newAIResponse.response}
                          onChange={(e) => setNewAIResponse({ ...newAIResponse, response: e.target.value })}
                          className="min-h-[200px]"
                        />
                      </div>
                    </div>
                    <Button className="mt-4" onClick={handleAddAIResponse}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add AI Response
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="site">
            <Card>
              <CardHeader>
                <CardTitle>Social Links Management</CardTitle>
                <CardDescription>Add and manage social media links</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead className="hidden md:table-cell">URL</TableHead>
                          <TableHead>Icon</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {socialLinks.map((link) => (
                          <TableRow key={link.id}>
                            <TableCell className="font-medium">{link.name}</TableCell>
                            <TableCell className="hidden md:table-cell max-w-[300px] truncate">
                              <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                {link.url}
                              </a>
                            </TableCell>
                            <TableCell>
                              <div className={`w-6 h-6 flex items-center justify-center rounded-full ${link.color}`}>
                                <span className="text-white text-xs">{link.icon.substring(0, 1)}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="outline" size="icon" onClick={() => setEditingSocialLink(link)}>
                                      <Edit className="h-4 w-4" />
                                      <span className="sr-only">Edit</span>
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Edit Social Link</DialogTitle>
                                      <DialogDescription>Make changes to the social media link.</DialogDescription>
                                    </DialogHeader>
                                    {editingSocialLink && (
                                      <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                          <label className="text-sm font-medium">Name</label>
                                          <Input
                                            value={editingSocialLink.name}
                                            onChange={(e) =>
                                              setEditingSocialLink({ ...editingSocialLink, name: e.target.value })
                                            }
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <label className="text-sm font-medium">URL</label>
                                          <Input
                                            value={editingSocialLink.url}
                                            onChange={(e) =>
                                              setEditingSocialLink({ ...editingSocialLink, url: e.target.value })
                                            }
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <label className="text-sm font-medium">Icon</label>
                                          <Input
                                            value={editingSocialLink.icon}
                                            onChange={(e) =>
                                              setEditingSocialLink({ ...editingSocialLink, icon: e.target.value })
                                            }
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <label className="text-sm font-medium">Color</label>
                                          <Input
                                            value={editingSocialLink.color}
                                            onChange={(e) =>
                                              setEditingSocialLink({ ...editingSocialLink, color: e.target.value })
                                            }
                                          />
                                        </div>
                                      </div>
                                    )}
                                    <DialogFooter>
                                      <Button onClick={handleUpdateSocialLink}>Save changes</Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>

                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="outline" size="icon" className="text-red-600">
                                      <Trash2 className="h-4 w-4" />
                                      <span className="sr-only">Delete</span>
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This will permanently delete the social link from your system.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteSocialLink(link.id)}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium mb-4">Add New Social Link</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Name</label>
                          <Input
                            placeholder="e.g. Twitter"
                            value={newSocialLink.name}
                            onChange={(e) => setNewSocialLink({ ...newSocialLink, name: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">URL</label>
                          <Input
                            placeholder="https://..."
                            value={newSocialLink.url}
                            onChange={(e) => setNewSocialLink({ ...newSocialLink, url: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Icon</label>
                          <Input
                            placeholder="e.g. Twitter"
                            value={newSocialLink.icon}
                            onChange={(e) => setNewSocialLink({ ...newSocialLink, icon: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Color</label>
                          <Input
                            placeholder="e.g. bg-blue-600"
                            value={newSocialLink.color}
                            onChange={(e) => setNewSocialLink({ ...newSocialLink, color: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                    <Button className="mt-4" onClick={handleAddSocialLink}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Social Link
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Site Settings</CardTitle>
                <CardDescription>Configure general site settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Site Title</label>
                      <Input
                        value={siteSettings.siteTitle}
                        onChange={(e) => setSiteSettings({ ...siteSettings, siteTitle: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Site Description</label>
                      <Textarea
                        value={siteSettings.siteDescription}
                        onChange={(e) => setSiteSettings({ ...siteSettings, siteDescription: e.target.value })}
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>
                  <Button onClick={() => handleUpdateSiteSettings(siteSettings)} disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Settings"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roles">
            <Card>
              <CardHeader>
                <CardTitle>Role Management</CardTitle>
                <CardDescription>Create and manage user roles and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Role Name</TableHead>
                          <TableHead>Color</TableHead>
                          <TableHead className="hidden md:table-cell">Permissions</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="hidden md:table-cell">Can Be Deleted</TableHead>
                          <TableHead className="hidden md:table-cell">Can Change Password</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {roles.map((role) => (
                          <TableRow key={role.name}>
                            <TableCell className="font-medium">
                              <Badge style={{ backgroundColor: role.color || "#6366f1", color: "#ffffff" }}>
                                {role.name}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div
                                className="w-6 h-6 rounded-full"
                                style={{ backgroundColor: role.color || "#6366f1" }}
                              />
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <div className="flex flex-wrap gap-1 max-w-[300px]">
                                {role.permissions.slice(0, 3).map((permission) => (
                                  <Badge key={permission} variant="outline">
                                    {permission}
                                  </Badge>
                                ))}
                                {role.permissions.length > 3 && (
                                  <Badge variant="outline">+{role.permissions.length - 3} more</Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={role.isActive ? "default" : "secondary"}
                                className={
                                  role.isActive
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                    : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                                }
                              >
                                {role.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">{role.canBeDeleted ? "Yes" : "No"}</TableCell>
                            <TableCell className="hidden md:table-cell">
                              {role.canChangePassword ? "Yes" : "No"}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleOpenAssignRoleDialog(role)}
                                  title="Assign to User"
                                >
                                  <Users className="h-4 w-4" />
                                  <span className="sr-only">Assign to User</span>
                                </Button>

                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() => setEditingRole(role)}
                                      disabled={role.name === "creator"}
                                    >
                                      <Edit className="h-4 w-4" />
                                      <span className="sr-only">Edit</span>
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Edit Role</DialogTitle>
                                      <DialogDescription>
                                        Make changes to the role permissions and status.
                                      </DialogDescription>
                                    </DialogHeader>
                                    {editingRole && (
                                      <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                          <h3 className="text-sm font-medium">Role Name</h3>
                                          <Input value={editingRole.name} disabled />
                                        </div>

                                        <div className="space-y-2">
                                          <h3 className="text-sm font-medium">Role Color</h3>
                                          <ColorPicker
                                            value={editingRole.color || "#6366f1"}
                                            onChange={(color) => setEditingRole({ ...editingRole, color })}
                                          />
                                        </div>

                                        <div className="space-y-2">
                                          <h3 className="text-sm font-medium">Permissions</h3>
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {availablePermissions.map((permission) => (
                                              <div key={permission} className="flex items-center space-x-2">
                                                <Checkbox
                                                  id={`permission-${permission}`}
                                                  checked={editingRole.permissions.includes(permission)}
                                                  onCheckedChange={(checked) => {
                                                    if (checked) {
                                                      setEditingRole({
                                                        ...editingRole,
                                                        permissions: [...editingRole.permissions, permission],
                                                      })
                                                    } else {
                                                      setEditingRole({
                                                        ...editingRole,
                                                        permissions: editingRole.permissions.filter(
                                                          (p) => p !== permission,
                                                        ),
                                                      })
                                                    }
                                                  }}
                                                />
                                                <label
                                                  htmlFor={`permission-${permission}`}
                                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                  {permission}
                                                </label>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <Checkbox
                                            id="role-active"
                                            checked={editingRole.isActive}
                                            onCheckedChange={(checked) => {
                                              setEditingRole({
                                                ...editingRole,
                                                isActive: !!checked,
                                              })
                                            }}
                                          />
                                          <label
                                            htmlFor="role-active"
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                          >
                                            Active
                                          </label>
                                        </div>
                                      </div>
                                    )}
                                    <DialogFooter>
                                      <Button onClick={handleUpdateRole}>Save changes</Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>

                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="text-red-600"
                                      disabled={!role.canBeDeleted || role.name === "creator"}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                      <span className="sr-only">Delete</span>
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This will permanently delete the {role.name} role from your system.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteRole(role.name)}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium mb-4">Add New Role</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Role Name</label>
                        <Input
                          placeholder="e.g. moderator"
                          value={newRole.name}
                          onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Role Color</label>
                        <ColorPicker value={newRole.color} onChange={(color) => setNewRole({ ...newRole, color })} />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Permissions</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {availablePermissions.map((permission) => (
                            <div key={permission} className="flex items-center space-x-2">
                              <Checkbox
                                id={`new-permission-${permission}`}
                                checked={newRole.permissions.includes(permission)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setNewRole({
                                      ...newRole,
                                      permissions: [...newRole.permissions, permission],
                                    })
                                  } else {
                                    setNewRole({
                                      ...newRole,
                                      permissions: newRole.permissions.filter((p) => p !== permission),
                                    })
                                  }
                                }}
                              />
                              <label
                                htmlFor={`new-permission-${permission}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {permission}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="new-role-active"
                          checked={newRole.isActive}
                          onCheckedChange={(checked) => {
                            setNewRole({
                              ...newRole,
                              isActive: !!checked,
                            })
                          }}
                        />
                        <label
                          htmlFor="new-role-active"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Active
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="new-role-can-be-deleted"
                          checked={newRole.canBeDeleted}
                          onCheckedChange={(checked) => {
                            setNewRole({
                              ...newRole,
                              canBeDeleted: !!checked,
                            })
                          }}
                        />
                        <label
                          htmlFor="new-role-can-be-deleted"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Can be deleted
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="new-role-can-change-password"
                          checked={newRole.canChangePassword}
                          onCheckedChange={(checked) => {
                            setNewRole({
                              ...newRole,
                              canChangePassword: !!checked,
                            })
                          }}
                        />
                        <label
                          htmlFor="new-role-can-change-password"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Can change password
                        </label>
                      </div>
                    </div>
                    <Button className="mt-4" onClick={handleAddRole}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Role
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

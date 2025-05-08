"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { UserTable } from "@/components/user-table"
import { AIResponseTable } from "@/components/admin/ai-response-table"
import { BackupManager } from "@/components/admin/backup-manager"
import { motion } from "framer-motion"

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
}

export default function AdminDashboard() {
  const { user, isLoading, isAdmin } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push("/")
    }
  }, [isLoading, isAdmin, router])

  if (isLoading) {
    return (
      <div className="container py-10 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center"
        >
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </motion.div>
      </div>
    )
  }

  if (!isAdmin) {
    return null // Will redirect in useEffect
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="container py-10"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Logged in as {user?.name}</span>
            <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
              Admin
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
                <UserTable showSpecialControls={true} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai">
            <Card>
              <CardHeader>
                <CardTitle>AI Response Management</CardTitle>
                <CardDescription>Add, edit, or remove AI responses for specific keywords</CardDescription>
              </CardHeader>
              <CardContent>
                <AIResponseTable />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <BackupManager />
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  )
}

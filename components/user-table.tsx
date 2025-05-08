"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Loader2, MoreVertical, Shield, ShieldOff, UserX, Key, Ban, UserCheck, Users } from "lucide-react"
import { useAuth } from "@/components/auth/auth-context"
import { persistData, retrieveData } from "@/lib/persistence"

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

type Role = {
  name: string
  color: string
  permissions: string[]
  canBeDeleted: boolean
  canChangePassword: boolean
  isActive: boolean
}

interface UserTableProps {
  showSpecialControls?: boolean
}

export function UserTable({ showSpecialControls = false }: UserTableProps) {
  const { toast } = useToast()
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [assignRoleDialogOpen, setAssignRoleDialogOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<string>("")
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false)
  const [newPassword, setNewPassword] = useState("")

  // Load users and roles
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try to get cached data first for immediate display
        const cachedUsers = retrieveData<User[]>({ key: "users_data" })
        if (cachedUsers) {
          setUsers(cachedUsers)
          setLoading(false)
        }

        const cachedRoles = retrieveData<Role[]>({ key: "roles_data" })
        if (cachedRoles) {
          setRoles(cachedRoles)
        }

        // Fetch fresh data from API
        const usersResponse = await fetch("/api/admin/users")
        if (usersResponse.ok) {
          const usersData = await usersResponse.json()
          setUsers(usersData)
          // Cache the data for future use
          persistData(usersData, { key: "users_data" })
        }

        const rolesResponse = await fetch("/api/admin/roles")
        if (rolesResponse.ok) {
          const rolesData = await rolesResponse.json()
          setRoles(rolesData)
          // Cache the data for future use
          persistData(rolesData, { key: "roles_data" })
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load users. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [toast])

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
        // Update local state
        const updatedUsers = users.map((u) => {
          if (u.id === userId) {
            return { ...u, role: newRole }
          }
          return u
        })
        setUsers(updatedUsers)
        persistData(updatedUsers, { key: "users_data" })

        toast({
          title: "Role updated",
          description: `User has been assigned to ${newRole} role.`,
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
        // Update local state
        const updatedUsers = users.map((u) => {
          if (u.id === userId) {
            return { ...u, deleted: true }
          }
          return u
        })
        setUsers(updatedUsers)
        persistData(updatedUsers, { key: "users_data" })

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

  const handleBanUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/ban`, {
        method: "PUT",
      })

      if (response.ok) {
        // Update local state
        const updatedUsers = users.map((u) => {
          if (u.id === userId) {
            return { ...u, role: "banned", status: "banned" }
          }
          return u
        })
        setUsers(updatedUsers)
        persistData(updatedUsers, { key: "users_data" })

        toast({
          title: "User banned",
          description: "The user has been banned successfully.",
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

  const handleUnbanUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/unban`, {
        method: "PUT",
      })

      if (response.ok) {
        // Update local state
        const updatedUsers = users.map((u) => {
          if (u.id === userId) {
            return { ...u, role: "user", status: "active" }
          }
          return u
        })
        setUsers(updatedUsers)
        persistData(updatedUsers, { key: "users_data" })

        toast({
          title: "User unbanned",
          description: "The user has been unbanned successfully.",
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

  const handleResetPassword = async () => {
    if (!selectedUser || !newPassword) return

    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPassword }),
      })

      if (response.ok) {
        toast({
          title: "Password reset",
          description: "The user's password has been reset successfully.",
        })
        setResetPasswordDialogOpen(false)
        setNewPassword("")
      } else {
        toast({
          title: "Error",
          description: "Failed to reset password. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error resetting password:", error)
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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <div className="text-sm text-muted-foreground">
          Showing {filteredUsers.length} of {users.length} users
        </div>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">User</TableHead>
              <TableHead className="w-[200px]">Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="hidden md:table-cell">Registered</TableHead>
              <TableHead className="hidden md:table-cell">Last Login</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id} className={user.deleted ? "opacity-50" : ""}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar || "/placeholder.svg?height=32&width=32"} alt={user.name} />
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
                  <TableCell className="hidden md:table-cell">
                    <Badge
                      variant="outline"
                      className={
                        user.status === "banned"
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          : user.status === "inactive"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      }
                    >
                      {user.status || "active"}
                    </Badge>
                  </TableCell>
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
                        {/* Role management options */}
                        {user.role !== "admin" && currentUser?.role === "admin" && (
                          <DropdownMenuItem
                            onClick={() => handleUpdateUserRole(user.id, "admin")}
                            className="text-blue-600"
                          >
                            <Shield className="mr-2 h-4 w-4" />
                            Make Admin
                          </DropdownMenuItem>
                        )}
                        {user.role === "admin" && currentUser?.role === "admin" && (
                          <DropdownMenuItem
                            onClick={() => handleUpdateUserRole(user.id, "user")}
                            className="text-yellow-600"
                            disabled={user.role === "creator" || user.email === currentUser?.email}
                          >
                            <ShieldOff className="mr-2 h-4 w-4" />
                            Remove Admin
                          </DropdownMenuItem>
                        )}

                        {/* Assign custom role */}
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedUser(user)
                            setAssignRoleDialogOpen(true)
                          }}
                          disabled={user.role === "creator" || user.email === currentUser?.email}
                        >
                          <Users className="mr-2 h-4 w-4" />
                          Assign Role
                        </DropdownMenuItem>

                        {/* Ban/Unban options */}
                        {user.role === "banned" ? (
                          <DropdownMenuItem onClick={() => handleUnbanUser(user.id)} className="text-green-600">
                            <UserCheck className="mr-2 h-4 w-4" />
                            Unban User
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => handleBanUser(user.id)}
                            className="text-red-600"
                            disabled={user.role === "creator" || user.email === currentUser?.email}
                          >
                            <Ban className="mr-2 h-4 w-4" />
                            Ban User
                          </DropdownMenuItem>
                        )}

                        {/* Reset password option */}
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedUser(user)
                            setResetPasswordDialogOpen(true)
                          }}
                          className="text-blue-600"
                          disabled={user.role === "creator" || user.email === currentUser?.email}
                        >
                          <Key className="mr-2 h-4 w-4" />
                          Reset Password
                        </DropdownMenuItem>

                        {/* Delete user option */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                              className="text-red-600"
                              disabled={user.role === "creator" || user.email === currentUser?.email}
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
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Assign Role Dialog */}
      <Dialog open={assignRoleDialogOpen} onOpenChange={setAssignRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Role</DialogTitle>
            <DialogDescription>
              Select a role to assign to {selectedUser?.name || "the selected user"}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <select
                className="w-full p-2 border rounded-md"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="" disabled>
                  Select a role
                </option>
                {roles
                  .filter((role) => role.isActive && role.name !== "creator")
                  .map((role) => (
                    <option key={role.name} value={role.name}>
                      {role.name}
                    </option>
                  ))}
                <option value="user">user</option>
                {currentUser?.role === "admin" && <option value="admin">admin</option>}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setAssignRoleDialogOpen(false)
                setSelectedRole("")
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                if (selectedUser && selectedRole) {
                  const success = await handleUpdateUserRole(selectedUser.id, selectedRole)
                  if (success) {
                    setAssignRoleDialogOpen(false)
                    setSelectedRole("")
                  }
                }
              }}
              disabled={!selectedRole}
            >
              Assign Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={resetPasswordDialogOpen} onOpenChange={setResetPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>Enter a new password for {selectedUser?.name || "the selected user"}.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">New Password</label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
              {newPassword && newPassword.length < 6 && (
                <p className="text-sm text-red-500">Password must be at least 6 characters long</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setResetPasswordDialogOpen(false)
                setNewPassword("")
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleResetPassword} disabled={!newPassword || newPassword.length < 6}>
              Reset Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

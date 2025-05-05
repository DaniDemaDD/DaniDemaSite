"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface Role {
  name: string
  color: string
  permissions: string[]
}

interface AssignRoleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  role: Role
  onAssignRole: (userId: string, role: string) => Promise<boolean>
}

export function AssignRoleDialog({ open, onOpenChange, role, onAssignRole }: AssignRoleDialogProps) {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUserId, setSelectedUserId] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/admin/users")
        if (response.ok) {
          const data = await response.json()
          setUsers(data)
        }
      } catch (error) {
        console.error("Error fetching users:", error)
      }
    }

    if (open) {
      fetchUsers()
    }
  }, [open])

  const handleAssignRole = async () => {
    if (!selectedUserId) {
      toast({
        title: "No user selected",
        description: "Please select a user to assign this role.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const success = await onAssignRole(selectedUserId, role.name)

      if (success) {
        toast({
          title: "Role assigned",
          description: `The role ${role.name} has been assigned successfully.`,
        })
        onOpenChange(false)
      } else {
        toast({
          title: "Error",
          description: "Failed to assign role. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error assigning role:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Role: {role.name}</DialogTitle>
          <DialogDescription>Select a user to assign the {role.name} role.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="user" className="text-right">
              User
            </Label>
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAssignRole} disabled={isLoading}>
            {isLoading ? "Assigning..." : "Assign Role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

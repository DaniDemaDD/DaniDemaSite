"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { saveToOneDrive } from "@/lib/onedrive-integration"
import { sendBackupNotification } from "@/lib/discord-webhook"
import { logActivity } from "@/lib/activity-logger"
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
import { Download, RotateCcw, Cloud, Trash2 } from "lucide-react"

type Backup = {
  id: string
  name: string
  timestamp: number
  size: number
}

export function BackupManager() {
  const [backups, setBackups] = useState<Backup[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreatingBackup, setIsCreatingBackup] = useState(false)
  const [isRestoringBackup, setIsRestoringBackup] = useState(false)
  const [backupName, setBackupName] = useState("")
  const [selectedBackupId, setSelectedBackupId] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchBackups()
  }, [])

  const fetchBackups = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/admin/backup")
      if (response.ok) {
        const data = await response.json()
        setBackups(data)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch backups",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching backups:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateBackup = async () => {
    try {
      setIsCreatingBackup(true)
      const response = await fetch("/api/admin/backup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: backupName || `Manual Backup ${new Date().toLocaleString()}`,
        }),
      })

      if (response.ok) {
        const newBackup = await response.json()
        setBackups((prev) => [newBackup, ...prev])
        setBackupName("")
        toast({
          title: "Backup created",
          description: "Your backup has been created successfully",
        })

        // Log the activity
        await logActivity("creator", "Creator", "backup_created", {
          backupId: newBackup.id,
          backupName: newBackup.name,
        })

        // Send notification to Discord
        await sendBackupNotification("created", newBackup.name, "Creator")
      } else {
        toast({
          title: "Error",
          description: "Failed to create backup",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating backup:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsCreatingBackup(false)
    }
  }

  const handleRestoreBackup = async (backupId: string) => {
    try {
      setIsRestoringBackup(true)
      setSelectedBackupId(backupId)

      const response = await fetch(`/api/admin/backup/${backupId}/restore`, {
        method: "POST",
      })

      if (response.ok) {
        toast({
          title: "Backup restored",
          description: "Your backup has been restored successfully",
        })

        // Log the activity
        const backup = backups.find((b) => b.id === backupId)
        await logActivity("creator", "Creator", "backup_restored", {
          backupId,
          backupName: backup?.name,
        })

        // Send notification to Discord
        if (backup) {
          await sendBackupNotification("restored", backup.name, "Creator")
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to restore backup",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error restoring backup:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsRestoringBackup(false)
      setSelectedBackupId(null)
    }
  }

  const handleDownloadBackup = async (backupId: string) => {
    try {
      // In a real app, this would download the backup file
      // For now, we'll just show a toast
      toast({
        title: "Download started",
        description: "Your backup is being downloaded",
      })

      // Log the activity
      const backup = backups.find((b) => b.id === backupId)
      await logActivity("creator", "Creator", "backup_downloaded", {
        backupId,
        backupName: backup?.name,
      })

      // Send notification to Discord
      if (backup) {
        await sendBackupNotification("downloaded", backup.name, "Creator")
      }
    } catch (error) {
      console.error("Error downloading backup:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  const handleSaveToOneDrive = async (backupId: string) => {
    try {
      const backup = backups.find((b) => b.id === backupId)
      if (!backup) return

      // Save to OneDrive
      const result = await saveToOneDrive(backup.name)

      if (result.success) {
        toast({
          title: "Saved to OneDrive",
          description: `Backup saved to ${result.path}`,
        })

        // Log the activity
        await logActivity("creator", "Creator", "backup_saved_to_onedrive", {
          backupId,
          backupName: backup.name,
          path: result.path,
        })

        // Send notification to Discord
        await sendBackupNotification("onedrive", backup.name, "Creator")
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to save to OneDrive",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving to OneDrive:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Backup & Restore</CardTitle>
        <CardDescription>Manage your site backups</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label htmlFor="backup-name" className="block text-sm font-medium mb-1">
                Backup Name
              </label>
              <Input
                id="backup-name"
                placeholder="e.g., Pre-update Backup"
                value={backupName}
                onChange={(e) => setBackupName(e.target.value)}
              />
            </div>
            <Button onClick={handleCreateBackup} disabled={isCreatingBackup}>
              {isCreatingBackup ? "Creating..." : "Create Backup"}
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
                      Loading backups...
                    </TableCell>
                  </TableRow>
                ) : backups.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
                      No backups found. Create your first backup!
                    </TableCell>
                  </TableRow>
                ) : (
                  backups.map((backup) => (
                    <TableRow key={backup.id}>
                      <TableCell className="font-medium">{backup.name}</TableCell>
                      <TableCell>{formatDate(backup.timestamp)}</TableCell>
                      <TableCell>{formatSize(backup.size)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="icon" title="Restore">
                                <RotateCcw className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will restore your site to the state it was in when this backup was created. All
                                  current data will be overwritten.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleRestoreBackup(backup.id)}
                                  disabled={isRestoringBackup}
                                >
                                  {isRestoringBackup && selectedBackupId === backup.id ? "Restoring..." : "Restore"}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>

                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDownloadBackup(backup.id)}
                            title="Download"
                          >
                            <Download className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleSaveToOneDrive(backup.id)}
                            title="Save to OneDrive"
                          >
                            <Cloud className="h-4 w-4" />
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="icon" className="text-red-600" title="Delete">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete this backup. This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          {backups.length} backup{backups.length !== 1 ? "s" : ""} available
        </div>
        <Button variant="outline" onClick={fetchBackups}>
          Refresh
        </Button>
      </CardFooter>
    </Card>
  )
}

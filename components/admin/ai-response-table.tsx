"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
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
import { Edit, Trash2, Plus, Search, RefreshCw, Bot } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { logActivity } from "@/lib/activity-logger"
import { useAuth } from "@/components/auth/auth-context"

type AIResponse = {
  id: string
  keywords: string[]
  response: string
  model?: string
  createdAt: string
  updatedAt: string
}

export function AIResponseTable() {
  const { toast } = useToast()
  const { user } = useAuth()
  const [aiResponses, setAIResponses] = useState<AIResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [newAIResponse, setNewAIResponse] = useState({
    keywords: [""],
    response: "",
    model: "gpt-3.5-turbo",
  })
  const [editingAIResponse, setEditingAIResponse] = useState<AIResponse | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Available AI models
  const availableModels = [
    { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
    { id: "gpt-4", name: "GPT-4" },
    { id: "claude-2", name: "Claude 2" },
    { id: "llama-2", name: "Llama 2" },
  ]

  useEffect(() => {
    fetchAIResponses()
  }, [])

  const fetchAIResponses = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/ai")
      if (response.ok) {
        const data = await response.json()
        setAIResponses(data)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch AI responses. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching AI responses:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddAIResponse = async () => {
    try {
      setIsSubmitting(true)
      const response = await fetch("/api/admin/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          keywords: newAIResponse.keywords.filter((k) => k.trim() !== ""),
          response: newAIResponse.response,
          model: newAIResponse.model,
        }),
      })

      if (response.ok) {
        const addedResponse = await response.json()
        setAIResponses((prev) => [addedResponse, ...prev])
        setNewAIResponse({
          keywords: [""],
          response: "",
          model: "gpt-3.5-turbo",
        })

        // Log activity
        if (user) {
          await logActivity(
            user.id,
            user.name,
            "ai_response_add",
            `Added AI response with keywords: ${newAIResponse.keywords.join(", ")}`,
          )
        }

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
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateAIResponse = async () => {
    if (!editingAIResponse) return

    try {
      setIsSubmitting(true)
      const response = await fetch(`/api/admin/ai/${editingAIResponse.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          keywords: editingAIResponse.keywords.filter((k) => k.trim() !== ""),
          response: editingAIResponse.response,
          model: editingAIResponse.model,
        }),
      })

      if (response.ok) {
        const updatedResponse = await response.json()
        setAIResponses((prev) => prev.map((r) => (r.id === updatedResponse.id ? updatedResponse : r)))
        setEditingAIResponse(null)

        // Log activity
        if (user) {
          await logActivity(
            user.id,
            user.name,
            "ai_response_update",
            `Updated AI response with keywords: ${editingAIResponse.keywords.join(", ")}`,
          )
        }

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
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteAIResponse = async (id: string) => {
    try {
      setIsSubmitting(true)
      const response = await fetch(`/api/admin/ai/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        const deletedResponse = aiResponses.find((r) => r.id === id)
        setAIResponses((prev) => prev.filter((r) => r.id !== id))

        // Log activity
        if (user && deletedResponse) {
          await logActivity(
            user.id,
            user.name,
            "ai_response_delete",
            `Deleted AI response with keywords: ${deletedResponse.keywords.join(", ")}`,
          )
        }

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
    } finally {
      setIsSubmitting(false)
    }
  }

  // Filter AI responses based on search term
  const filteredResponses = aiResponses.filter(
    (response) =>
      response.keywords.some((keyword) => keyword.toLowerCase().includes(searchTerm.toLowerCase())) ||
      response.response.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (response.model && response.model.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search AI responses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 w-full sm:w-[300px]"
          />
        </div>
        <div className="flex items-center gap-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Response
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add AI Response</DialogTitle>
                  <DialogDescription>Create a new AI response for specific keywords.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Keywords (comma separated)</label>
                    <Input
                      placeholder="e.g. hello, hi, hey"
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
                    <label className="text-sm font-medium">AI Model</label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={newAIResponse.model}
                      onChange={(e) => setNewAIResponse({ ...newAIResponse, model: e.target.value })}
                    >
                      {availableModels.map((model) => (
                        <option key={model.id} value={model.id}>
                          {model.name}
                        </option>
                      ))}
                    </select>
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
                <DialogFooter>
                  <Button onClick={handleAddAIResponse} disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      "Add Response"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button variant="outline" size="icon" onClick={fetchAIResponses} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              <span className="sr-only">Refresh</span>
            </Button>
          </motion.div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Keywords</TableHead>
              <TableHead>Response</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin mx-auto" />
                  <span className="mt-2 block text-sm text-muted-foreground">Loading AI responses...</span>
                </TableCell>
              </TableRow>
            ) : filteredResponses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  {searchTerm ? "No matching AI responses found." : "No AI responses found. Add your first response."}
                </TableCell>
              </TableRow>
            ) : (
              <AnimatePresence>
                {filteredResponses.map((response) => (
                  <motion.tr
                    key={response.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-b"
                  >
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
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
                    <TableCell className="max-w-[300px]">
                      <p className="truncate">{response.response}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Bot className="h-3 w-3" />
                        {response.model || "gpt-3.5-turbo"}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(response.updatedAt)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={() => setEditingAIResponse(response)}>
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Edit AI Response</DialogTitle>
                                <DialogDescription>Make changes to the AI response configuration.</DialogDescription>
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
                                    <label className="text-sm font-medium">AI Model</label>
                                    <select
                                      className="w-full p-2 border rounded-md"
                                      value={editingAIResponse.model || "gpt-3.5-turbo"}
                                      onChange={(e) =>
                                        setEditingAIResponse({ ...editingAIResponse, model: e.target.value })
                                      }
                                    >
                                      {availableModels.map((model) => (
                                        <option key={model.id} value={model.id}>
                                          {model.name}
                                        </option>
                                      ))}
                                    </select>
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
                                <Button onClick={handleUpdateAIResponse} disabled={isSubmitting}>
                                  {isSubmitting ? (
                                    <>
                                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                      Saving...
                                    </>
                                  ) : (
                                    "Save changes"
                                  )}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-red-600">
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete AI response</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this AI response? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteAIResponse(response.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  {isSubmitting ? (
                                    <>
                                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                      Deleting...
                                    </>
                                  ) : (
                                    "Delete"
                                  )}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </motion.div>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type UserRole = "user" | "admin" | "creator" | "banned" | "special"

type UserPreferences = {
  notifications?: boolean
  marketing?: boolean
  darkMode?: boolean
}

type User = {
  id: string
  name: string
  email: string
  bio?: string
  avatar?: string
  language?: string
  downloadedSoftware?: string[]
  preferences?: UserPreferences
  role: UserRole
  ipAddress?: string
  lastLogin?: string
  registeredAt: string
}

// Add isCreator to the AuthContextType interface
type AuthContextType = {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  isCreator: boolean
  signIn: (email: string, password: string) => Promise<boolean>
  signOut: () => Promise<void>
  signUp: (name: string, email: string, password: string) => Promise<boolean>
  updateProfile: (data: Partial<User>) => Promise<boolean>
  updatePassword: (currentPassword: string, newPassword: string) => Promise<boolean>
  setSpecialRole: (userId: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Update the AuthProvider to include isCreator
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me")
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        }
      } catch (error) {
        console.error("Auth check failed:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      // Get IP address (in a real app, this would be done server-side)
      let ipAddress = "unknown"
      try {
        const ipResponse = await fetch("https://api.ipify.org?format=json")
        if (ipResponse.ok) {
          const ipData = await ipResponse.json()
          ipAddress = ipData.ip || "unknown"
        }
      } catch (error) {
        console.error("Failed to get IP address:", error)
      }

      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, ipAddress }),
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
        router.refresh()
        return true
      }
      return false
    } catch (error) {
      console.error("Sign in failed:", error)
      return false
    }
  }

  const signUp = async (name: string, email: string, password: string) => {
    try {
      // Get IP address (in a real app, this would be done server-side)
      let ipAddress = "unknown"
      try {
        const ipResponse = await fetch("https://api.ipify.org?format=json")
        if (ipResponse.ok) {
          const ipData = await ipResponse.json()
          ipAddress = ipData.ip || "unknown"
        }
      } catch (error) {
        console.error("Failed to get IP address:", error)
      }

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, ipAddress }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Sign up failed:", errorData.error)
        return false
      }

      const userData = await response.json()
      setUser(userData)
      router.refresh()
      return true
    } catch (error) {
      console.error("Sign up failed:", error)
      return false
    }
  }

  const signOut = async () => {
    try {
      await fetch("/api/auth/signout", { method: "POST" })
      setUser(null)
      router.refresh()
      router.push("/")
    } catch (error) {
      console.error("Sign out failed:", error)
    }
  }

  const updateProfile = async (data: Partial<User>) => {
    try {
      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const updatedUser = await response.json()
        setUser(updatedUser)
        return true
      }
      return false
    } catch (error) {
      console.error("Profile update failed:", error)
      return false
    }
  }

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      const response = await fetch("/api/auth/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      return response.ok
    } catch (error) {
      console.error("Password update failed:", error)
      return false
    }
  }

  const setSpecialRole = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/special`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      })

      return response.ok
    } catch (error) {
      console.error("Set special role failed:", error)
      return false
    }
  }

  // Check if user is authenticated
  const isAuthenticated = !!user

  // Check if user is admin
  const isAdmin = user?.role === "admin" || user?.role === "creator"

  // Check if user is creator
  const isCreator = user?.role === "creator"

  const value = {
    user,
    isLoading,
    isAuthenticated,
    isAdmin,
    isCreator,
    signIn,
    signOut,
    signUp,
    updateProfile,
    updatePassword,
    setSpecialRole,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

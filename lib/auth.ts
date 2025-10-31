"use client"

// Simple client-side session management
export const AuthSession = {
  setLoginStatus: (status: boolean) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("isLoggedIn", status.toString())
    }
  },

  getLoginStatus: (): boolean => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("isLoggedIn") === "true"
    }
    return false
  },

  set2FAStatus: (status: boolean) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("is2FAVerified", status.toString())
    }
  },

  get2FAStatus: (): boolean => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("is2FAVerified") === "true"
    }
    return false
  },

  setDiscordUser: (user: { id: string; username: string; email: string; avatar: string }) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("discordUser", JSON.stringify(user))
    }
  },

  getDiscordUser: (): { id: string; username: string; email: string; avatar: string } | null => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("discordUser")
      return user ? JSON.parse(user) : null
    }
    return null
  },

  clearSession: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("isLoggedIn")
      localStorage.removeItem("is2FAVerified")
      localStorage.removeItem("discordUser")
    }
  },
}

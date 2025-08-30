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

  clearSession: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("isLoggedIn")
      localStorage.removeItem("is2FAVerified")
    }
  },
}

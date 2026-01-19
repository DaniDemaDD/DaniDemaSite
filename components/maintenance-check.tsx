"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { Wrench, Clock, AlertTriangle, Home, RefreshCw } from "lucide-react"

export function MaintenanceCheck({ children }: { children: React.ReactNode }) {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false)
  const [maintenanceMessage, setMaintenanceMessage] = useState("")
  const [maintenanceType, setMaintenanceType] = useState<"global" | "route" | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [retryCount, setRetryCount] = useState(0)
  const pathname = usePathname()

  useEffect(() => {
    const checkMaintenance = async () => {
      try {
        const response = await fetch("/api/maintenance/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ route_path: pathname }),
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        const data = await response.json()
        setIsMaintenanceMode(data.is_maintenance || false)
        setMaintenanceMessage(data.message || "")
        setMaintenanceType(data.type || null)
        setRetryCount(0) // Reset retry count on success
      } catch (error) {
        console.error("Maintenance check failed:", error)
        // On error, assume no maintenance to avoid blocking access
        setIsMaintenanceMode(false)
        setMaintenanceMessage("")
        setMaintenanceType(null)

        // Increment retry count
        setRetryCount((prev) => prev + 1)
      } finally {
        setIsLoading(false)
      }
    }

    checkMaintenance()

    // Auto-refresh every 30 seconds to check for maintenance changes
    const interval = setInterval(checkMaintenance, 30000)
    return () => clearInterval(interval)
  }, [pathname])

  const handleRetry = () => {
    setIsLoading(true)
    // Trigger a re-check
    window.location.reload()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-300">Checking site status...</p>
          {retryCount > 0 && <p className="text-white/60 text-sm mt-2">Retry attempt {retryCount}</p>}
        </div>
      </div>
    )
  }

  // Allow admin routes to bypass maintenance
  const isAdminRoute = pathname.startsWith("/admin-dashboard-management-panel") || pathname.startsWith("/dashboard") || pathname.startsWith("/2fa") || pathname.startsWith("/login")
  
  if (isMaintenanceMode && !isAdminRoute) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 shadow-2xl">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-600 rounded-full mb-6 animate-pulse">
                <Wrench className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-3">Under Maintenance</h1>
              <div className="flex items-center justify-center gap-2 text-orange-300 mb-4">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {maintenanceType === "global" ? "Site-wide maintenance" : "Page maintenance"}
                </span>
              </div>
            </div>

            <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-orange-200 text-sm leading-relaxed">
                    {maintenanceMessage ||
                      "This page is currently under maintenance. We apologize for the inconvenience."}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-white/70 text-sm">
                We're working hard to improve your experience. Please check back soon!
              </p>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleRetry}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25"
                >
                  <RefreshCw className="w-4 h-4" />
                  Check Again
                </button>

                {pathname !== "/" && (
                  <a
                    href="/"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white font-medium transition-all duration-300"
                  >
                    <Home className="w-4 h-4" />
                    Homepage
                  </a>
                )}
              </div>
            </div>

            {/* Status indicator */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <div className="flex items-center justify-center gap-2 text-xs text-white/50">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                <span>Maintenance mode active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { logActivity } from "@/lib/activity-logger"
import { sendMaintenanceModeNotification } from "@/lib/discord-webhook"

type SiteSettings = {
  title: string
  description: string
  logo: string
  favicon: string
  primaryColor: string
  secondaryColor: string
  footerText: string
  enableRegistration: boolean
  requireEmailVerification: boolean
  requireCaptcha: boolean
  autoResetTicketsDays: number
  maintenanceMode: boolean
  maintenanceMessage: string
  allowedMaintenanceDomains: string[]
  lastUpdated: string
  updatedBy: string
}

export default function SiteSettingsManager() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [maintenanceReason, setMaintenanceReason] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/admin/site-settings")
        if (response.ok) {
          const data = await response.json()
          setSettings(data)
        } else {
          toast({
            title: "Error",
            description: "Failed to load site settings",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error fetching site settings:", error)
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchSettings()
  }, [toast])

  const handleUpdateSettings = async () => {
    if (!settings) return

    try {
      setIsSubmitting(true)
      const response = await fetch("/api/admin/site-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        const updatedSettings = await response.json()
        setSettings(updatedSettings)

        // Log the activity
        await logActivity(updatedSettings.updatedBy, "Admin", "site_settings_updated", {
          settings: { ...updatedSettings, password: undefined },
        })

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

  const handleToggleMaintenanceMode = async () => {
    if (!settings) return

    const newMaintenanceMode = !settings.maintenanceMode

    try {
      setIsSubmitting(true)
      const updatedSettings = {
        ...settings,
        maintenanceMode: newMaintenanceMode,
      }

      const response = await fetch("/api/admin/site-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedSettings),
      })

      if (response.ok) {
        const result = await response.json()
        setSettings(result)

        // Send notification to Discord
        await sendMaintenanceModeNotification(newMaintenanceMode, result.updatedBy, maintenanceReason)

        // Log the activity
        await logActivity(result.updatedBy, "Admin", "maintenance_mode_changed", {
          enabled: newMaintenanceMode,
          reason: maintenanceReason,
        })

        toast({
          title: newMaintenanceMode ? "Maintenance Mode Enabled" : "Maintenance Mode Disabled",
          description: newMaintenanceMode
            ? "The site is now in maintenance mode. Only specified domains can access it."
            : "The site is now accessible to all users.",
        })

        setMaintenanceReason("")
      } else {
        toast({
          title: "Error",
          description: "Failed to update maintenance mode. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating maintenance mode:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <div className="text-center py-4">Loading site settings...</div>
  }

  if (!settings) {
    return <div className="text-center py-4">Failed to load site settings</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Site Settings</CardTitle>
        <CardDescription>Configure your website settings</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Site Title</Label>
              <Input
                id="title"
                value={settings.title}
                onChange={(e) => setSettings({ ...settings, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Site Description</Label>
              <Textarea
                id="description"
                value={settings.description}
                onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="footerText">Footer Text</Label>
              <Input
                id="footerText"
                value={settings.footerText}
                onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
              />
            </div>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="logo">Logo URL</Label>
              <Input
                id="logo"
                value={settings.logo}
                onChange={(e) => setSettings({ ...settings, logo: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="favicon">Favicon URL</Label>
              <Input
                id="favicon"
                value={settings.favicon}
                onChange={(e) => setSettings({ ...settings, favicon: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="primaryColor"
                    value={settings.primaryColor}
                    onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                  />
                  <div className="w-10 h-10 rounded-md border" style={{ backgroundColor: settings.primaryColor }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="secondaryColor"
                    value={settings.secondaryColor}
                    onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                  />
                  <div
                    className="w-10 h-10 rounded-md border"
                    style={{ backgroundColor: settings.secondaryColor }}
                  ></div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enableRegistration">Enable Registration</Label>
                <p className="text-sm text-muted-foreground">Allow new users to register on the site</p>
              </div>
              <Switch
                id="enableRegistration"
                checked={settings.enableRegistration}
                onCheckedChange={(checked) => setSettings({ ...settings, enableRegistration: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="requireEmailVerification">Require Email Verification</Label>
                <p className="text-sm text-muted-foreground">
                  New users must verify their email before accessing the site
                </p>
              </div>
              <Switch
                id="requireEmailVerification"
                checked={settings.requireEmailVerification}
                onCheckedChange={(checked) => setSettings({ ...settings, requireEmailVerification: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="requireCaptcha">Require CAPTCHA</Label>
                <p className="text-sm text-muted-foreground">
                  Require CAPTCHA verification during registration to prevent bots
                </p>
              </div>
              <Switch
                id="requireCaptcha"
                checked={settings.requireCaptcha}
                onCheckedChange={(checked) => setSettings({ ...settings, requireCaptcha: checked })}
              />
            </div>
          </TabsContent>

          <TabsContent value="maintenance" className="space-y-4">
            <div className="p-4 border rounded-lg bg-amber-50 dark:bg-amber-950">
              <h3 className="text-lg font-medium mb-2">Maintenance Mode</h3>
              <p className="text-sm mb-4">
                When maintenance mode is enabled, the site will be inaccessible to regular users. Only users accessing
                the site from allowed domains will be able to view it.
              </p>

              <div className="flex items-center justify-between mb-4">
                <div className="space-y-0.5">
                  <Label htmlFor="maintenanceMode">Enable Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    {settings.maintenanceMode
                      ? "The site is currently in maintenance mode"
                      : "The site is currently accessible to all users"}
                  </p>
                </div>
                <Switch
                  id="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onCheckedChange={() => handleToggleMaintenanceMode()}
                />
              </div>

              <div className="space-y-2 mb-4">
                <Label htmlFor="maintenanceMessage">Maintenance Message</Label>
                <Textarea
                  id="maintenanceMessage"
                  value={settings.maintenanceMessage}
                  onChange={(e) => setSettings({ ...settings, maintenanceMessage: e.target.value })}
                  placeholder="We're currently performing maintenance. Please check back later."
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2 mb-4">
                <Label htmlFor="maintenanceReason">Reason for Maintenance (for logs)</Label>
                <Input
                  id="maintenanceReason"
                  value={maintenanceReason}
                  onChange={(e) => setMaintenanceReason(e.target.value)}
                  placeholder="e.g., Server upgrades, Database migration"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="allowedMaintenanceDomains">Allowed Domains During Maintenance</Label>
                <Input
                  id="allowedMaintenanceDomains"
                  value={settings.allowedMaintenanceDomains?.join(", ") || "danidemamaintenence.vercel.app"}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      allowedMaintenanceDomains: e.target.value.split(",").map((domain) => domain.trim()),
                    })
                  }
                  placeholder="e.g., danidemamaintenence.vercel.app"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Comma-separated list of domains that can access the site during maintenance
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="support" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="autoResetTicketsDays">Auto-Reset Tickets (Days)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="autoResetTicketsDays"
                  type="number"
                  min="1"
                  max="30"
                  value={settings.autoResetTicketsDays}
                  onChange={(e) =>
                    setSettings({ ...settings, autoResetTicketsDays: Number.parseInt(e.target.value) || 3 })
                  }
                  className="max-w-[100px]"
                />
                <span className="text-sm text-muted-foreground">
                  Number of days before an unresolved ticket is automatically reset to "open" status
                </span>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end">
          <Button onClick={handleUpdateSettings} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        <div className="mt-4 text-xs text-muted-foreground">
          Last updated: {new Date(settings.lastUpdated).toLocaleString()} by {settings.updatedBy}
        </div>
      </CardContent>
    </Card>
  )
}

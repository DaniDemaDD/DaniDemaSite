"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

// Add these imports at the top with the other imports
import { Moon, Sun, Laptop } from "lucide-react"
import { useTheme } from "next-themes"

// Add this import
import { useSearchParams } from "next/navigation"

export default function SettingsPage() {
  const { user, isLoading, updateProfile, updatePassword, signOut } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    bio: "",
    avatar: "",
    language: "en",
    notifications: true,
    marketing: false,
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [isUpdating, setIsUpdating] = useState(false)

  // Inside the SettingsPage component, add this after the other useState hooks
  const { theme, setTheme } = useTheme()

  // Add this inside the component, after the other hooks
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get("tab") || "profile"

  // Available avatar options
  const avatarOptions = [
    { value: "/default-avatar.png", label: "Default" },
    { value: "/placeholder.svg?height=64&width=64&text=A", label: "Letter A" },
    { value: "/placeholder.svg?height=64&width=64&text=B", label: "Letter B" },
    { value: "/placeholder.svg?height=64&width=64&text=C", label: "Letter C" },
    { value: "/placeholder.svg?height=64&width=64&text=D", label: "Letter D" },
  ]

  // Available language options
  const languageOptions = [
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
    { value: "it", label: "Italian" },
  ]

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/signin")
    } else if (user) {
      setProfileData({
        name: user.name,
        email: user.email,
        bio: user.bio || "",
        avatar: user.avatar || "/default-avatar.png",
        language: user.language || "en",
        notifications: user.preferences?.notifications || true,
        marketing: user.preferences?.marketing || false,
      })
    }
  }, [user, isLoading, router])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)

    try {
      const success = await updateProfile({
        name: profileData.name,
        bio: profileData.bio,
        avatar: profileData.avatar,
        language: profileData.language,
        preferences: {
          notifications: profileData.notifications,
          marketing: profileData.marketing,
          darkMode: theme === "dark",
        },
      })

      if (success) {
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
        })
      } else {
        toast({
          title: "Update failed",
          description: "Failed to update your profile. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Update failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation must match.",
        variant: "destructive",
      })
      return
    }

    setIsUpdating(true)

    try {
      const success = await updatePassword(passwordData.currentPassword, passwordData.newPassword)

      if (success) {
        toast({
          title: "Password updated",
          description: "Your password has been updated successfully.",
        })
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
      } else {
        toast({
          title: "Update failed",
          description: "Current password is incorrect or there was an error.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Update failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
  }

  // Get initials for avatar fallback
  const initials = profileData.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)

  if (isLoading) {
    return <div className="container py-10 text-center">Loading...</div>
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Settings</h1>
          <Button variant="outline" onClick={() => router.push("/profile")}>
            Back to Profile
          </Button>
        </div>

        <Tabs defaultValue={defaultTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your profile information</CardDescription>
              </CardHeader>
              <form onSubmit={handleProfileUpdate}>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <Label>Profile Picture</Label>
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={profileData.avatar || "/placeholder.svg"} alt={profileData.name} />
                        <AvatarFallback className="text-lg">{initials}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1 flex-1">
                        <Select
                          value={profileData.avatar}
                          onValueChange={(value) => setProfileData({ ...profileData, avatar: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select an avatar" />
                          </SelectTrigger>
                          <SelectContent>
                            {avatarOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-sm text-muted-foreground">Or enter a custom URL for your profile picture</p>
                        <Input
                          placeholder="URL to your profile picture"
                          value={
                            !avatarOptions.some((option) => option.value === profileData.avatar)
                              ? profileData.avatar
                              : ""
                          }
                          onChange={(e) => setProfileData({ ...profileData, avatar: e.target.value })}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="m@example.com" value={profileData.email} disabled />
                    <p className="text-sm text-muted-foreground">Email cannot be changed</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself"
                      className="min-h-[100px]"
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select
                      value={profileData.language}
                      onValueChange={(value) => setProfileData({ ...profileData, language: value })}
                    >
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Select a language" />
                      </SelectTrigger>
                      <SelectContent>
                        {languageOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isUpdating}>
                    {isUpdating ? "Saving..." : "Save changes"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your password</CardDescription>
              </CardHeader>
              <form onSubmit={handlePasswordUpdate}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isUpdating}>
                    {isUpdating ? "Updating..." : "Update password"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>Manage your notification and communication preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="notifications" className="text-base">
                        Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">Receive notifications about updates and activity</p>
                    </div>
                    <Switch
                      id="notifications"
                      checked={profileData.notifications}
                      onCheckedChange={(checked) => setProfileData({ ...profileData, notifications: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="marketing" className="text-base">
                        Marketing emails
                      </Label>
                      <p className="text-sm text-muted-foreground">Receive emails about new features and offers</p>
                    </div>
                    <Switch
                      id="marketing"
                      checked={profileData.marketing}
                      onCheckedChange={(checked) => setProfileData({ ...profileData, marketing: checked })}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleProfileUpdate} disabled={isUpdating}>
                  {isUpdating ? "Saving..." : "Save preferences"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize how DaniDema looks on your device</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <div className="flex flex-wrap gap-4">
                    <Button
                      variant={theme === "light" ? "default" : "outline"}
                      className="flex items-center gap-2"
                      onClick={() => setTheme("light")}
                    >
                      <Sun className="h-4 w-4" />
                      Light
                    </Button>
                    <Button
                      variant={theme === "dark" ? "default" : "outline"}
                      className="flex items-center gap-2"
                      onClick={() => setTheme("dark")}
                    >
                      <Moon className="h-4 w-4" />
                      Dark
                    </Button>
                    <Button
                      variant={theme === "system" ? "default" : "outline"}
                      className="flex items-center gap-2"
                      onClick={() => setTheme("system")}
                    >
                      <Laptop className="h-4 w-4" />
                      System
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-t pt-4">
                  <h3 className="text-lg font-medium text-red-600 mb-2">Danger Zone</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Once you sign out, you will need to sign in again to access your account.
                  </p>
                  <Button variant="destructive" onClick={handleSignOut}>
                    Sign out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// This is a simple in-memory auth system for demonstration
// In a real app, you would use a database and proper auth system

import { SignJWT, jwtVerify } from "jose"
import { JWT_SECRET } from "./constants"

interface UserJwtPayload {
  jti: string
  iat: number
  email: string
  role: string
}

export async function createJWT(email: string, role: string) {
  const iat = Math.floor(Date.now() / 1000)
  const exp = iat + 60 * 60 * 24 * 7 // one week
  const jti = crypto.randomUUID()
  return await new SignJWT({ email: email, role })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(exp)
    .setIssuedAt(iat)
    .setIssuer("dani-dema.com")
    .setJti(jti)
    .sign(new TextEncoder().encode(JWT_SECRET))
}

export async function verifyJWT(token: string): Promise<UserJwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))

    if (typeof payload === "undefined") {
      return null
    }

    return payload as UserJwtPayload
  } catch (error) {
    console.error("JWT verification failed", error)
    return null
  }
}

export type UserRole = "creator" | "admin" | "user" | "banned" | "special"
export type UserStatus = "active" | "inactive" | "pending" | "banned" | "paused"

export type Permission =
  | "manage_users"
  | "manage_roles"
  | "manage_permissions"
  | "manage_software"
  | "manage_social"
  | "manage_ai"
  | "manage_site_settings"
  | "manage_support"

export type Role = {
  name: UserRole
  permissions: Permission[]
  canBeDeleted: boolean
  canChangePassword: boolean
  isActive: boolean
}

export type SupportRequest = {
  id: string
  userId: string
  subject: string
  message: string
  status: "open" | "in-progress" | "resolved" | "closed" | "redeemed"
  createdAt: string
  updatedAt: string
  responses: {
    id: string
    adminId: string
    message: string
    createdAt: string
  }[]
  autoResetDate?: string // Date when the ticket will auto-reset if not closed
}

export type User = {
  id: string
  name: string
  email: string
  role: string
  password?: string // In a real app, this would be hashed
  bio?: string
  avatar?: string
  theme?: string
  language?: string
  downloadedSoftware?: string[] // IDs of downloaded software
  preferences?: {
    notifications?: boolean
    marketing?: boolean
    darkMode?: boolean
  }
  status?: UserStatus
  ipAddress?: string
  lastLogin?: string
  registeredAt: string
  emailVerified: boolean
  verificationToken?: string
  resetPasswordToken?: string
  resetPasswordExpires?: string
  deleted: boolean // Flag to mark if user is deleted instead of actually removing
  bannedAt?: string // When the user was banned
  bannedBy?: string // Who banned the user
  banReason?: string // Reason for banning
}

export type SocialLink = {
  id: string
  name: string
  url: string
  icon: string
  color: string
}

export type Software = {
  id: string
  name: string
  description: string
  image: string
  tags: string[]
  demoUrl: string
  downloadUrl: string
  githubUrl: string
  createdAt: string
  updatedAt: string
  version: string
  downloads: number
}

export type AIResponse = {
  id: string
  keywords: string[]
  response: string
  createdAt: string
  updatedAt: string
}

// Add these fields to the SiteSettings type
export type SiteSettings = {
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

// Define roles and their permissions
export const roles: Record<UserRole, Role> = {
  creator: {
    name: "creator",
    permissions: [
      "manage_users",
      "manage_roles",
      "manage_permissions",
      "manage_software",
      "manage_social",
      "manage_ai",
      "manage_site_settings",
      "manage_support",
    ],
    canBeDeleted: false,
    canChangePassword: false,
    isActive: true,
  },
  admin: {
    name: "admin",
    permissions: [
      "manage_users",
      "manage_software",
      "manage_social",
      "manage_ai",
      "manage_site_settings",
      "manage_support",
    ],
    canBeDeleted: true,
    canChangePassword: true,
    isActive: true,
  },
  user: {
    name: "user",
    permissions: [],
    canBeDeleted: true,
    canChangePassword: true,
    isActive: true,
  },
  banned: {
    name: "banned",
    permissions: [],
    canBeDeleted: true,
    canChangePassword: true,
    isActive: false,
  },
  special: {
    name: "special",
    permissions: [],
    canBeDeleted: true,
    canChangePassword: true,
    isActive: true,
  },
}

// Get current date in ISO format
const getCurrentDate = () => new Date().toISOString()

// Generate a random token
const generateToken = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Add days to a date
const addDays = (date: Date, days: number) => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

// Update the siteSettings object to include maintenance mode settings
export const siteSettings: SiteSettings = {
  title: "DaniDema",
  description: "Explore DaniDema's AI assistant, software solutions, and connect on social media.",
  logo: "/logo.png",
  favicon: "/favicon.ico",
  primaryColor: "#3b82f6",
  secondaryColor: "#10b981",
  footerText: "© 2023 DaniDema. All rights reserved.",
  enableRegistration: true,
  requireEmailVerification: true,
  requireCaptcha: true,
  autoResetTicketsDays: 3,
  maintenanceMode: false,
  maintenanceMessage: "We're currently performing maintenance. Please check back later.",
  allowedMaintenanceDomains: ["danidemamaintenence.vercel.app"],
  lastUpdated: getCurrentDate(),
  updatedBy: "admin",
}

// In-memory stores (would be a database in production)
export const users: User[] = [
  {
    id: "1",
    name: "Demo User",
    email: "demo@example.com",
    password: "password123",
    bio: "This is a demo user account.",
    avatar: "/default-avatar.png", // Chrome-like default avatar
    downloadedSoftware: ["1", "3"], // User has downloaded Software One and Three
    preferences: {
      notifications: true,
      marketing: false,
      darkMode: true,
    },
    role: "user",
    status: "active",
    ipAddress: "192.168.1.1",
    lastLogin: getCurrentDate(),
    registeredAt: "2023-01-15T08:30:45.123Z",
    emailVerified: true,
    deleted: false,
  },
  {
    id: "admin",
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    bio: "Site administrator with full access.",
    avatar: "/admin-avatar.png",
    downloadedSoftware: ["1", "2", "3"],
    preferences: {
      notifications: true,
      marketing: false,
      darkMode: true,
    },
    role: "admin",
    status: "active",
    ipAddress: "192.168.1.100",
    lastLogin: getCurrentDate(),
    registeredAt: "2022-06-10T14:22:33.456Z",
    emailVerified: true,
    deleted: false,
  },
  {
    id: "creator",
    name: "Daniele DeMartini",
    email: "daniele@demartini.biz",
    password: "LorettaDaniele11$",
    bio: "Site creator with ultimate access.",
    avatar: "/creator-avatar.png",
    downloadedSoftware: ["1", "2", "3"],
    preferences: {
      notifications: true,
      marketing: false,
      darkMode: true,
    },
    role: "creator",
    status: "active",
    ipAddress: "192.168.1.200",
    lastLogin: getCurrentDate(),
    registeredAt: "2022-01-01T00:00:00.000Z",
    emailVerified: true,
    deleted: false,
  },
]

export const supportRequests: SupportRequest[] = [
  {
    id: "sr1",
    userId: "1",
    subject: "Login Issue",
    message: "I'm having trouble logging in to my account.",
    status: "open",
    createdAt: "2023-06-15T10:30:00.000Z",
    updatedAt: "2023-06-15T10:30:00.000Z",
    responses: [],
    autoResetDate: new Date(addDays(new Date("2023-06-15T10:30:00.000Z"), 3)).toISOString(),
  },
]

// Social links data
export const socialLinks: SocialLink[] = [
  {
    id: "1",
    name: "Instagram",
    url: "https://instagram.com/dani.dema_",
    icon: "Instagram",
    color: "bg-pink-600 dark:bg-pink-700",
  },
  {
    id: "2",
    name: "YouTube",
    url: "https://youtube.com/yessact",
    icon: "Youtube",
    color: "bg-red-600 dark:bg-red-700",
  },
  {
    id: "3",
    name: "GitHub",
    url: "https://github.com/DaniDemaDD",
    icon: "Github",
    color: "bg-gray-900 dark:bg-gray-800",
  },
  {
    id: "4",
    name: "Email",
    url: "mailto:danidemacontact@gmail.com",
    icon: "Mail",
    color: "bg-green-600 dark:bg-green-700",
  },
  {
    id: "5",
    name: "Guns.lol",
    url: "https://guns.lol/danidema",
    icon: "Link",
    color: "bg-blue-600 dark:bg-blue-700",
  },
  {
    id: "6",
    name: "Discord",
    url: "https://discord.com/dani.dema",
    icon: "MessageSquare",
    color: "bg-indigo-600 dark:bg-indigo-700",
  },
]

// Sample software data - would be in a database in production
export const softwareData: Software[] = [
  {
    id: "1",
    name: "CMDProtector",
    description:
      "CMDProtector is a versatile, cross-platform security utility designed for managing server access and user authentication. Built with both Windows Server and Linux Server in mind, it enhances server security with tools such as OTP authentication, PIN management, and administrative controls for owners.",
    image:
      "https://mlfk3cv5yvnx.i.optimole.com/cb:HA53.300ea/w:auto/h:auto/q:mauto/f:best/https://www.ninjaone.com/wp-content/uploads/2024/05/N1-0921-Windows-CMD-Commands-You-Need-to-Know-blog-image-2.png",
    tags: ["Security", "Server", "Authentication"],
    demoUrl: "#",
    downloadUrl: "https://github.com/DaniDemaDD/CMDProtector/releases",
    githubUrl: "https://github.com/DaniDemaDD/CMDProtector",
    createdAt: "2023-03-15T10:30:00.000Z",
    updatedAt: getCurrentDate(),
    version: "V1.0",
    downloads: 1245,
  },
  {
    id: "2",
    name: "THE-LAST-DS",
    description:
      'Copyright (C) [2025] [DaniDema] - All rights reserved.\n\nThis file is the sole property of DaniDema and contains confidential information.\n\nWARNING:\n\nThis file is NOT dangerous if used correctly. However, we strongly advise against sharing this file indiscriminately. Its uncontrolled distribution could compromise its effectiveness and safety.\n\nContents:\n\nThis file contains a modified version of d1sc0rd (say, "d1sc0rd m0dd@to"). This mod includes many hidden features that, if discovered and used correctly, can be extremely powerful.\n\nExample of advanced functionality:\n\nAbility to "unban" yourself from d1sc0rd servers (use at your own risk).\n\nInstallation:\n\nInstallation is similar to Vencord, but it is important to note that this is NOT Vencord. Carefully follow the instructions provided separately for proper installation and use.\n\nDisclaimer:\n\nUse of this mod is at your own risk. The author assumes no responsibility for any consequences resulting from improper use of this software. You are responsible for complying with d1sc0rd\'s terms of service and applicable laws.\n\nDo not run the installer as an Administrator!\n\nIf you get a warning that the app cannot be opened, click "Run Anyways". You may need to click "more info" to see this option.',
    image:
      "https://c10.patreonusercontent.com/4/patreon-media/p/campaign/10225360/e2bb1797c0c64d249cd84a694525dc36/eyJxIjoxMDAsIndlYnAiOjB9/1.jpeg?token-time=1747267200&token-hash=fFD1C7pqYXiIrpoOnn3J6TAu8yqDxm8-CnGuVbkrdTk%3D",
    tags: ["Discord", "Mod", "Tool"],
    demoUrl: "#",
    downloadUrl: "https://github.com/DaniDemaDD/THE-LAST-DS/releases",
    githubUrl: "https://github.com/DaniDemaDD/THE-LAST-DS/",
    createdAt: "2023-05-22T14:45:00.000Z",
    updatedAt: getCurrentDate(),
    version: "V1.5",
    downloads: 876,
  },
  {
    id: "3",
    name: "Software Three",
    description: "A mobile app for task management. Replace with your actual software details.",
    image: "/placeholder.svg?height=200&width=300",
    tags: ["Mobile", "Productivity"],
    demoUrl: "#",
    downloadUrl: "#",
    githubUrl: "#",
    createdAt: "2023-08-10T09:15:00.000Z",
    updatedAt: getCurrentDate(),
    version: "1.0.5",
    downloads: 2134,
  },
]

// AI responses for the AI assistant
export const aiResponses: AIResponse[] = [
  {
    id: "1",
    keywords: ["hello", "hi", "hey", "greetings"],
    response: "Hello! I'm DaniDema's AI assistant. How can I help you today?",
    createdAt: "2023-01-10T08:30:00.000Z",
    updatedAt: getCurrentDate(),
  },
  {
    id: "2",
    keywords: ["software", "download", "app", "application"],
    response:
      "DaniDema offers several software solutions for productivity, data analysis, and task management. You can browse and download them from the Software page.",
    createdAt: "2023-01-15T10:45:00.000Z",
    updatedAt: getCurrentDate(),
  },
  {
    id: "3",
    keywords: ["contact", "email", "reach", "message"],
    response:
      "You can contact DaniDema through the social links provided on this website or by submitting a support request from your account.",
    createdAt: "2023-02-05T14:20:00.000Z",
    updatedAt: getCurrentDate(),
  },
  {
    id: "4",
    keywords: ["account", "profile", "settings", "preferences"],
    response:
      "You can manage your account settings, update your profile, and set your preferences from the Settings page. Just click on the Settings icon in the navigation bar.",
    createdAt: "2023-02-20T11:10:00.000Z",
    updatedAt: getCurrentDate(),
  },
  {
    id: "5",
    keywords: ["password", "forgot", "reset", "change"],
    response:
      "You can change your password in the Settings page under the Password tab. If you forgot your password, use the 'Forgot password' link on the sign-in page.",
    createdAt: "2023-03-12T09:30:00.000Z",
    updatedAt: getCurrentDate(),
  },
  {
    id: "6",
    keywords: ["admin", "administrator", "support", "help"],
    response:
      "If you need administrator support, please submit a support request from your account. An admin will respond to your request as soon as possible.",
    createdAt: "2023-04-05T16:45:00.000Z",
    updatedAt: getCurrentDate(),
  },
]

// Email verification (simulated)
const sendVerificationEmail = async (email: string, token: string) => {
  console.log(`Sending verification email to ${email} with token ${token}`)
  // In a real app, this would send an actual email
  return true
}

// Password reset email (simulated)
const sendPasswordResetEmail = async (email: string, token: string) => {
  console.log(`Sending password reset email to ${email} with token ${token}`)
  // In a real app, this would send an actual email
  return true
}

// Check if user has permission
export function hasPermission(userRole: UserRole, permission: Permission): boolean {
  return roles[userRole].permissions.includes(permission)
}

// Check if a role can be deleted
export function canRoleBeDeleted(role: UserRole): boolean {
  return roles[role].canBeDeleted
}

// Check if a user's password can be changed by others
export function canPasswordBeChanged(role: UserRole): boolean {
  return roles[role].canChangePassword
}

// Check if a role is active
export function isRoleActive(role: UserRole): boolean {
  return roles[role].isActive
}

export async function signUp(name: string, email: string, password: string, ipAddress: string): Promise<User | null> {
  // Check if user already exists
  const existingUser = users.find((user) => user.email.toLowerCase() === email.toLowerCase() && !user.deleted)
  if (existingUser) {
    return null
  }

  const verificationToken = generateToken()

  // Create new user
  const newUser: User = {
    id: String(users.length + 1),
    name,
    email,
    password, // In a real app, this would be hashed
    avatar: "/default-avatar.png", // Chrome-like default avatar
    downloadedSoftware: [], // No downloaded software initially
    preferences: {
      notifications: true,
      marketing: true,
      darkMode: true,
    },
    role: "user", // Default role is user
    status: siteSettings.requireEmailVerification ? "pending" : "active",
    ipAddress,
    lastLogin: getCurrentDate(),
    registeredAt: getCurrentDate(),
    emailVerified: !siteSettings.requireEmailVerification,
    verificationToken: siteSettings.requireEmailVerification ? verificationToken : undefined,
    deleted: false,
  }

  users.push(newUser)

  // Send verification email if required
  if (siteSettings.requireEmailVerification) {
    await sendVerificationEmail(email, verificationToken!)
  }

  return newUser
}

export async function verifyEmail(token: string): Promise<boolean> {
  const userIndex = users.findIndex((user) => user.verificationToken === token && !user.deleted)
  if (userIndex === -1) {
    return false
  }

  users[userIndex].emailVerified = true
  users[userIndex].status = "active"
  users[userIndex].verificationToken = undefined

  return true
}

export async function requestPasswordReset(email: string): Promise<boolean> {
  const userIndex = users.findIndex((user) => user.email.toLowerCase() === email.toLowerCase() && !user.deleted)
  if (userIndex === -1) {
    return false
  }

  const resetToken = generateToken()
  const expires = new Date(Date.now() + 3600000) // 1 hour from now

  users[userIndex].resetPasswordToken = resetToken
  users[userIndex].resetPasswordExpires = expires.toISOString()

  await sendPasswordResetEmail(email, resetToken)

  return true
}

export async function resetPassword(token: string, newPassword: string): Promise<boolean> {
  const userIndex = users.findIndex(
    (user) =>
      user.resetPasswordToken === token &&
      user.resetPasswordExpires &&
      new Date(user.resetPasswordExpires) > new Date() &&
      !user.deleted,
  )

  if (userIndex === -1) {
    return false
  }

  users[userIndex].password = newPassword
  users[userIndex].resetPasswordToken = undefined
  users[userIndex].resetPasswordExpires = undefined

  return true
}

export async function signIn(email: string, password: string, ipAddress: string): Promise<User | null> {
  // Find user
  const user = users.find(
    (user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password && !user.deleted,
  )

  if (!user) {
    return null
  }

  // Check if user is active and role is active
  if (user.status !== "active" || !isRoleActive(user.role)) {
    return null
  }

  // Update last login and IP
  user.lastLogin = getCurrentDate()
  user.ipAddress = ipAddress

  return user
}

export async function signOut() {}

export async function getCurrentUser(): Promise<User | null> {
  const userId = ""
  if (!userId) {
    return null
  }

  const user = users.find((user) => user.id === userId && !user.deleted)
  return user || null
}

export async function updateUserProfile(userId: string, data: Partial<User>): Promise<User | null> {
  const userIndex = users.findIndex((user) => user.id === userId && !user.deleted)
  if (userIndex === -1) {
    return null
  }

  // Update user data (excluding password, role, and status for security)
  const { password, role, status, emailVerified, deleted, ...updateData } = data
  users[userIndex] = { ...users[userIndex], ...updateData }

  return users[userIndex]
}

export async function updateUserPassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
): Promise<boolean> {
  const userIndex = users.findIndex((user) => user.id === userId && !user.deleted)
  if (userIndex === -1) {
    return false
  }

  // Verify current password
  if (users[userIndex].password !== currentPassword) {
    return false
  }

  // Update password
  users[userIndex].password = newPassword
  return true
}

export async function downloadSoftware(userId: string, softwareId: string): Promise<boolean> {
  const userIndex = users.findIndex((user) => user.id === userId && !user.deleted)
  if (userIndex === -1) {
    return false
  }

  // Initialize downloadedSoftware array if it doesn't exist
  if (!users[userIndex].downloadedSoftware) {
    users[userIndex].downloadedSoftware = []
  }

  // Add software to downloaded list if not already there
  if (!users[userIndex].downloadedSoftware!.includes(softwareId)) {
    users[userIndex].downloadedSoftware!.push(softwareId)

    // Increment download count for the software
    const softwareIndex = softwareData.findIndex((s) => s.id === softwareId)
    if (softwareIndex !== -1) {
      softwareData[softwareIndex].downloads += 1
      softwareData[softwareIndex].updatedAt = getCurrentDate()
    }
  }

  return true
}

export async function getUserDownloadedSoftware(userId: string) {
  const user = users.find((user) => user.id === userId && !user.deleted)
  if (!user || !user.downloadedSoftware) {
    return []
  }

  return softwareData.filter((software) => user.downloadedSoftware!.includes(software.id))
}

// Admin functions
export async function getAllUsers(adminId: string): Promise<User[] | null> {
  const admin = users.find((user) => user.id === adminId && !user.deleted)
  if (!admin || (admin.role !== "admin" && admin.role !== "creator")) {
    return null
  }

  // Return all users (including deleted ones for record keeping) without passwords
  return users.map(({ password, resetPasswordToken, resetPasswordExpires, verificationToken, ...user }) => ({
    ...user,
    password: "********",
  }))
}

export async function getSupportRequests(adminId: string): Promise<SupportRequest[] | null> {
  const admin = users.find((user) => user.id === adminId && !user.deleted)
  if (!admin || (admin.role !== "admin" && admin.role !== "creator")) {
    return null
  }

  return supportRequests
}

export async function respondToSupportRequest(adminId: string, requestId: string, message: string): Promise<boolean> {
  const admin = users.find((user) => user.id === adminId && !user.deleted)
  if (!admin || (admin.role !== "admin" && admin.role !== "creator")) {
    return false
  }

  const requestIndex = supportRequests.findIndex((req) => req.id === requestId)
  if (requestIndex === -1) {
    return false
  }

  supportRequests[requestIndex].responses.push({
    id: `resp-${supportRequests[requestIndex].responses.length + 1}`,
    adminId,
    message,
    createdAt: getCurrentDate(),
  })

  supportRequests[requestIndex].status = "in-progress"
  supportRequests[requestIndex].updatedAt = getCurrentDate()

  // Reset the auto-reset date
  const resetDays = siteSettings.autoResetTicketsDays
  supportRequests[requestIndex].autoResetDate = new Date(addDays(new Date(), resetDays)).toISOString()

  return true
}

export async function updateSupportRequestStatus(
  adminId: string,
  requestId: string,
  status: "open" | "in-progress" | "resolved" | "closed" | "redeemed",
): Promise<boolean> {
  const admin = users.find((user) => user.id === adminId && !user.deleted)
  if (!admin || (admin.role !== "admin" && admin.role !== "creator")) {
    return false
  }

  const requestIndex = supportRequests.findIndex((req) => req.id === requestId)
  if (requestIndex === -1) {
    return false
  }

  supportRequests[requestIndex].status = status
  supportRequests[requestIndex].updatedAt = getCurrentDate()

  // If closed or redeemed, remove auto-reset date
  if (status === "closed" || status === "redeemed") {
    supportRequests[requestIndex].autoResetDate = undefined
  } else {
    // Otherwise reset the auto-reset date
    const resetDays = siteSettings.autoResetTicketsDays
    supportRequests[requestIndex].autoResetDate = new Date(addDays(new Date(), resetDays)).toISOString()
  }

  return true
}

export async function createSupportRequest(
  userId: string,
  subject: string,
  message: string,
): Promise<SupportRequest | null> {
  const user = users.find((u) => u.id === userId && !u.deleted)
  if (!user) {
    return null
  }

  const resetDays = siteSettings.autoResetTicketsDays
  const currentDate = getCurrentDate()

  const newRequest: SupportRequest = {
    id: `sr${supportRequests.length + 1}`,
    userId,
    subject,
    message,
    status: "open",
    createdAt: currentDate,
    updatedAt: currentDate,
    responses: [],
    autoResetDate: new Date(addDays(new Date(), resetDays)).toISOString(),
  }

  supportRequests.push(newRequest)
  return newRequest
}

export async function getUserSupportRequests(userId: string): Promise<SupportRequest[]> {
  const user = users.find((u) => u.id === userId && !u.deleted)
  if (!user) {
    return []
  }

  return supportRequests.filter((req) => req.userId === userId)
}

export async function getSupportRequestById(userId: string, requestId: string): Promise<SupportRequest | null> {
  const user = users.find((u) => u.id === userId && !u.deleted)
  if (!user) {
    return null
  }

  const request = supportRequests.find((req) => req.id === requestId && req.userId === userId)
  return request || null
}

export async function getAIResponse(query: string): Promise<string> {
  // Convert query to lowercase for case-insensitive matching
  const lowercaseQuery = query.toLowerCase()

  // Find a matching response based on keywords
  for (const item of aiResponses) {
    if (item.keywords.some((keyword) => lowercaseQuery.includes(keyword))) {
      return item.response
    }
  }

  // Default response if no keywords match
  return "I'm not sure how to help with that specific query. Could you try asking something about DaniDema's software, account settings, or how to get support?"
}

// Social links functions
export async function getSocialLinks(): Promise<SocialLink[]> {
  return socialLinks
}

export async function updateSocialLink(
  adminId: string,
  linkId: string,
  data: Partial<SocialLink>,
): Promise<SocialLink | null> {
  const admin = users.find((user) => user.id === adminId && !user.deleted)
  if (!admin || (admin.role !== "admin" && admin.role !== "creator")) {
    return null
  }

  const linkIndex = socialLinks.findIndex((link) => link.id === linkId)
  if (linkIndex === -1) {
    return null
  }

  socialLinks[linkIndex] = { ...socialLinks[linkIndex], ...data }
  return socialLinks[linkIndex]
}

export async function deleteSocialLink(adminId: string, linkId: string): Promise<boolean> {
  const admin = users.find((user) => user.id === adminId && !user.deleted)
  if (!admin || (admin.role !== "admin" && admin.role !== "creator")) {
    return false
  }

  const linkIndex = socialLinks.findIndex((link) => link.id === linkId)
  if (linkIndex === -1) {
    return false
  }

  socialLinks.splice(linkIndex, 1)
  return true
}

export async function addSocialLink(adminId: string, data: Omit<SocialLink, "id">): Promise<SocialLink | null> {
  const admin = users.find((user) => user.id === adminId && !user.deleted)
  if (!admin || (admin.role !== "admin" && admin.role !== "creator")) {
    return null
  }

  const newLink: SocialLink = {
    id: `${socialLinks.length + 1}`,
    ...data,
  }

  socialLinks.push(newLink)
  return newLink
}

// Role management functions
export async function getAllRoles(): Promise<Role[]> {
  return Object.values(roles)
}

export async function createRole(
  creatorId: string,
  name: string,
  permissions: Permission[],
  canBeDeleted = true,
  canChangePassword = true,
  isActive = true,
): Promise<Role | null> {
  const creator = users.find((user) => user.id === creatorId && !user.deleted && user.role === "creator")
  if (!creator) {
    return null
  }

  // Check if role already exists
  if (roles[name as UserRole]) {
    return null
  }

  const newRole: Role = {
    name: name as UserRole,
    permissions,
    canBeDeleted,
    canChangePassword,
    isActive,
  }

  roles[name as UserRole] = newRole
  return newRole
}

export async function updateRole(
  creatorId: string,
  roleName: UserRole,
  permissions: Permission[],
  isActive?: boolean,
): Promise<Role | null> {
  const creator = users.find((user) => user.id === creatorId && !user.deleted && user.role === "creator")
  if (!creator) {
    return null
  }

  // Check if role exists
  if (!roles[roleName]) {
    return null
  }

  // Cannot modify creator role permissions
  if (roleName === "creator") {
    return null
  }

  roles[roleName].permissions = permissions

  // Update isActive if provided
  if (isActive !== undefined) {
    roles[roleName].isActive = isActive
  }

  return roles[roleName]
}

export async function deleteRole(creatorId: string, roleName: UserRole): Promise<boolean> {
  const creator = users.find((user) => user.id === creatorId && !user.deleted && user.role === "creator")
  if (!creator) {
    return false
  }

  // Check if role exists and can be deleted
  if (!roles[roleName] || !roles[roleName].canBeDeleted) {
    return false
  }

  // Check if any users have this role
  const usersWithRole = users.filter((user) => user.role === roleName && !user.deleted)
  if (usersWithRole.length > 0) {
    return false // Cannot delete role that is in use
  }

  delete roles[roleName]
  return true
}

// Admin user management functions
export async function updateUserRole(adminId: string, userId: string, role: UserRole): Promise<boolean> {
  const admin = users.find((user) => user.id === adminId && !user.deleted)

  // Only creators can assign creator role, admins can assign admin or user roles
  if (
    !admin ||
    (admin.role !== "creator" && role === "creator") ||
    (admin.role !== "admin" && admin.role !== "creator")
  ) {
    return false
  }

  const userIndex = users.findIndex((user) => user.id === userId && !user.deleted)
  if (userIndex === -1) {
    return false
  }

  // Cannot change role of a creator unless you're also a creator
  if (users[userIndex].role === "creator" && admin.role !== "creator") {
    return false
  }

  users[userIndex].role = role

  // Update status if role is banned
  if (role === "banned") {
    users[userIndex].status = "paused"
    users[userIndex].bannedAt = getCurrentDate()
    users[userIndex].bannedBy = adminId
  }

  return true
}

export async function updateUserStatus(adminId: string, userId: string, status: UserStatus): Promise<boolean> {
  const admin = users.find((user) => user.id === adminId && !user.deleted)
  if (!admin || (admin.role !== "admin" && admin.role !== "creator")) {
    return false
  }

  const userIndex = users.findIndex((user) => user.id === userId && !user.deleted)
  if (userIndex === -1) {
    return false
  }

  // Cannot change status of a creator unless you're also a creator
  if (users[userIndex].role === "creator" && admin.role !== "creator") {
    return false
  }

  users[userIndex].status = status

  // If status is banned, update banned info
  if (status === "banned") {
    users[userIndex].role = "banned"
    users[userIndex].bannedAt = getCurrentDate()
    users[userIndex].bannedBy = adminId
  }

  return true
}

export async function banUser(adminId: string, userId: string, reason: string): Promise<boolean> {
  const admin = users.find((user) => user.id === adminId && !user.deleted)
  if (!admin || (admin.role !== "admin" && admin.role !== "creator")) {
    return false
  }

  const userIndex = users.findIndex((user) => user.id === userId && !user.deleted)
  if (userIndex === -1) {
    return false
  }

  // Cannot ban a creator
  if (users[userIndex].role === "creator") {
    return false
  }

  users[userIndex].role = "banned"
  users[userIndex].status = "banned"
  users[userIndex].bannedAt = getCurrentDate()
  users[userIndex].bannedBy = adminId
  users[userIndex].banReason = reason

  return true
}

export async function unbanUser(adminId: string, userId: string): Promise<boolean> {
  const admin = users.find((user) => user.id === adminId && !user.deleted)
  if (!admin || (admin.role !== "admin" && admin.role !== "creator")) {
    return false
  }

  const userIndex = users.findIndex((user) => user.id === userId && !user.deleted)
  if (userIndex === -1) {
    return false
  }

  if (users[userIndex].role !== "banned" && users[userIndex].status !== "banned") {
    return false // User is not banned
  }

  users[userIndex].role = "user"
  users[userIndex].status = "active"
  users[userIndex].bannedAt = undefined
  users[userIndex].bannedBy = undefined
  users[userIndex].banReason = undefined

  return true
}

export async function adminUpdateUserPassword(adminId: string, userId: string, newPassword: string): Promise<boolean> {
  const admin = users.find((user) => user.id === adminId && !user.deleted)
  if (!admin || (admin.role !== "admin" && admin.role !== "creator")) {
    return false
  }

  const userIndex = users.findIndex((user) => user.id === userId && !user.deleted)
  if (userIndex === -1) {
    return false
  }

  // Check if the target user's role allows password changes by others
  if (!canPasswordBeChanged(users[userIndex].role)) {
    return false
  }

  users[userIndex].password = newPassword
  return true
}

// Modified to mark as deleted instead of actually removing
export async function deleteUser(adminId: string, userId: string): Promise<boolean> {
  const admin = users.find((user) => user.id === adminId && !user.deleted)
  if (!admin || (admin.role !== "admin" && admin.role !== "creator") || adminId === userId) {
    return false
  }

  const userIndex = users.findIndex((user) => user.id === userId && !user.deleted)
  if (userIndex === -1) {
    return false
  }

  // Cannot delete a creator
  if (users[userIndex].role === "creator") {
    return false
  }

  // Mark as deleted instead of removing from array
  users[userIndex].deleted = true
  users[userIndex].status = "inactive"
  return true
}

// Software management functions
export async function getAllSoftware(): Promise<Software[]> {
  return softwareData
}

export async function getSoftwareById(id: string): Promise<Software | null> {
  return softwareData.find((software) => software.id === id) || null
}

export async function updateSoftware(
  adminId: string,
  softwareId: string,
  data: Partial<Software>,
): Promise<Software | null> {
  const admin = users.find((user) => user.id === adminId && !user.deleted)
  if (!admin || (admin.role !== "admin" && admin.role !== "creator")) {
    return null
  }

  const softwareIndex = softwareData.findIndex((software) => software.id === softwareId)
  if (softwareIndex === -1) {
    return null
  }

  // Update the software data
  softwareData[softwareIndex] = {
    ...softwareData[softwareIndex],
    ...data,
    updatedAt: getCurrentDate(),
  }

  return softwareData[softwareIndex]
}

export async function addSoftware(
  adminId: string,
  data: Omit<Software, "id" | "createdAt" | "updatedAt" | "downloads">,
): Promise<Software | null> {
  const admin = users.find((user) => user.id === adminId && !user.deleted)
  if (!admin || (admin.role !== "admin" && admin.role !== "creator")) {
    return null
  }

  const newSoftware: Software = {
    id: `${softwareData.length + 1}`,
    ...data,
    createdAt: getCurrentDate(),
    updatedAt: getCurrentDate(),
    downloads: 0,
  }

  softwareData.push(newSoftware)
  return newSoftware
}

export async function deleteSoftware(adminId: string, softwareId: string): Promise<boolean> {
  const admin = users.find((user) => user.id === adminId && !user.deleted)
  if (!admin || (admin.role !== "admin" && admin.role !== "creator")) {
    return false
  }

  const softwareIndex = softwareData.findIndex((software) => software.id === softwareId)
  if (softwareIndex === -1) {
    return false
  }

  softwareData.splice(softwareIndex, 1)
  return true
}

// AI response management functions
export async function getAllAIResponses(adminId: string): Promise<AIResponse[] | null> {
  const admin = users.find((user) => user.id === adminId && !user.deleted)
  if (!admin || (admin.role !== "admin" && admin.role !== "creator")) {
    return null
  }

  return aiResponses
}

export async function updateAIResponse(
  adminId: string,
  responseId: string,
  data: Partial<AIResponse>,
): Promise<AIResponse | null> {
  const admin = users.find((user) => user.id === adminId && !user.deleted)
  if (!admin || (admin.role !== "admin" && admin.role !== "creator")) {
    return null
  }

  const responseIndex = aiResponses.findIndex((response) => response.id === responseId)
  if (responseIndex === -1) {
    return null
  }

  // Update the AI response
  aiResponses[responseIndex] = {
    ...aiResponses[responseIndex],
    ...data,
    updatedAt: getCurrentDate(),
  }

  return aiResponses[responseIndex]
}

export async function addAIResponse(
  adminId: string,
  data: { keywords: string[]; response: string },
): Promise<AIResponse | null> {
  const admin = users.find((user) => user.id === adminId && !user.deleted)
  if (!admin || (admin.role !== "admin" && admin.role !== "creator")) {
    return null
  }

  const newResponse: AIResponse = {
    id: `${aiResponses.length + 1}`,
    keywords: data.keywords,
    response: data.response,
    createdAt: getCurrentDate(),
    updatedAt: getCurrentDate(),
  }

  aiResponses.push(newResponse)
  return newResponse
}

export async function deleteAIResponse(adminId: string, responseId: string): Promise<boolean> {
  const admin = users.find((user) => user.id === adminId && !user.deleted)
  if (!admin || (admin.role !== "admin" && admin.role !== "creator")) {
    return false
  }

  const responseIndex = aiResponses.findIndex((response) => response.id === responseId)
  if (responseIndex === -1) {
    return false
  }

  aiResponses.splice(responseIndex, 1)
  return true
}

// Site settings management
export async function getSiteSettings(): Promise<SiteSettings> {
  return siteSettings
}

export async function updateSiteSettings(adminId: string, data: Partial<SiteSettings>): Promise<SiteSettings | null> {
  const admin = users.find((user) => user.id === adminId && !user.deleted)
  if (!admin || (admin.role !== "admin" && admin.role !== "creator")) {
    return null
  }

  // Update site settings
  Object.assign(siteSettings, data, {
    lastUpdated: getCurrentDate(),
    updatedBy: admin.id,
  })

  return siteSettings
}

// Add function to set a special role for a user
export async function setSpecialRole(creatorId: string, userId: string): Promise<boolean> {
  const creator = users.find((user) => user.id === creatorId && !user.deleted && user.role === "creator")
  if (!creator) {
    return false
  }

  const userIndex = users.findIndex((user) => user.id === userId && !user.deleted)
  if (userIndex === -1) {
    return false
  }

  // Only creators can set the special role
  if (creator.role !== "creator") {
    return false
  }

  users[userIndex].role = "special"
  return true
}

// Check and reset tickets that haven't been closed
export async function checkAndResetTickets(): Promise<number> {
  const now = new Date()
  let resetCount = 0

  supportRequests.forEach((request) => {
    if (request.autoResetDate && new Date(request.autoResetDate) < now) {
      if (request.status !== "closed" && request.status !== "redeemed") {
        request.status = "open"
        request.updatedAt = getCurrentDate()

        // Set new auto-reset date
        const resetDays = siteSettings.autoResetTicketsDays
        request.autoResetDate = new Date(addDays(now, resetDays)).toISOString()

        resetCount++
      }
    }
  })

  return resetCount
}

export async function isAdmin(req: any): Promise<{ isAdmin: boolean; userId?: string }> {
  const userId = ""

  if (!userId) {
    return { isAdmin: false }
  }

  const user = users.find((user) => user.id === userId && !user.deleted)

  if (!user || (user.role !== "admin" && user.role !== "creator")) {
    return { isAdmin: false }
  }

  return { isAdmin: true, userId: user.id }
}

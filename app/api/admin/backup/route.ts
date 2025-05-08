import { type NextRequest, NextResponse } from "next/server"
import { isAdmin } from "@/lib/auth"
import { createBackup } from "@/lib/persistence"
import { logActivity } from "@/lib/activity-logger"

// In-memory store for backups (would be a database in production)
const backups: {
  id: string
  name: string
  data: string
  timestamp: number
  size: number
}[] = []

export async function GET(request: NextRequest) {
  const { isAdmin: isAuthorized, userId } = await isAdmin(request)

  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  // Return the backups without the data field to reduce payload size
  const backupsWithoutData = backups.map(({ id, name, timestamp, size }) => ({
    id,
    name,
    timestamp,
    size,
  }))

  return NextResponse.json(backupsWithoutData)
}

export async function POST(request: NextRequest) {
  const { isAdmin: isAuthorized, userId } = await isAdmin(request)

  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  try {
    const { data, name } = await request.json()

    // If data is provided, use it; otherwise, create a new backup
    const backupData = data || createBackup()
    const backupSize = new TextEncoder().encode(backupData).length

    const backup = {
      id: `backup_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      name: name || `Backup ${new Date().toLocaleString()}`,
      data: backupData,
      timestamp: Date.now(),
      size: backupSize,
    }

    backups.unshift(backup)

    // Log the activity
    await logActivity(userId || "unknown", "Admin", "backup_created", {
      backupId: backup.id,
      backupName: backup.name,
      backupSize,
    })

    // Return the backup without the data field
    const { data: _, ...backupWithoutData } = backup
    return NextResponse.json(backupWithoutData)
  } catch (error) {
    console.error("Error creating backup:", error)
    return NextResponse.json({ error: "Failed to create backup" }, { status: 500 })
  }
}

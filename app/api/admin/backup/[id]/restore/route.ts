import { type NextRequest, NextResponse } from "next/server"
import { isAdmin } from "@/lib/auth"
import { restoreBackup } from "@/lib/persistence"
import { logActivity } from "@/lib/activity-logger"

// In-memory store for backups (would be a database in production)
const backups: {
  id: string
  name: string
  data: string
  timestamp: number
  size: number
}[] = []

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const { isAdmin: isAuthorized, userId } = await isAdmin(request)

  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  try {
    const { id } = params

    // Find the backup
    const backup = backups.find((b) => b.id === id)

    if (!backup) {
      return NextResponse.json({ error: "Backup not found" }, { status: 404 })
    }

    // Restore the backup
    const success = restoreBackup(backup.data)

    if (!success) {
      return NextResponse.json({ error: "Failed to restore backup" }, { status: 500 })
    }

    // Log the activity
    await logActivity(userId || "unknown", "Admin", "backup_restored", {
      backupId: backup.id,
      backupName: backup.name,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error restoring backup:", error)
    return NextResponse.json({ error: "Failed to restore backup" }, { status: 500 })
  }
}

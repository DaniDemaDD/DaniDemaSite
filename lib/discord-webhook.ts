/**
 * Discord Webhook Integration
 *
 * This module provides functions to send notifications to Discord via webhooks.
 */

// In a real application, this would be an environment variable
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || ""

/**
 * Send a notification to Discord
 *
 * @param content - The content of the message
 * @param embeds - Optional embeds to include in the message
 * @returns Whether the notification was sent successfully
 */
export async function sendDiscordNotification(content: string, embeds: any[] = []): Promise<boolean> {
  if (!DISCORD_WEBHOOK_URL) {
    console.log("Discord webhook URL not configured")
    return false
  }

  try {
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
        embeds,
      }),
    })

    return response.ok
  } catch (error) {
    console.error("Error sending Discord notification:", error)
    return false
  }
}

/**
 * Send a backup notification to Discord
 *
 * @param action - The action performed on the backup (created, restored, downloaded, uploaded, onedrive)
 * @param filename - The name of the backup file
 * @param username - The username of the user who performed the action
 * @returns Whether the notification was sent successfully
 */
export async function sendBackupNotification(
  action: "created" | "restored" | "downloaded" | "uploaded" | "onedrive",
  filename: string,
  username: string,
): Promise<boolean> {
  const actionText = {
    created: "created a new backup",
    restored: "restored a backup",
    downloaded: "downloaded a backup",
    uploaded: "uploaded a backup",
    onedrive: "saved a backup to OneDrive",
  }[action]

  const content = `**Backup ${action}**: ${username} ${actionText}: ${filename}`

  const embed = {
    title: `Backup ${action.charAt(0).toUpperCase() + action.slice(1)}`,
    description: `${username} ${actionText}`,
    fields: [
      {
        name: "Filename",
        value: filename,
      },
      {
        name: "Timestamp",
        value: new Date().toISOString(),
      },
    ],
    color: {
      created: 0x00ff00, // Green
      restored: 0xff9900, // Orange
      downloaded: 0x0099ff, // Blue
      uploaded: 0x9900ff, // Purple
      onedrive: 0x0066ff, // Light Blue
    }[action],
  }

  return sendDiscordNotification(content, [embed])
}

/**
 * Send a maintenance mode notification to Discord
 *
 * @param enabled - Whether maintenance mode was enabled or disabled
 * @param username - The username of the user who changed the maintenance mode
 * @param reason - The reason for the maintenance mode change
 * @returns Whether the notification was sent successfully
 */
export async function sendMaintenanceModeNotification(
  enabled: boolean,
  username: string,
  reason: string,
): Promise<boolean> {
  const action = enabled ? "enabled" : "disabled"
  const content = `**Maintenance Mode ${action}**: ${username} ${action} maintenance mode`

  const embed = {
    title: `Maintenance Mode ${action.charAt(0).toUpperCase() + action.slice(1)}`,
    description: `${username} ${action} maintenance mode`,
    fields: [
      {
        name: "Reason",
        value: reason || "No reason provided",
      },
      {
        name: "Timestamp",
        value: new Date().toISOString(),
      },
    ],
    color: enabled ? 0xff0000 : 0x00ff00, // Red for enabled, green for disabled
  }

  return sendDiscordNotification(content, [embed])
}

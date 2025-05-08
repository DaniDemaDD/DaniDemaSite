/**
 * Activity Logger
 *
 * This module provides functions to log user activities for auditing and monitoring purposes.
 */

type ActivityType =
  | "login"
  | "logout"
  | "signup"
  | "password_reset"
  | "profile_update"
  | "role_change"
  | "user_ban"
  | "user_unban"
  | "user_delete"
  | "backup_created"
  | "backup_restored"
  | "backup_downloaded"
  | "backup_uploaded"
  | "backup_saved_to_onedrive"
  | "maintenance_mode_changed"
  | "site_settings_updated"
  | "software_added"
  | "software_updated"
  | "software_deleted"
  | "social_link_added"
  | "social_link_updated"
  | "social_link_deleted"
  | "ai_response_added"
  | "ai_response_updated"
  | "ai_response_deleted"
  | "support_request_responded"
  | "support_request_status_changed"

type ActivityLog = {
  id: string
  userId: string
  username: string
  activityType: ActivityType
  details: Record<string, any>
  timestamp: string
  ipAddress?: string
  userAgent?: string
}

// In-memory store for activity logs (would be a database in production)
const activityLogs: ActivityLog[] = []

/**
 * Log a user activity
 *
 * @param userId - The ID of the user performing the action
 * @param username - The username of the user performing the action
 * @param activityType - The type of activity being performed
 * @param details - Additional details about the activity
 * @param ipAddress - The IP address of the user (optional)
 * @param userAgent - The user agent of the user (optional)
 * @returns The created activity log
 */
export async function logActivity(
  userId: string,
  username: string,
  activityType: ActivityType,
  details: Record<string, any> = {},
  ipAddress?: string,
  userAgent?: string,
): Promise<ActivityLog> {
  const activityLog: ActivityLog = {
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    userId,
    username,
    activityType,
    details,
    timestamp: new Date().toISOString(),
    ipAddress,
    userAgent,
  }

  // Store the activity log
  activityLogs.push(activityLog)

  // In a real application, you would save this to a database
  console.log(`Activity logged: ${activityType} by ${username}`)

  return activityLog
}

/**
 * Get all activity logs
 *
 * @param limit - The maximum number of logs to return
 * @param offset - The number of logs to skip
 * @returns The activity logs
 */
export async function getActivityLogs(limit = 100, offset = 0): Promise<ActivityLog[]> {
  return activityLogs
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(offset, offset + limit)
}

/**
 * Get activity logs for a specific user
 *
 * @param userId - The ID of the user
 * @param limit - The maximum number of logs to return
 * @param offset - The number of logs to skip
 * @returns The activity logs for the user
 */
export async function getUserActivityLogs(userId: string, limit = 100, offset = 0): Promise<ActivityLog[]> {
  return activityLogs
    .filter((log) => log.userId === userId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(offset, offset + limit)
}

/**
 * Get activity logs for a specific activity type
 *
 * @param activityType - The type of activity
 * @param limit - The maximum number of logs to return
 * @param offset - The number of logs to skip
 * @returns The activity logs for the activity type
 */
export async function getActivityLogsByType(
  activityType: ActivityType,
  limit = 100,
  offset = 0,
): Promise<ActivityLog[]> {
  return activityLogs
    .filter((log) => log.activityType === activityType)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(offset, offset + limit)
}

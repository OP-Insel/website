/**
 * Dieses Skript generiert Statistiken für einzelne Benutzer
 * Es kann verwendet werden, um Benutzerprofile mit Statistiken anzureichern
 */

import { getUsers, getContent, getActivityLog } from "../lib/store"

// Generiere Statistiken für einen bestimmten Benutzer
function generateUserStats(userId: string) {
  const user = getUsers().find((u) => u.id === userId)
  if (!user) {
    console.error(`Benutzer mit ID ${userId} nicht gefunden.`)
    return null
  }

  const logs = getActivityLog()
  const content = getContent()

  // Benutzeraktivitäten
  const userLogs = logs.filter((log) => log.userId === userId)

  // Vom Benutzer erstellte Inhalte
  const userContent = content.filter((item) => item.createdBy === userId)

  // Aktivitäten nach Typ
  const activityTypes: Record<string, number> = {}
  userLogs.forEach((log) => {
    activityTypes[log.type] = (activityTypes[log.type] || 0) + 1
  })

  // Inhalte nach Typ
  const contentTypes: Record<string, number> = {}
  userContent.forEach((item) => {
    contentTypes[item.type] = (contentTypes[item.type] || 0) + 1
  })

  // Berechne Aktivität pro Monat (letzte 6 Monate)
  const now = new Date()
  const monthlyActivity: Record<string, number> = {}

  for (let i = 0; i < 6; i++) {
    const month = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthString = `${month.getFullYear()}-${(month.getMonth() + 1).toString().padStart(2, "0")}`
    monthlyActivity[monthString] = 0
  }

  userLogs.forEach((log) => {
    const logDate = new Date(log.timestamp)
    const monthString = `${logDate.getFullYear()}-${(logDate.getMonth() + 1).toString().padStart(2, "0")}`
    if (monthlyActivity[monthString] !== undefined) {
      monthlyActivity[monthString]++
    }
  })

  // Erstelle die Benutzerstatistiken
  const stats = {
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      points: user.points,
      createdAt: user.createdAt,
      daysActive: Math.floor((new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)),
    },
    activity: {
      total: userLogs.length,
      byType: activityTypes,
      monthly: monthlyActivity,
      lastActive: userLogs.length > 0 ? userLogs[0].timestamp : user.createdAt,
    },
    content: {
      total: userContent.length,
      byType: contentTypes,
    },
    pointsHistory: {
      total: user.pointsHistory.length,
      gained: user.pointsHistory.filter((p) => p.amount > 0).reduce((sum, p) => sum + p.amount, 0),
      lost: user.pointsHistory.filter((p) => p.amount < 0).reduce((sum, p) => sum + p.amount, 0),
    },
  }

  console.log(`Statistiken für Benutzer ${user.username}:`, stats)
  return stats
}

// Beispielaufruf für einen bestimmten Benutzer
// generateUserStats("userId");

// Generiere Statistiken für alle Benutzer
function generateAllUserStats() {
  const users = getUsers()
  const allStats = users.map((user) => generateUserStats(user.id))

  console.log(`Statistiken für ${users.length} Benutzer wurden generiert.`)
  return allStats
}

generateAllUserStats()


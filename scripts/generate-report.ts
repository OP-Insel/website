/**
 * Dieses Skript generiert einen Bericht über die Systemnutzung
 * Es kann verwendet werden, um regelmäßige Berichte für Administratoren zu erstellen
 */

import { getUsers, getContent, getActivityLog } from "../lib/store"

// Generiere einen Bericht über die Systemnutzung
function generateReport() {
  const users = getUsers()
  const content = getContent()
  const logs = getActivityLog()

  // Zeitraum für den Bericht (letzter Monat)
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const endOfMonth = new Date(now.getFullYear(), now.getMonth(), 0)

  // Filtere Aktivitäten für den letzten Monat
  const monthlyLogs = logs.filter((log) => {
    const logDate = new Date(log.timestamp)
    return logDate >= startOfMonth && logDate <= endOfMonth
  })

  // Zähle neue Benutzer im letzten Monat
  const newUsers = users.filter((user) => {
    const createdDate = new Date(user.createdAt)
    return createdDate >= startOfMonth && createdDate <= endOfMonth
  })

  // Zähle neue Inhalte im letzten Monat
  const newContent = content.filter((item) => {
    const createdDate = new Date(item.createdAt)
    return createdDate >= startOfMonth && createdDate <= endOfMonth
  })

  // Zähle Aktivitäten nach Typ
  const activityTypes: Record<string, number> = {}
  monthlyLogs.forEach((log) => {
    activityTypes[log.type] = (activityTypes[log.type] || 0) + 1
  })

  // Erstelle den Bericht
  const report = {
    period: {
      start: startOfMonth.toISOString().split("T")[0],
      end: endOfMonth.toISOString().split("T")[0],
    },
    summary: {
      totalUsers: users.length,
      newUsers: newUsers.length,
      activeUsers: users.filter((u) => !u.banned && u.approved).length,
      totalContent: content.length,
      newContent: newContent.length,
      totalActivities: monthlyLogs.length,
    },
    activityBreakdown: activityTypes,
    topContributors: getTopContributors(monthlyLogs),
  }

  // Konvertiere den Bericht in einen JSON-String
  const reportJson = JSON.stringify(report, null, 2)

  // Erstelle einen Dateinamen mit Zeitstempel
  const monthYear = `${startOfMonth.getFullYear()}-${(startOfMonth.getMonth() + 1).toString().padStart(2, "0")}`
  const filename = `op-insel-report-${monthYear}.json`

  // Erstelle einen Blob und einen Download-Link
  const blob = new Blob([reportJson], { type: "application/json" })
  const url = URL.createObjectURL(blob)

  // Erstelle einen Link-Element und klicke darauf, um den Download zu starten
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()

  // Bereinige
  setTimeout(() => {
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, 0)

  console.log(`Bericht wurde generiert: ${filename}`)
  return true
}

// Hilfsfunktion: Ermittle die Top-Beitragenden basierend auf Aktivitäten
function getTopContributors(logs: any[]) {
  const userActivities: Record<string, number> = {}

  logs.forEach((log) => {
    if (log.userId !== "system") {
      userActivities[log.userId] = (userActivities[log.userId] || 0) + 1
    }
  })

  const topContributors = Object.entries(userActivities)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([userId, count]) => {
      const user = getUsers().find((u) => u.id === userId)
      return {
        userId,
        username: user?.username || "Unknown",
        role: user?.role || "Unknown",
        activityCount: count,
      }
    })

  return topContributors
}

generateReport()


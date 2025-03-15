/**
 * Dieses Skript analysiert die Daten und gibt Statistiken aus
 * Es kann verwendet werden, um Einblicke in die Nutzung der Anwendung zu erhalten
 */

import { getUsers, getContent, getActivityLog } from "../lib/store"

// Analysiere Benutzerdaten
function analyzeUsers() {
  const users = getUsers()

  // Zähle Benutzer nach Rolle
  const roleCount: Record<string, number> = {}
  users.forEach((user) => {
    roleCount[user.role] = (roleCount[user.role] || 0) + 1
  })

  // Berechne durchschnittliche Punkte
  const totalPoints = users.reduce((sum, user) => sum + (user.points || 0), 0)
  const averagePoints = users.length > 0 ? totalPoints / users.length : 0

  // Zähle aktive und inaktive Benutzer
  const activeUsers = users.filter((user) => !user.banned && user.approved).length
  const bannedUsers = users.filter((user) => user.banned).length
  const pendingUsers = users.filter((user) => !user.approved).length

  console.log("=== Benutzerstatistiken ===")
  console.log(`Gesamtbenutzer: ${users.length}`)
  console.log(`Aktive Benutzer: ${activeUsers}`)
  console.log(`Gesperrte Benutzer: ${bannedUsers}`)
  console.log(`Ausstehende Benutzer: ${pendingUsers}`)
  console.log(`Durchschnittliche Punkte: ${averagePoints.toFixed(2)}`)
  console.log("Benutzer nach Rolle:")
  for (const role in roleCount) {
    console.log(`  ${role}: ${roleCount[role]}`)
  }
}

// Analysiere Inhaltsdaten
function analyzeContent() {
  const content = getContent()

  // Zähle Inhalte nach Typ
  const typeCount: Record<string, number> = {}
  content.forEach((item) => {
    typeCount[item.type] = (typeCount[item.type] || 0) + 1
  })

  // Zähle Inhalte nach Ersteller
  const creatorCount: Record<string, number> = {}
  content.forEach((item) => {
    creatorCount[item.createdBy] = (creatorCount[item.createdBy] || 0) + 1
  })

  console.log("\n=== Inhaltsstatistiken ===")
  console.log(`Gesamtinhalte: ${content.length}`)
  console.log("Inhalte nach Typ:")
  for (const type in typeCount) {
    console.log(`  ${type}: ${typeCount[type]}`)
  }
  console.log("Top-Ersteller:")
  const topCreators = Object.entries(creatorCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
  topCreators.forEach(([creatorId, count], index) => {
    const creator = getUsers().find((user) => user.id === creatorId)
    console.log(`  ${index + 1}. ${creator?.username || creatorId}: ${count} Inhalte`)
  })
}

// Analysiere Aktivitätsprotokolle
function analyzeActivityLogs() {
  const logs = getActivityLog()

  // Zähle Aktivitäten nach Typ
  const typeCount: Record<string, number> = {}
  logs.forEach((log) => {
    typeCount[log.type] = (typeCount[log.type] || 0) + 1
  })

  // Berechne Aktivitäten pro Tag (letzte 7 Tage)
  const now = new Date()
  const sevenDaysAgo = new Date(now)
  sevenDaysAgo.setDate(now.getDate() - 7)

  const dailyActivity: Record<string, number> = {}
  for (let i = 0; i < 7; i++) {
    const date = new Date(now)
    date.setDate(now.getDate() - i)
    const dateString = date.toISOString().split("T")[0]
    dailyActivity[dateString] = 0
  }

  logs.forEach((log) => {
    const logDate = new Date(log.timestamp)
    if (logDate >= sevenDaysAgo) {
      const dateString = logDate.toISOString().split("T")[0]
      if (dailyActivity[dateString] !== undefined) {
        dailyActivity[dateString]++
      }
    }
  })

  console.log("\n=== Aktivitätsstatistiken ===")
  console.log(`Gesamtaktivitäten: ${logs.length}`)
  console.log("Aktivitäten nach Typ:")
  for (const type in typeCount) {
    console.log(`  ${type}: ${typeCount[type]}`)
  }
  console.log("Aktivitäten pro Tag (letzte 7 Tage):")
  for (const date in dailyActivity) {
    console.log(`  ${date}: ${dailyActivity[date]} Aktivitäten`)
  }
}

// Führe alle Analysefunktionen aus
analyzeUsers()
analyzeContent()
analyzeActivityLogs()

console.log("\nDatenanalyse abgeschlossen!")


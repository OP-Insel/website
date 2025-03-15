/**
 * Dieses Skript bereinigt alte oder ungültige Daten
 * Es sollte regelmäßig ausgeführt werden, um die Datenbank sauber zu halten
 */

import { getUsers, saveUsers, getActivityLog, saveActivityLog } from "../lib/store"

// Bereinige alte Aktivitätsprotokolle (älter als 30 Tage)
function cleanActivityLogs() {
  const logs = getActivityLog()
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const filteredLogs = logs.filter((log) => {
    const logDate = new Date(log.timestamp)
    return logDate >= thirtyDaysAgo
  })

  if (filteredLogs.length !== logs.length) {
    saveActivityLog(filteredLogs)
    console.log(`${logs.length - filteredLogs.length} alte Aktivitätsprotokolle wurden bereinigt.`)
  } else {
    console.log("Keine alten Aktivitätsprotokolle gefunden.")
  }
}

// Bereinige ungültige Benutzer (z.B. ohne Benutzernamen oder mit ungültigen Rollen)
function cleanInvalidUsers() {
  const users = getUsers()

  const validUsers = users.filter((user) => {
    return user.username && user.id && user.role
  })

  if (validUsers.length !== users.length) {
    saveUsers(validUsers)
    console.log(`${users.length - validUsers.length} ungültige Benutzer wurden bereinigt.`)
  } else {
    console.log("Keine ungültigen Benutzer gefunden.")
  }
}

// Führe alle Bereinigungsfunktionen aus
cleanActivityLogs()
cleanInvalidUsers()

console.log("Datenbereinigung abgeschlossen!")


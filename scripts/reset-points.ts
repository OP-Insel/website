/**
 * Dieses Skript setzt die Punkte aller Benutzer zurück
 * Es sollte am Anfang jedes Monats ausgeführt werden
 */

import { getUsers, saveUsers, addActivityLogEntry } from "../lib/store"

// Setze die Punkte aller Benutzer zurück
function resetPoints() {
  const users = getUsers()
  const now = new Date().toISOString()

  const updatedUsers = users.map((user) => {
    // Erstelle einen Eintrag im Punkteverlauf
    const historyEntry = {
      amount: -user.points,
      reason: "Monatlicher Punktereset",
      timestamp: now,
      awardedBy: "System",
    }

    // Setze Punkte zurück, behalte aber die aktuelle Rolle bei
    return {
      ...user,
      points: 0,
      pointsHistory: [historyEntry, ...user.pointsHistory],
      lastPointReset: now,
    }
  })

  saveUsers(updatedUsers)

  // Protokolliere den Reset
  addActivityLogEntry({
    id: Date.now().toString(),
    type: "system_points_reset",
    userId: "system",
    username: "System",
    timestamp: now,
    details: "Monatlicher Punktereset durchgeführt",
  })

  console.log("Punkte wurden für alle Benutzer zurückgesetzt!")
  return true
}

resetPoints()


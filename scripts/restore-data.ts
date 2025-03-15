/**
 * Dieses Skript stellt Daten aus einem Backup wieder her
 * Es sollte nur verwendet werden, wenn Daten wiederhergestellt werden müssen
 */

// Stelle Daten aus einem Backup wieder her
function restoreData(backupJson: string) {
  try {
    // Parse das Backup-JSON
    const backup = JSON.parse(backupJson)

    // Lösche alle vorhandenen Daten im localStorage
    localStorage.clear()

    // Stelle alle Daten aus dem Backup wieder her
    for (const key in backup) {
      localStorage.setItem(key, backup[key])
    }

    console.log("Daten wurden erfolgreich wiederhergestellt!")
    return true
  } catch (error) {
    console.error("Fehler beim Wiederherstellen der Daten:", error)
    return false
  }
}

// Diese Funktion würde in einer realen Anwendung mit einer Dateiauswahl-UI aufgerufen werden
// restoreData(backupJsonString);


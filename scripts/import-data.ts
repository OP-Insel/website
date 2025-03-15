/**
 * Dieses Skript importiert Daten aus einer JSON-Datei
 * Es kann verwendet werden, um Daten wiederherzustellen oder zu migrieren
 */

// Importiere Daten aus einer JSON-Datei
function importData(jsonData: string) {
  try {
    // Parse die JSON-Daten
    const data = JSON.parse(jsonData)

    // Importiere die Daten in den localStorage
    for (const key in data) {
      localStorage.setItem(key, JSON.stringify(data[key]))
    }

    console.log("Daten wurden erfolgreich importiert!")
    return true
  } catch (error) {
    console.error("Fehler beim Importieren der Daten:", error)
    return false
  }
}

// Diese Funktion würde in einer realen Anwendung mit einer Dateiauswahl-UI aufgerufen werden
// importData(jsonDataString);


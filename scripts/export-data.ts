/**
 * Dieses Skript exportiert alle Daten in eine JSON-Datei
 * Es kann verwendet werden, um Daten zu sichern oder zu migrieren
 */

// Exportiere alle Daten aus dem localStorage
function exportData() {
  const data: Record<string, any> = {}

  // Sammle alle Daten aus dem localStorage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key) {
      try {
        const value = localStorage.getItem(key)
        if (value) {
          data[key] = JSON.parse(value)
        }
      } catch (error) {
        console.error(`Fehler beim Parsen von ${key}:`, error)
        const value = localStorage.getItem(key)
        if (value) {
          data[key] = value
        }
      }
    }
  }

  // Erstelle einen Dateinamen mit Zeitstempel
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
  const filename = `op-insel-export-${timestamp}.json`

  // Konvertiere die Daten in einen JSON-String
  const dataJson = JSON.stringify(data, null, 2)

  // Erstelle einen Blob und einen Download-Link
  const blob = new Blob([dataJson], { type: "application/json" })
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

  console.log(`Daten wurden exportiert: ${filename}`)
  return true
}

exportData()


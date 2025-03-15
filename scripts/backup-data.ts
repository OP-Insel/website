/**
 * Dieses Skript erstellt ein Backup aller Daten im localStorage
 * Es sollte regelmäßig ausgeführt werden, um Datenverlust zu vermeiden
 */

// Erstelle ein Backup aller Daten im localStorage
function backupData() {
  const backup: Record<string, string> = {}

  // Sammle alle Daten aus dem localStorage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key) {
      const value = localStorage.getItem(key)
      if (value) {
        backup[key] = value
      }
    }
  }

  // Erstelle einen Dateinamen mit Zeitstempel
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
  const filename = `op-insel-backup-${timestamp}.json`

  // Konvertiere das Backup in einen JSON-String
  const backupJson = JSON.stringify(backup, null, 2)

  // Erstelle einen Blob und einen Download-Link
  const blob = new Blob([backupJson], { type: "application/json" })
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

  console.log(`Backup wurde erstellt: ${filename}`)
  return true
}

backupData()


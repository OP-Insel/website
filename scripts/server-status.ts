/**
 * Dieses Skript überprüft den Status des Minecraft-Servers
 * Es kann verwendet werden, um den Server-Status zu überwachen und Benachrichtigungen zu senden
 */

// Überprüfe den Status des Minecraft-Servers
async function checkServerStatus(serverAddress = "opinsel.de") {
  try {
    // Verwende die mcsrvstat.us API, um den Server-Status abzufragen
    const response = await fetch(`https://api.mcsrvstat.us/2/${serverAddress}`)

    if (!response.ok) {
      throw new Error(`API-Fehler: ${response.status}`)
    }

    const data = await response.json()

    // Überprüfe, ob der Server online ist
    if (!data.online) {
      console.log(`Server ${serverAddress} ist offline!`)
      return {
        online: false,
        address: serverAddress,
        timestamp: new Date().toISOString(),
      }
    }

    // Server ist online, verarbeite die Daten
    const serverData = {
      online: true,
      address: serverAddress,
      version: data.version,
      players: {
        online: data.players?.online || 0,
        max: data.players?.max || 0,
        list: data.players?.list || [],
      },
      motd: data.motd?.clean?.join("\n") || "",
      timestamp: new Date().toISOString(),
    }

    console.log(
      `Server ${serverAddress} ist online mit ${serverData.players.online}/${serverData.players.max} Spielern.`,
    )
    return serverData
  } catch (err) {
    console.error("Fehler beim Abrufen des Server-Status:", err)
    return {
      online: false,
      address: serverAddress,
      error: String(err),
      timestamp: new Date().toISOString(),
    }
  }
}

// Überprüfe den Server-Status und speichere das Ergebnis
async function monitorServerStatus() {
  const status = await checkServerStatus()

  // Speichere den Status im localStorage
  const statusHistory = JSON.parse(localStorage.getItem("serverStatusHistory") || "[]")
  statusHistory.unshift(status)

  // Begrenze die Historie auf die letzten 100 Einträge
  if (statusHistory.length > 100) {
    statusHistory.length = 100
  }

  localStorage.setItem("serverStatusHistory", JSON.stringify(statusHistory))
  localStorage.setItem("currentServerStatus", JSON.stringify(status))

  console.log("Server-Status wurde aktualisiert und gespeichert.")
  return status
}

monitorServerStatus()


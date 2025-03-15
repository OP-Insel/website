/**
 * Dieses Skript migriert Daten von einem alten Format zu einem neuen Format
 * Es sollte verwendet werden, wenn sich die Datenstruktur ändert
 */

import { getUsers, saveUsers, getContent, saveContent } from "../lib/store"

// Migriere Benutzerdaten
function migrateUsers() {
  const users = getUsers()

  // Beispiel: Füge ein neues Feld zu allen Benutzern hinzu
  const migratedUsers = users.map((user) => {
    // Stelle sicher, dass das Feld 'approved' existiert
    if (user.approved === undefined) {
      user.approved = true
    }

    // Stelle sicher, dass das Feld 'roleExpirations' existiert
    if (!user.roleExpirations) {
      user.roleExpirations = []
    }

    // Stelle sicher, dass das Feld 'interactionHistory' existiert
    if (!user.interactionHistory) {
      user.interactionHistory = []
    }

    return user
  })

  saveUsers(migratedUsers)
  console.log(`${migratedUsers.length} Benutzer wurden migriert.`)
}

// Migriere Inhaltsdaten
function migrateContent() {
  const content = getContent()

  // Beispiel: Aktualisiere das Berechtigungsformat
  const migratedContent = content.map((item) => {
    // Stelle sicher, dass das Berechtigungsfeld existiert
    if (!item.permissions) {
      item.permissions = {
        view: ["user", "moderator", "admin", "co-owner", "owner"],
        edit: [item.createdBy, "admin", "co-owner", "owner"],
        delete: ["admin", "co-owner", "owner"],
      }
    }

    // Stelle sicher, dass alle Berechtigungstypen existieren
    if (!item.permissions.view) {
      item.permissions.view = ["user", "moderator", "admin", "co-owner", "owner"]
    }
    if (!item.permissions.edit) {
      item.permissions.edit = [item.createdBy, "admin", "co-owner", "owner"]
    }
    if (!item.permissions.delete) {
      item.permissions.delete = ["admin", "co-owner", "owner"]
    }

    return item
  })

  saveContent(migratedContent)
  console.log(`${migratedContent.length} Inhalte wurden migriert.`)
}

// Führe alle Migrationsfunktionen aus
migrateUsers()
migrateContent()

console.log("Datenmigration abgeschlossen!")


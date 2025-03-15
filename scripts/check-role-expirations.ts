/**
 * Dieses Skript überprüft und verarbeitet abgelaufene Rollen
 * Es sollte täglich ausgeführt werden
 */

import { checkRoleExpirations } from "../lib/store"

// Überprüfe und verarbeite abgelaufene Rollen
checkRoleExpirations()

console.log("Rollenablauf wurde überprüft!")


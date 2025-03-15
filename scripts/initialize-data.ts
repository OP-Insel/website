/**
 * Dieses Skript initialisiert die Datenbank mit Standardwerten
 * Es sollte nur einmal ausgeführt werden, wenn die Anwendung zum ersten Mal gestartet wird
 */

import { initializeStore } from "../lib/store"

// Initialisiere die Datenbank mit Standardwerten
initializeStore()

console.log("Datenbank wurde erfolgreich initialisiert!")


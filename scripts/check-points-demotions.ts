/**
 * Dieses Skript überprüft und verarbeitet Herabstufungen basierend auf Punkten
 * Es sollte täglich ausgeführt werden
 */

import { checkPointBasedDemotions } from "../lib/store"

// Überprüfe und verarbeite Herabstufungen basierend auf Punkten
checkPointBasedDemotions()

console.log("Punktebasierte Herabstufungen wurden überprüft!")


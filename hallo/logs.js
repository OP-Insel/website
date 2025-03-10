// Import necessary modules or declare variables
import { CONFIG } from "./config.js" // Assuming config.js exports CONFIG
import { generateId } from "./utils.js" // Assuming utils.js exports generateId
import { getCurrentUser } from "./auth.js" // Assuming auth.js exports getCurrentUser

// System logs functions

// Get all logs
function getLogs() {
  const logsJson = localStorage.getItem(CONFIG.storageKeys.logs)
  return logsJson ? JSON.parse(logsJson) : []
}

// Save logs to localStorage
function saveLogs(logs) {
  localStorage.setItem(CONFIG.storageKeys.logs, JSON.stringify(logs))
}

// Add a new log entry
function addLog(logData) {
  const logs = getLogs()

  const newLog = {
    id: generateId(),
    timestamp: new Date().toISOString(),
    action: logData.action,
    details: logData.details,
    user: logData.user,
  }

  logs.unshift(newLog) // Add to beginning of array

  // Limit logs to 100 entries
  if (logs.length > 100) {
    logs.pop() // Remove oldest log
  }

  saveLogs(logs)

  return newLog
}

// Clear all logs
function clearLogs() {
  saveLogs([])

  // Add log about clearing
  addLog({
    action: "Logs Cleared",
    details: "All system logs were cleared",
    user: getCurrentUser()?.username || "System",
  })

  return { success: true }
}


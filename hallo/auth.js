// Import necessary modules or declare variables
import { CONFIG } from "./config.js" // Assuming config.js exports CONFIG
import { generateId, hashPassword, verifyPassword } from "./utils.js" // Assuming utils.js exports generateId, hashPassword, verifyPassword

// Authentication related functions

// Initialize authentication
function initAuth() {
  // Check if we have users, if not create default admin
  const users = getUsers()
  if (users.length === 0) {
    const admin = { ...CONFIG.defaultAdmin }
    admin.id = generateId()
    admin.password = hashPassword(admin.password)

    users.push(admin)
    saveUsers(users)

    // Add initial log
    addLog({
      action: "System Initialized",
      details: "Default admin account created",
      user: "System",
    })
  }

  // Check if user is logged in
  const currentUser = getCurrentUser()
  if (currentUser) {
    // Check session timeout
    const settings = getSettings()
    const lastActivity = localStorage.getItem("auth_system_last_activity")
    if (lastActivity) {
      const timeout = settings.sessionTimeout * 60 * 1000 // Convert to milliseconds
      const now = new Date().getTime()
      const lastActivityTime = Number.parseInt(lastActivity, 10)

      if (now - lastActivityTime > timeout) {
        // Session expired
        logout()
        return
      }
    }

    // Update last activity
    updateLastActivity()
  }
}

// Login user
function login(username, password) {
  const users = getUsers()
  const user = users.find((u) => u.username === username)

  if (user && verifyPassword(password, user.password)) {
    // Check if user is active
    if (user.status !== "active") {
      return { success: false, message: "Your account is not active. Please contact an administrator." }
    }

    // Set current user (excluding password)
    const { password: _, ...userWithoutPassword } = user
    localStorage.setItem(CONFIG.storageKeys.currentUser, JSON.stringify(userWithoutPassword))

    // Update last activity
    updateLastActivity()

    // Add log
    addLog({
      action: "Login",
      details: "User logged in successfully",
      user: username,
    })

    return { success: true, user: userWithoutPassword }
  }

  return { success: false, message: "Invalid username or password" }
}

// Register new user
function register(userData) {
  const users = getUsers()

  // Check if username already exists
  if (users.some((u) => u.username === userData.username)) {
    return { success: false, message: "Username already exists" }
  }

  // Check if email already exists
  if (users.some((u) => u.email === userData.email)) {
    return { success: false, message: "Email already exists" }
  }

  // Get settings
  const settings = getSettings()

  // Create new user
  const newUser = {
    id: generateId(),
    username: userData.username,
    email: userData.email,
    password: hashPassword(userData.password),
    role: settings.defaultRole,
    status: "active",
    createdAt: new Date().toISOString(),
  }

  users.push(newUser)
  saveUsers(users)

  // Add log
  addLog({
    action: "Registration",
    details: "New user registered",
    user: userData.username,
  })

  return { success: true }
}

// Logout user
function logout() {
  const currentUser = getCurrentUser()
  if (currentUser) {
    // Add log
    addLog({
      action: "Logout",
      details: "User logged out",
      user: currentUser.username,
    })
  }

  localStorage.removeItem(CONFIG.storageKeys.currentUser)
  localStorage.removeItem("auth_system_last_activity")

  // Redirect to login page
  window.location.hash = "#login"
}

// Get current logged in user
function getCurrentUser() {
  const userJson = localStorage.getItem(CONFIG.storageKeys.currentUser)
  return userJson ? JSON.parse(userJson) : null
}

// Update last activity timestamp
function updateLastActivity() {
  localStorage.setItem("auth_system_last_activity", new Date().getTime().toString())
}

// Check if user is authenticated
function isAuthenticated() {
  return getCurrentUser() !== null
}

// Update current user (when profile is updated)
function updateCurrentUser(updatedUser) {
  localStorage.setItem(CONFIG.storageKeys.currentUser, JSON.stringify(updatedUser))
}

// User management functions

// Get all users
function getUsers() {
  const usersJson = localStorage.getItem(CONFIG.storageKeys.users)
  return usersJson ? JSON.parse(usersJson) : []
}

// Save users to localStorage
function saveUsers(users) {
  localStorage.setItem(CONFIG.storageKeys.users, JSON.stringify(users))
}

// Get settings
function getSettings() {
  const settingsJson = localStorage.getItem(CONFIG.storageKeys.settings)
  return settingsJson ? JSON.parse(settingsJson) : CONFIG.defaultSettings
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

// Get all logs
function getLogs() {
  const logsJson = localStorage.getItem(CONFIG.storageKeys.logs)
  return logsJson ? JSON.parse(logsJson) : []
}

// Save logs to localStorage
function saveLogs(logs) {
  localStorage.setItem(CONFIG.storageKeys.logs, JSON.stringify(logs))
}

export { getCurrentUser, initAuth }


// Import necessary modules or declare variables
// Assuming these are defined elsewhere in the project
const CONFIG = {
  storageKeys: {
    users: "users",
    settings: "settings",
  },
  defaultSettings: {},
}

function hashPassword(password) {
  // Placeholder for password hashing logic
  return password
}

function getCurrentUser() {
  // Placeholder for getting current user
  return null
}

function updateCurrentUser(user) {
  // Placeholder for updating current user
}

function addLog(log) {
  // Placeholder for adding log
  console.log(log)
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

// Get user by ID
function getUserById(userId) {
  const users = getUsers()
  return users.find((user) => user.id === userId)
}

// Update user
function updateUser(userId, userData) {
  const users = getUsers()
  const userIndex = users.findIndex((user) => user.id === userId)

  if (userIndex === -1) {
    return { success: false, message: "User not found" }
  }

  // Check if trying to change the last owner
  if (users[userIndex].role === "owner" && userData.role !== "owner") {
    // Count owners
    const ownerCount = users.filter((user) => user.role === "owner").length
    if (ownerCount <= 1) {
      return { success: false, message: "Cannot change the last owner" }
    }
  }

  // Update user data
  const updatedUser = { ...users[userIndex], ...userData }

  // If password is provided, hash it
  if (userData.password) {
    updatedUser.password = hashPassword(userData.password)
  }

  users[userIndex] = updatedUser
  saveUsers(users)

  // If updating current user, update the current user in localStorage
  const currentUser = getCurrentUser()
  if (currentUser && currentUser.id === userId) {
    const { password: _, ...userWithoutPassword } = updatedUser
    updateCurrentUser(userWithoutPassword)
  }

  // Add log
  addLog({
    action: "User Updated",
    details: `User ${updatedUser.username} was updated`,
    user: getCurrentUser()?.username || "System",
  })

  return { success: true, user: updatedUser }
}

// Delete user
function deleteUser(userId) {
  const users = getUsers()
  const userIndex = users.findIndex((user) => user.id === userId)

  if (userIndex === -1) {
    return { success: false, message: "User not found" }
  }

  // Check if trying to delete the last owner
  if (users[userIndex].role === "owner") {
    // Count owners
    const ownerCount = users.filter((user) => user.role === "owner").length
    if (ownerCount <= 1) {
      return { success: false, message: "Cannot delete the last owner" }
    }
  }

  const deletedUser = users[userIndex]
  users.splice(userIndex, 1)
  saveUsers(users)

  // Add log
  addLog({
    action: "User Deleted",
    details: `User ${deletedUser.username} was deleted`,
    user: getCurrentUser()?.username || "System",
  })

  return { success: true }
}

// Get settings
function getSettings() {
  const settingsJson = localStorage.getItem(CONFIG.storageKeys.settings)
  return settingsJson ? JSON.parse(settingsJson) : CONFIG.defaultSettings
}

// Save settings
function saveSettings(settings) {
  localStorage.setItem(CONFIG.storageKeys.settings, JSON.stringify(settings))

  // Add log
  addLog({
    action: "Settings Updated",
    details: "System settings were updated",
    user: getCurrentUser()?.username || "System",
  })

  return { success: true }
}


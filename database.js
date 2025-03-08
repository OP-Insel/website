const fs = require("fs")
const path = require("path")

// Path to the database file
const DB_FILE = path.join(__dirname, "database.json")

// Initial database structure
const initialDB = {
  users: [
    {
      id: "1",
      username: "Admin User",
      rank: "Owner",
      points: 1500,
      lastActive: new Date().toISOString(),
    },
    {
      id: "2",
      username: "Moderator",
      rank: "Moderator",
      points: 350,
      lastActive: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    },
    {
      id: "3",
      username: "Regular User",
      rank: "Mitglied",
      points: 50,
      lastActive: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    },
  ],
  rules: [
    {
      id: "1",
      text: "Respektiere alle Teammitglieder und Spieler",
    },
    {
      id: "2",
      text: "Keine Cheats oder Hacks auf dem Server",
    },
    {
      id: "3",
      text: "Regelmäßige Aktivität ist erforderlich, um den Rang zu halten",
    },
  ],
  schedule: [
    {
      id: "1",
      title: "Server Wartung",
      description: "Wöchentliche Wartung und Backup",
      date: new Date(Date.now() + 604800000).toISOString(), // 7 days from now
      createdBy: "1",
    },
    {
      id: "2",
      title: "Team Meeting",
      description: "Besprechung neuer Features",
      date: new Date(Date.now() + 259200000).toISOString(), // 3 days from now
      createdBy: "1",
    },
  ],
}

/**
 * Initialize the database if it doesn't exist
 */
function initDB() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDB, null, 2))
    console.log("Database initialized with default data")
  } else {
    console.log("Database already exists")
  }
}

/**
 * Read the database
 * @returns {Object} Database object
 */
function readDB() {
  try {
    const data = fs.readFileSync(DB_FILE, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error("Error reading database:", error)
    return null
  }
}

/**
 * Write to the database
 * @param {Object} data - Data to write
 * @returns {boolean} Success status
 */
function writeDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2))
    return true
  } catch (error) {
    console.error("Error writing to database:", error)
    return false
  }
}

/**
 * Get all users
 * @returns {Array} Array of users
 */
function getUsers() {
  const db = readDB()
  return db ? db.users : []
}

/**
 * Get user by ID
 * @param {string} id - User ID
 * @returns {Object|null} User object or null if not found
 */
function getUserById(id) {
  const users = getUsers()
  return users.find((user) => user.id === id) || null
}

/**
 * Get user by username
 * @param {string} username - Username
 * @returns {Object|null} User object or null if not found
 */
function getUserByUsername(username) {
  const users = getUsers()
  return users.find((user) => user.username.toLowerCase() === username.toLowerCase()) || null
}

/**
 * Add a new user
 * @param {Object} userData - User data
 * @returns {Object} Added user
 */
function addUser(userData) {
  const db = readDB()
  if (!db) return null

  const newUser = {
    id: Date.now().toString(),
    ...userData,
    lastActive: new Date().toISOString(),
  }

  db.users.push(newUser)
  writeDB(db)

  return newUser
}

/**
 * Update a user
 * @param {string} id - User ID
 * @param {Object} userData - User data to update
 * @returns {Object|null} Updated user or null if not found
 */
function updateUser(id, userData) {
  const db = readDB()
  if (!db) return null

  const userIndex = db.users.findIndex((user) => user.id === id)
  if (userIndex === -1) return null

  db.users[userIndex] = { ...db.users[userIndex], ...userData }
  writeDB(db)

  return db.users[userIndex]
}

/**
 * Delete a user
 * @param {string} id - User ID
 * @returns {boolean} Success status
 */
function deleteUser(id) {
  const db = readDB()
  if (!db) return false

  const userIndex = db.users.findIndex((user) => user.id === id)
  if (userIndex === -1) return false

  db.users.splice(userIndex, 1)
  writeDB(db)

  return true
}

/**
 * Get all rules
 * @returns {Array} Array of rules
 */
function getRules() {
  const db = readDB()
  return db ? db.rules : []
}

/**
 * Add a new rule
 * @param {string} text - Rule text
 * @returns {Object} Added rule
 */
function addRule(text) {
  const db = readDB()
  if (!db) return null

  const newRule = {
    id: Date.now().toString(),
    text,
  }

  db.rules.push(newRule)
  writeDB(db)

  return newRule
}

/**
 * Update a rule
 * @param {string} id - Rule ID
 * @param {string} text - New rule text
 * @returns {Object|null} Updated rule or null if not found
 */
function updateRule(id, text) {
  const db = readDB()
  if (!db) return null

  const ruleIndex = db.rules.findIndex((rule) => rule.id === id)
  if (ruleIndex === -1) return null

  db.rules[ruleIndex].text = text
  writeDB(db)

  return db.rules[ruleIndex]
}

/**
 * Delete a rule
 * @param {string} id - Rule ID
 * @returns {boolean} Success status
 */
function deleteRule(id) {
  const db = readDB()
  if (!db) return false

  const ruleIndex = db.rules.findIndex((rule) => rule.id === id)
  if (ruleIndex === -1) return false

  db.rules.splice(ruleIndex, 1)
  writeDB(db)

  return true
}

/**
 * Get all schedule events
 * @returns {Array} Array of schedule events
 */
function getSchedule() {
  const db = readDB()
  return db ? db.schedule : []
}

/**
 * Add a new schedule event
 * @param {Object} eventData - Event data
 * @returns {Object} Added event
 */
function addEvent(eventData) {
  const db = readDB()
  if (!db) return null

  const newEvent = {
    id: Date.now().toString(),
    ...eventData,
  }

  db.schedule.push(newEvent)
  writeDB(db)

  return newEvent
}

/**
 * Delete a schedule event
 * @param {string} id - Event ID
 * @returns {boolean} Success status
 */
function deleteEvent(id) {
  const db = readDB()
  if (!db) return false

  const eventIndex = db.schedule.findIndex((event) => event.id === id)
  if (eventIndex === -1) return false

  db.schedule.splice(eventIndex, 1)
  writeDB(db)

  return true
}

/**
 * Check for inactive users and degrade their points
 * This function is meant to be run periodically
 */
function degradeInactiveUsers() {
  const db = readDB()
  if (!db) return

  const now = new Date()
  const oneWeek = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds

  db.users.forEach((user) => {
    const lastActive = new Date(user.lastActive)
    const daysSinceActive = Math.floor((now - lastActive) / (24 * 60 * 60 * 1000))

    // Degrade points for users inactive for more than a week
    if (daysSinceActive > 7) {
      // Calculate points to deduct (5 points per day after a week)
      const pointsToDeduct = (daysSinceActive - 7) * 5

      // Don't go below 0 points
      user.points = Math.max(0, user.points - pointsToDeduct)

      // Update user rank based on points
      if (user.rank !== "Owner") {
        // Don't degrade Owner rank
        if (user.points < 100) {
          user.rank = "Mitglied"
        } else if (user.points < 300) {
          user.rank = "Trusted"
        } else if (user.points < 600) {
          user.rank = "Moderator"
        } else if (user.points < 1000) {
          user.rank = "Admin"
        } else {
          user.rank = "Co-Owner"
        }
      }
    }
  })

  writeDB(db)
  console.log("User points degraded based on inactivity")
}

// Initialize the database when this module is loaded
initDB()

// Export database functions
module.exports = {
  getUsers,
  getUserById,
  getUserByUsername,
  addUser,
  updateUser,
  deleteUser,
  getRules,
  addRule,
  updateRule,
  deleteRule,
  getSchedule,
  addEvent,
  deleteEvent,
  degradeInactiveUsers,
}


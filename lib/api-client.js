// Base URL for API requests
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001"

/**
 * Fetch users from the API
 * @returns {Promise<Array>} Array of users
 */
export async function fetchUsers() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users`)
    if (!response.ok) {
      throw new Error("Failed to fetch users")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching users:", error)
    throw error
  }
}

/**
 * Fetch a single user by username
 * @param {string} username - The username to look up
 * @returns {Promise<Object|null>} User object or null if not found
 */
export async function fetchUserByUsername(username) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/by-username/${username}`)
    if (response.status === 404) {
      return null
    }
    if (!response.ok) {
      throw new Error("Failed to fetch user")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching user:", error)
    throw error
  }
}

/**
 * Add a new user
 * @param {Object} userData - User data to add
 * @returns {Promise<Object>} Added user
 */
export async function addUser(userData) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
    if (!response.ok) {
      throw new Error("Failed to add user")
    }
    return await response.json()
  } catch (error) {
    console.error("Error adding user:", error)
    throw error
  }
}

/**
 * Update a user
 * @param {string} userId - ID of the user to update
 * @param {Object} userData - User data to update
 * @returns {Promise<Object>} Updated user
 */
export async function updateUser(userId, userData) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
    if (!response.ok) {
      throw new Error("Failed to update user")
    }
    return await response.json()
  } catch (error) {
    console.error("Error updating user:", error)
    throw error
  }
}

/**
 * Fetch rules from the API
 * @returns {Promise<Array>} Array of rules
 */
export async function fetchRules() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/rules`)
    if (!response.ok) {
      throw new Error("Failed to fetch rules")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching rules:", error)
    throw error
  }
}

/**
 * Add a new rule
 * @param {string} ruleText - Text of the rule to add
 * @returns {Promise<Object>} Added rule
 */
export async function addRule(ruleText) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/rules`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: ruleText }),
    })
    if (!response.ok) {
      throw new Error("Failed to add rule")
    }
    return await response.json()
  } catch (error) {
    console.error("Error adding rule:", error)
    throw error
  }
}

/**
 * Update a rule
 * @param {string} ruleId - ID of the rule to update
 * @param {string} ruleText - New text for the rule
 * @returns {Promise<Object>} Updated rule
 */
export async function updateRule(ruleId, ruleText) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/rules/${ruleId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: ruleText }),
    })
    if (!response.ok) {
      throw new Error("Failed to update rule")
    }
    return await response.json()
  } catch (error) {
    console.error("Error updating rule:", error)
    throw error
  }
}

/**
 * Delete a rule
 * @param {string} ruleId - ID of the rule to delete
 * @returns {Promise<void>}
 */
export async function deleteRule(ruleId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/rules/${ruleId}`, {
      method: "DELETE",
    })
    if (!response.ok) {
      throw new Error("Failed to delete rule")
    }
  } catch (error) {
    console.error("Error deleting rule:", error)
    throw error
  }
}

/**
 * Fetch schedule events from the API
 * @returns {Promise<Array>} Array of schedule events
 */
export async function fetchSchedule() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/schedule`)
    if (!response.ok) {
      throw new Error("Failed to fetch schedule")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching schedule:", error)
    throw error
  }
}

/**
 * Add a new schedule event
 * @param {Object} eventData - Event data to add
 * @returns {Promise<Object>} Added event
 */
export async function addEvent(eventData) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/schedule`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    })
    if (!response.ok) {
      throw new Error("Failed to add event")
    }
    return await response.json()
  } catch (error) {
    console.error("Error adding event:", error)
    throw error
  }
}

/**
 * Delete a schedule event
 * @param {string} eventId - ID of the event to delete
 * @returns {Promise<void>}
 */
export async function deleteEvent(eventId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/schedule/${eventId}`, {
      method: "DELETE",
    })
    if (!response.ok) {
      throw new Error("Failed to delete event")
    }
  } catch (error) {
    console.error("Error deleting event:", error)
    throw error
  }
}


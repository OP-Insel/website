// Utility functions

// Generate a unique ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
}

// Hash a password (simplified for demo purposes)
// In a real application, use a proper hashing library
function hashPassword(password) {
  // This is NOT secure, just for demonstration
  return btoa(password + "salt")
}

// Verify a password (simplified for demo purposes)
function verifyPassword(password, hashedPassword) {
  return hashPassword(password) === hashedPassword
}

// Format date to readable string
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleString()
}

// Show an element
function showElement(element) {
  if (element) {
    element.classList.remove("hidden")
  }
}

// Hide an element
function hideElement(element) {
  if (element) {
    element.classList.add("hidden")
  }
}

// Show an alert message
function showAlert(elementId, message) {
  const alertElement = document.getElementById(elementId)
  if (alertElement) {
    const messageElement = alertElement.querySelector(".message")
    if (messageElement) {
      messageElement.textContent = message
    }
    showElement(alertElement)

    // Auto-hide after 5 seconds
    setTimeout(() => {
      hideElement(alertElement)
    }, 5000)
  }
}

// Get template content
function getTemplate(templateId) {
  const template = document.getElementById(templateId)
  if (template) {
    return template.content.cloneNode(true)
  }
  return null
}

// Check if user has admin privileges
function isAdmin(user) {
  return user && (user.role === "owner" || user.role === "co-owner")
}

// Check if user is owner
function isOwner(user) {
  return user && user.role === "owner"
}

// Get badge class based on role
function getBadgeClass(role) {
  switch (role) {
    case "owner":
      return "owner"
    case "co-owner":
      return "co-owner"
    default:
      return "user"
  }
}

// Get badge class based on status
function getStatusBadgeClass(status) {
  switch (status) {
    case "active":
      return "success"
    case "inactive":
      return "warning"
    case "suspended":
      return "danger"
    default:
      return ""
  }
}


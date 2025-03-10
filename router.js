// Simple client-side router

// Assume these functions are defined elsewhere (e.g., in auth.js, utils.js, etc.)
// For demonstration purposes, we'll define them as placeholders.
function isAuthenticated() {
  // Replace with your actual authentication logic
  return localStorage.getItem("token") !== null
}

function showElement(element) {
  element.style.display = "block"
}

function hideElement(element) {
  element.style.display = "none"
}

function getTemplate(templateId) {
  const template = document.getElementById(templateId)
  return template.content.cloneNode(true)
}

function getCurrentUser() {
  // Replace with your actual user retrieval logic
  const userString = localStorage.getItem("user")
  return userString ? JSON.parse(userString) : null
}

function isAdmin(user) {
  return user && user.role === "admin"
}

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem("users")) || []
  } catch (e) {
    console.error("Error parsing users from localStorage", e)
    return []
  }
}

function getLogs() {
  try {
    return JSON.parse(localStorage.getItem("logs")) || []
  } catch (e) {
    console.error("Error parsing logs from localStorage", e)
    return []
  }
}

function getSettings() {
  try {
    return (
      JSON.parse(localStorage.getItem("settings")) || {
        siteName: "My App",
        allowRegistration: true,
        defaultRole: "user",
        sessionTimeout: 3600,
      }
    )
  } catch (e) {
    console.error("Error parsing settings from localStorage", e)
    return {
      siteName: "My App",
      allowRegistration: true,
      defaultRole: "user",
      sessionTimeout: 3600,
    }
  }
}

function login(username, password) {
  const users = getUsers()
  const user = users.find((u) => u.username === username && u.password === password)

  if (user) {
    localStorage.setItem("token", "fake_token")
    localStorage.setItem("user", JSON.stringify(user))
    return { success: true }
  } else {
    return { success: false, message: "Invalid credentials" }
  }
}

function register(userData) {
  const users = getUsers()
  if (users.find((u) => u.username === userData.username)) {
    return { success: false, message: "Username already exists" }
  }

  const settings = getSettings()
  const newUser = {
    id: Date.now(),
    username: userData.username,
    email: userData.email,
    password: userData.password,
    role: settings.defaultRole,
    status: "active",
  }
  users.push(newUser)
  localStorage.setItem("users", JSON.stringify(users))
  return { success: true }
}

function logout() {
  localStorage.removeItem("token")
  localStorage.removeItem("user")
  window.location.hash = "#login"
}

function updateUser(userId, userData) {
  const users = getUsers()
  const userIndex = users.findIndex((u) => u.id === Number.parseInt(userId))
  if (userIndex === -1) {
    return { success: false, message: "User not found" }
  }

  users[userIndex] = { ...users[userIndex], ...userData }
  localStorage.setItem("users", JSON.stringify(users))
  localStorage.setItem("user", JSON.stringify(users[userIndex])) // Update current user if it's the same
  return { success: true }
}

function deleteUser(userId) {
  let users = getUsers()
  const initialLength = users.length
  users = users.filter((u) => u.id !== Number.parseInt(userId))

  if (users.length === initialLength) {
    return { success: false, message: "User not found" }
  }

  localStorage.setItem("users", JSON.stringify(users))
  return { success: true }
}

function saveSettings(settings) {
  localStorage.setItem("settings", JSON.stringify(settings))
  return { success: true }
}

function getUserById(userId) {
  const users = getUsers()
  return users.find((user) => user.id === Number.parseInt(userId))
}

function getBadgeClass(role) {
  switch (role) {
    case "admin":
      return "badge-error"
    case "owner":
      return "badge-warning"
    case "co-owner":
      return "badge-info"
    default:
      return "badge-success"
  }
}

function getStatusBadgeClass(status) {
  switch (status) {
    case "active":
      return "badge-success"
    case "inactive":
      return "badge-warning"
    case "pending":
      return "badge-info"
    default:
      return "badge-error"
  }
}

function formatDate(timestamp) {
  const date = new Date(timestamp)
  return date.toLocaleDateString() + " " + date.toLocaleTimeString()
}

function showAlert(elementId, message) {
  const alertElement = document.getElementById(elementId)
  alertElement.textContent = message
  alertElement.classList.remove("hidden")

  setTimeout(() => {
    alertElement.classList.add("hidden")
  }, 3000)
}

// Initialize router
function initRouter() {
  // Handle hash changes
  window.addEventListener("hashchange", handleRouteChange)

  // Initial route
  handleRouteChange()
}

// Handle route changes
function handleRouteChange() {
  const hash = window.location.hash.substring(1) || "login"

  // Check if user is authenticated
  const isAuth = isAuthenticated()

  // Routes that don't require authentication
  const publicRoutes = ["login", "register"]

  // If not authenticated and trying to access protected route, redirect to login
  if (!isAuth && !publicRoutes.includes(hash)) {
    window.location.hash = "#login"
    return
  }

  // If authenticated and trying to access login/register, redirect to dashboard
  if (isAuth && publicRoutes.includes(hash)) {
    window.location.hash = "#dashboard"
    return
  }

  // Load the appropriate page
  loadPage(hash)
}

// Load page content
function loadPage(page) {
  const appElement = document.getElementById("app")
  const loadingElement = document.getElementById("loading")

  // Show loading
  showElement(loadingElement)

  // Clear current content
  while (appElement.firstChild) {
    appElement.removeChild(appElement.firstChild)
  }

  // Load new content based on page
  switch (page) {
    case "login":
      loadLoginPage()
      break
    case "register":
      loadRegisterPage()
      break
    case "dashboard":
      loadDashboardPage()
      break
    case "admin":
      loadAdminPage()
      break
    case "profile":
      loadProfilePage()
      break
    default:
      loadDashboardPage()
  }

  // Hide loading
  setTimeout(() => {
    hideElement(loadingElement)
  }, 500)
}

// Load login page
function loadLoginPage() {
  const template = getTemplate("login-template")
  document.getElementById("app").appendChild(template)

  // Add event listeners
  document.getElementById("login-form").addEventListener("submit", handleLogin)
  document.getElementById("register-link").addEventListener("click", (e) => {
    e.preventDefault()
    window.location.hash = "#register"
  })
}

// Load register page
function loadRegisterPage() {
  const template = getTemplate("register-template")
  document.getElementById("app").appendChild(template)

  // Add event listeners
  document.getElementById("register-form").addEventListener("submit", handleRegister)
  document.getElementById("login-link").addEventListener("click", (e) => {
    e.preventDefault()
    window.location.hash = "#login"
  })
}

// Load dashboard page
function loadDashboardPage() {
  const template = getTemplate("dashboard-template")
  document.getElementById("app").appendChild(template)

  // Get current user
  const currentUser = getCurrentUser()

  // Update user info
  document.getElementById("user-name").textContent = currentUser.username
  document.getElementById("user-role").textContent = currentUser.role
  document.getElementById("user-role").className = `badge ${getBadgeClass(currentUser.role)}`

  // Update role display
  document.getElementById("role-display").textContent = currentUser.role
  document.getElementById("role-display").className = `badge ${getBadgeClass(currentUser.role)}`

  // Show/hide admin link based on role
  const adminLink = document.querySelector(".admin-only")
  if (isAdmin(currentUser)) {
    adminLink.classList.remove("hidden")
  } else {
    adminLink.classList.add("hidden")
  }

  // Update user count
  document.getElementById("user-count").textContent = getUsers().length

  // Add event listeners
  document.querySelectorAll(".sidebar-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      if (link.classList.contains("logout")) {
        e.preventDefault()
        logout()
      } else if (link.dataset.page) {
        e.preventDefault()
        window.location.hash = `#${link.dataset.page}`
      }
    })
  })
}

// Load admin page
function loadAdminPage() {
  const currentUser = getCurrentUser()

  // Check if user has admin privileges
  if (!isAdmin(currentUser)) {
    window.location.hash = "#dashboard"
    return
  }

  const template = getTemplate("admin-template")
  document.getElementById("app").appendChild(template)

  // Update user info
  document.getElementById("admin-user-name").textContent = currentUser.username
  document.getElementById("admin-user-role").textContent = currentUser.role
  document.getElementById("admin-user-role").className = `badge ${getBadgeClass(currentUser.role)}`

  // Load users table
  loadUsersTable()

  // Load logs table
  loadLogsTable()

  // Load settings form
  loadSettingsForm()

  // Add event listeners for tabs
  document.querySelectorAll(".tab-button").forEach((button) => {
    button.addEventListener("click", () => {
      // Hide all tab contents
      document.querySelectorAll(".tab-content").forEach((content) => {
        content.classList.remove("active")
      })

      // Deactivate all tab buttons
      document.querySelectorAll(".tab-button").forEach((btn) => {
        btn.classList.remove("active")
      })

      // Activate clicked tab
      button.classList.add("active")
      document.getElementById(`${button.dataset.tab}-tab`).classList.add("active")
    })
  })

  // Add event listeners for sidebar
  document.querySelectorAll(".sidebar-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      if (link.classList.contains("logout")) {
        e.preventDefault()
        logout()
      } else if (link.dataset.page) {
        e.preventDefault()
        window.location.hash = `#${link.dataset.page}`
      }
    })
  })

  // Add event listener for settings form
  document.getElementById("settings-form").addEventListener("submit", handleSettingsUpdate)
}

// Load profile page
function loadProfilePage() {
  const template = getTemplate("profile-template")
  document.getElementById("app").appendChild(template)

  // Get current user
  const currentUser = getCurrentUser()

  // Update user info
  document.getElementById("profile-user-name").textContent = currentUser.username
  document.getElementById("profile-user-role").textContent = currentUser.role
  document.getElementById("profile-user-role").className = `badge ${getBadgeClass(currentUser.role)}`

  // Show/hide admin link based on role
  const adminLink = document.querySelector(".admin-only")
  if (isAdmin(currentUser)) {
    adminLink.classList.remove("hidden")
  } else {
    adminLink.classList.add("hidden")
  }

  // Fill profile form
  document.getElementById("profile-username").value = currentUser.username
  document.getElementById("profile-email").value = currentUser.email
  document.getElementById("profile-role").value = currentUser.role

  // Add event listeners
  document.querySelectorAll(".sidebar-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      if (link.classList.contains("logout")) {
        e.preventDefault()
        logout()
      } else if (link.dataset.page) {
        e.preventDefault()
        window.location.hash = `#${link.dataset.page}`
      }
    })
  })

  // Add event listener for profile form
  document.getElementById("profile-form").addEventListener("submit", handleProfileUpdate)
}

// Load users table
function loadUsersTable() {
  const tableBody = document.getElementById("users-table-body")
  const users = getUsers()
  const currentUser = getCurrentUser()

  // Clear table
  tableBody.innerHTML = ""

  // Add users to table
  users.forEach((user) => {
    const row = document.createElement("tr")

    // Username
    const usernameCell = document.createElement("td")
    usernameCell.className = "font-medium"
    usernameCell.textContent = user.username
    row.appendChild(usernameCell)

    // Email
    const emailCell = document.createElement("td")
    emailCell.textContent = user.email
    row.appendChild(emailCell)

    // Role
    const roleCell = document.createElement("td")
    const roleBadge = document.createElement("span")
    roleBadge.className = `badge ${getBadgeClass(user.role)}`
    roleBadge.textContent = user.role
    roleCell.appendChild(roleBadge)
    row.appendChild(roleCell)

    // Status
    const statusCell = document.createElement("td")
    const statusBadge = document.createElement("span")
    statusBadge.className = `badge ${getStatusBadgeClass(user.status)}`
    statusBadge.textContent = user.status
    statusCell.appendChild(statusBadge)
    row.appendChild(statusCell)

    // Actions
    const actionsCell = document.createElement("td")
    actionsCell.className = "text-right"

    // Edit button
    const editButton = document.createElement("button")
    editButton.className = "button secondary"
    editButton.textContent = "Edit"
    editButton.addEventListener("click", () => openEditUserModal(user.id))
    actionsCell.appendChild(editButton)

    // Delete button (only if not current user and has permission)
    if (
      user.id !== currentUser.id &&
      (currentUser.role === "owner" || (currentUser.role === "co-owner" && user.role !== "owner"))
    ) {
      const deleteButton = document.createElement("button")
      deleteButton.className = "button secondary ml-2"
      deleteButton.textContent = "Delete"
      deleteButton.addEventListener("click", () => {
        if (confirm(`Are you sure you want to delete ${user.username}?`)) {
          const result = deleteUser(user.id)
          if (result.success) {
            loadUsersTable() // Reload table
          } else {
            alert(result.message)
          }
        }
      })
      actionsCell.appendChild(deleteButton)
    }

    row.appendChild(actionsCell)
    tableBody.appendChild(row)
  })

  // Add edit user modal
  const modalTemplate = getTemplate("edit-user-modal-template")
  document.body.appendChild(modalTemplate)

  // Add event listeners for modal
  document.querySelectorAll(".close-modal").forEach((button) => {
    button.addEventListener("click", closeEditUserModal)
  })

  document.getElementById("edit-user-form").addEventListener("submit", handleEditUser)
}

// Open edit user modal
function openEditUserModal(userId) {
  const user = getUserById(userId)
  if (!user) return

  // Fill form
  document.getElementById("edit-user-id").value = user.id
  document.getElementById("edit-username").value = user.username
  document.getElementById("edit-email").value = user.email
  document.getElementById("edit-role").value = user.role
  document.getElementById("edit-status").value = user.status

  // Show modal
  const modal = document.getElementById("edit-user-modal")
  modal.classList.add("active")
}

// Close edit user modal
function closeEditUserModal() {
  const modal = document.getElementById("edit-user-modal")
  modal.classList.remove("active")
}

// Load logs table
function loadLogsTable() {
  const tableBody = document.getElementById("logs-table-body")
  const logs = getLogs()

  // Clear table
  tableBody.innerHTML = ""

  // Add logs to table
  logs.forEach((log) => {
    const row = document.createElement("tr")

    // Timestamp
    const timestampCell = document.createElement("td")
    timestampCell.textContent = formatDate(log.timestamp)
    row.appendChild(timestampCell)

    // User
    const userCell = document.createElement("td")
    userCell.className = "font-medium"
    userCell.textContent = log.user
    row.appendChild(userCell)

    // Action
    const actionCell = document.createElement("td")
    actionCell.textContent = log.action
    row.appendChild(actionCell)

    // Details
    const detailsCell = document.createElement("td")
    detailsCell.textContent = log.details
    row.appendChild(detailsCell)

    tableBody.appendChild(row)
  })
}

// Load settings form
function loadSettingsForm() {
  const settings = getSettings()

  // Fill form
  document.getElementById("site-name").value = settings.siteName
  document.getElementById("allow-registration").value = settings.allowRegistration.toString()
  document.getElementById("default-role").value = settings.defaultRole
  document.getElementById("session-timeout").value = settings.sessionTimeout
}

// Handle login form submission
function handleLogin(e) {
  e.preventDefault()

  const username = document.getElementById("username").value
  const password = document.getElementById("password").value

  const result = login(username, password)

  if (result.success) {
    window.location.hash = "#dashboard"
  } else {
    showAlert("login-error", result.message)
  }
}

// Handle register form submission
function handleRegister(e) {
  e.preventDefault()

  const username = document.getElementById("reg-username").value
  const email = document.getElementById("reg-email").value
  const password = document.getElementById("reg-password").value
  const confirmPassword = document.getElementById("reg-confirm-password").value

  // Validate passwords match
  if (password !== confirmPassword) {
    showAlert("register-error", "Passwords do not match")
    return
  }

  const result = register({ username, email, password })

  if (result.success) {
    // Auto login after registration
    login(username, password)
    window.location.hash = "#dashboard"
  } else {
    showAlert("register-error", result.message)
  }
}

// Handle profile update
function handleProfileUpdate(e) {
  e.preventDefault()

  const currentUser = getCurrentUser()
  const email = document.getElementById("profile-email").value
  const password = document.getElementById("profile-password").value
  const confirmPassword = document.getElementById("profile-confirm-password").value

  // Validate passwords match if provided
  if (password && password !== confirmPassword) {
    showAlert("profile-update-error", "Passwords do not match")
    return
  }

  const userData = { email }
  if (password) {
    userData.password = password
  }

  const result = updateUser(currentUser.id, userData)

  if (result.success) {
    showAlert("profile-update-success", "Profile updated successfully")

    // Clear password fields
    document.getElementById("profile-password").value = ""
    document.getElementById("profile-confirm-password").value = ""
  } else {
    showAlert("profile-update-error", result.message)
  }
}

// Handle edit user form submission
function handleEditUser(e) {
  e.preventDefault()

  const userId = document.getElementById("edit-user-id").value
  const email = document.getElementById("edit-email").value
  const role = document.getElementById("edit-role").value
  const status = document.getElementById("edit-status").value

  const result = updateUser(userId, { email, role, status })

  if (result.success) {
    closeEditUserModal()
    loadUsersTable() // Reload table
  } else {
    showAlert("edit-user-error", result.message)
  }
}

// Handle settings update
function handleSettingsUpdate(e) {
  e.preventDefault()

  const siteName = document.getElementById("site-name").value
  const allowRegistration = document.getElementById("allow-registration").value === "true"
  const defaultRole = document.getElementById("default-role").value
  const sessionTimeout = Number.parseInt(document.getElementById("session-timeout").value, 10)

  const settings = {
    siteName,
    allowRegistration,
    defaultRole,
    sessionTimeout,
  }

  const result = saveSettings(settings)

  if (result.success) {
    alert("Settings updated successfully")
  }
}


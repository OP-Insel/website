// Main application script for Minecraft Points System
// Handles UI, events, and core functionality

// Configuration and constants
const ROLES = {
  OWNER: {
    label: "Owner",
    level: 10,
    canDemoteTo: null,
    pointThreshold: null,
    defaultPoints: Number.POSITIVE_INFINITY,
  },
  CO_OWNER: { label: "Co-Owner", level: 9, canDemoteTo: "ADMIN", pointThreshold: 500, defaultPoints: 750 },
  DEVELOPER: { label: "Developer", level: 8, canDemoteTo: null, pointThreshold: 250, defaultPoints: 500 },
  ADMIN: { label: "Admin", level: 7, canDemoteTo: "JR_ADMIN", pointThreshold: 400, defaultPoints: 500 },
  JR_ADMIN: { label: "Jr. Admin", level: 6, canDemoteTo: "MODERATOR", pointThreshold: 300, defaultPoints: 400 },
  MODERATOR: { label: "Moderator", level: 5, canDemoteTo: "JR_MODERATOR", pointThreshold: 250, defaultPoints: 300 },
  JR_MODERATOR: { label: "Jr. Moderator", level: 4, canDemoteTo: "SUPPORTER", pointThreshold: 200, defaultPoints: 250 },
  SR_BUILDER: { label: "Sr. Builder", level: 3.5, canDemoteTo: "BUILDER", pointThreshold: 250, defaultPoints: 300 },
  BUILDER: { label: "Builder", level: 3, canDemoteTo: null, pointThreshold: 150, defaultPoints: 200 },
  SUPPORTER: { label: "Supporter", level: 2, canDemoteTo: "JR_SUPPORTER", pointThreshold: 150, defaultPoints: 200 },
  JR_SUPPORTER: { label: "Jr. Supporter", level: 1, canDemoteTo: null, pointThreshold: 0, defaultPoints: 150 },
  USER: { label: "User", level: 0, canDemoteTo: null, pointThreshold: null, defaultPoints: 0 },
}

const VIOLATIONS = {
  BAN_WITHOUT_REASON: { label: "Ban ohne Begründung", points: -5 },
  UNFAIR_PUNISHMENT: { label: "Unfaire oder ungerechtfertigte Strafe gegen Spieler", points: -10 },
  ADMIN_ABUSE: { label: "Missbrauch der Admin-Rechte", points: -20 },
  INSULT_BEHAVIOR: { label: "Beleidigung oder schlechtes Verhalten gegenüber Spielern", points: -15 },
  INACTIVE: { label: "Inaktiv ohne Abmeldung (z. B. 2 Wochen)", points: -10 },
  REPEATED_MISCONDUCT: { label: "Wiederholtes Fehlverhalten trotz Ermahnung", points: -30 },
  SPAMMING: { label: "Spamming von Befehlen oder Nachrichten", points: -5 },
  SERIOUS_VIOLATION: { label: "Schwere Regelverstöße", points: -20 },
}

// Admin Login-Daten
const adminUsername = "owner"
const adminPassword = "admin123"

// State management
let users = []
let requests = []
let violations = []
let loggedInUser = null
let viewMode = false

// DOM Elements
const elements = {}

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  // Cache DOM elements
  cacheElements()

  // Load data from localStorage
  loadDataFromLocalStorage()

  // Check for view mode URL parameter
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.get("view") === "true") {
    viewMode = true
    loggedInUser = { username: "Besucher", role: "viewer" }
    showDashboard()
  }

  // Add event listeners
  addEventListeners()

  // Display rules in the dashboard
  displayRules()
})

// Cache DOM elements for better performance
function cacheElements() {
  // Login section
  elements.loginSection = document.getElementById("login-section")
  elements.username = document.getElementById("username")
  elements.password = document.getElementById("password")
  elements.loginMessage = document.getElementById("login-message")

  // Dashboard section
  elements.dashboardSection = document.getElementById("dashboard-section")
  elements.adminPanel = document.getElementById("admin-panel")
  elements.userPanel = document.getElementById("user-panel")
  elements.userList = document.getElementById("user-list")
  elements.requestsList = document.getElementById("requests-list")
  elements.requestBadge = document.getElementById("request-badge")
  elements.rulesContainer = document.getElementById("rules-container")

  // Visitor section
  elements.visitorSection = document.getElementById("visitor-section")
  elements.wishText = document.getElementById("wish-text")
  elements.pointsUsername = document.getElementById("points-username")
  elements.pointsAmount = document.getElementById("points-amount")
  elements.pointsReason = document.getElementById("points-reason")
  elements.visitorMessage = document.getElementById("visitor-message")

  // Forms
  elements.newUsername = document.getElementById("new-username")
  elements.newPoints = document.getElementById("new-points")
  elements.newRank = document.getElementById("new-rank")
  elements.targetUsername = document.getElementById("target-username")
  elements.modifyPoints = document.getElementById("modify-points")
  elements.violationType = document.getElementById("violation-type")

  // Modals
  elements.loginHelpModal = document.getElementById("login-help-modal")
}

// Add event listeners
function addEventListeners() {
  // Window events
  window.addEventListener("beforeunload", saveDataToLocalStorage)

  // Modal events
  window.onclick = (event) => {
    if (event.target === elements.loginHelpModal) {
      closeLoginHelp()
    }
  }
}

// Daten im localStorage speichern
function saveDataToLocalStorage() {
  localStorage.setItem("punkteSystemUsers", JSON.stringify(users))
  localStorage.setItem("punkteSystemRequests", JSON.stringify(requests))
  localStorage.setItem("punkteSystemViolations", JSON.stringify(violations))
}

// Daten aus dem localStorage laden
function loadDataFromLocalStorage() {
  const savedUsers = localStorage.getItem("punkteSystemUsers")
  if (savedUsers) {
    users = JSON.parse(savedUsers)
  } else {
    // Initialize with default users if none exist
    users = [
      { username: "Spieler1", points: 500, rank: "MODERATOR" },
      { username: "Spieler2", points: 400, rank: "ADMIN" },
    ]
  }

  const savedRequests = localStorage.getItem("punkteSystemRequests")
  if (savedRequests) {
    requests = JSON.parse(savedRequests)
  }

  const savedViolations = localStorage.getItem("punkteSystemViolations")
  if (savedViolations) {
    violations = JSON.parse(savedViolations)
  }
}

// Login-Funktion
function login() {
  const username = elements.username.value.trim()
  const password = elements.password.value.trim()

  // Owner login
  if (username === adminUsername && password === adminPassword) {
    loggedInUser = { username: adminUsername, role: "OWNER" }
    showDashboard()
    return
  }

  // Admin view-only login
  if (username === "admin" && password === "admin") {
    loggedInUser = { username: "Admin", role: "ADMIN" }
    viewMode = true
    showDashboard()
    return
  }

  // Normale Benutzer (Passwortprüfung entfällt hier)
  const user = users.find((u) => u.username.toLowerCase() === username.toLowerCase())
  if (user) {
    loggedInUser = { username: user.username, role: user.rank }
    showDashboard()
  } else {
    elements.loginMessage.textContent = "Ungültiger Benutzername oder Passwort!"
    elements.loginMessage.style.animation = "shake 0.5s"
    setTimeout(() => {
      elements.loginMessage.style.animation = ""
    }, 500)
  }
}

// Dashboard anzeigen und Login-Bereich ausblenden
function showDashboard() {
  elements.loginSection.classList.remove("active")
  elements.visitorSection.classList.remove("active")
  elements.dashboardSection.classList.add("active")

  if (loggedInUser.role === "OWNER" || loggedInUser.role === "CO_OWNER") {
    elements.adminPanel.style.display = "block"
    elements.userPanel.style.display = "none"
    updateUserList()
    updateRequestsList()
    updateRequestBadge()
  } else if (loggedInUser.role === "ADMIN" || loggedInUser.role === "JR_ADMIN" || loggedInUser.role === "viewer") {
    // Admin kann nur anschauen
    elements.adminPanel.style.display = "block"
    elements.userPanel.style.display = "none"
    updateUserList(true) // true = nur Ansicht

    // Anfragen-Tab ausblenden für Admin/Viewer
    document.querySelector("[onclick=\"switchAdminTab('requests-tab')\"]").style.display = "none"
  } else {
    elements.adminPanel.style.display = "none"
    elements.userPanel.style.display = "block"
    updateUserStats()
  }
}

// Besucher-Formular anzeigen
function showVisitorForm() {
  elements.loginSection.classList.remove("active")
  elements.dashboardSection.classList.remove("active")
  elements.visitorSection.classList.add("active")

  // Standardmäßig den ersten Tab anzeigen
  switchTab("wish-tab")
}

// Zurück zum Login
function backToLogin() {
  elements.visitorSection.classList.remove("active")
  elements.loginSection.classList.add("active")

  // Formularfelder zurücksetzen
  elements.wishText.value = ""
  elements.pointsUsername.value = ""
  elements.pointsAmount.value = ""
  elements.pointsReason.value = ""
  elements.visitorMessage.textContent = ""
}

// Logout-Funktion
function logout() {
  loggedInUser = null
  viewMode = false
  elements.username.value = ""
  elements.password.value = ""
  elements.loginMessage.textContent = ""
  elements.dashboardSection.classList.remove("active")
  elements.loginSection.classList.add("active")

  // URL-Parameter entfernen
  const url = new URL(window.location.href)
  url.searchParams.delete("view")
  window.history.replaceState({}, document.title, url.pathname)
}

// Tabs wechseln (Besucher-Bereich)
function switchTab(tabId) {
  // Alle Tab-Buttons deaktivieren
  const tabButtons = document.querySelectorAll("#visitor-section .tab-btn")
  tabButtons.forEach((btn) => btn.classList.remove("active"))

  // Alle Tab-Inhalte ausblenden
  const tabContents = document.querySelectorAll("#visitor-section .tab-content")
  tabContents.forEach((content) => content.classList.remove("active"))

  // Gewählten Tab aktivieren
  document.querySelector(`#visitor-section [onclick="switchTab('${tabId}')"]`).classList.add("active")
  document.getElementById(tabId).classList.add("active")
}

// Tabs wechseln (Admin-Bereich)
function switchAdminTab(tabId) {
  // Alle Tab-Buttons deaktivieren
  const tabButtons = document.querySelectorAll("#admin-panel .tab-btn")
  tabButtons.forEach((btn) => btn.classList.remove("active"))

  // Alle Tab-Inhalte ausblenden
  const tabContents = document.querySelectorAll("#admin-panel .tab-content")
  tabContents.forEach((content) => content.classList.remove("active"))

  // Gewählten Tab aktivieren
  document.querySelector(`#admin-panel [onclick="switchAdminTab('${tabId}')"]`).classList.add("active")
  document.getElementById(tabId).classList.add("active")
}

// Wunsch einreichen
function submitWish() {
  const wishText = elements.wishText.value.trim()

  if (!wishText) {
    showVisitorMessage("Bitte gib einen Wunsch oder Vorschlag ein.", "error")
    return
  }

  // Neuen Wunsch erstellen
  const newWish = {
    id: generateId(),
    type: "wish",
    content: wishText,
    date: new Date().toISOString(),
    status: "pending",
  }

  // Zum Anfragen-Array hinzufügen
  requests.push(newWish)
  saveDataToLocalStorage()

  // Bestätigung anzeigen
  showVisitorMessage("Dein Wunsch wurde erfolgreich eingereicht!", "success")
  elements.wishText.value = ""
}

// Punktabzug vorschlagen
function submitPointsRequest() {
  const username = elements.pointsUsername.value.trim()
  const pointsAmount = Number.parseInt(elements.pointsAmount.value.trim())
  const reason = elements.pointsReason.value.trim()

  if (!username || isNaN(pointsAmount) || !reason) {
    showVisitorMessage("Bitte fülle alle Felder aus.", "error")
    return
  }

  // Prüfen, ob der Benutzer existiert
  const userExists = users.some((u) => u.username.toLowerCase() === username.toLowerCase())
  if (!userExists) {
    showVisitorMessage("Dieser Minecraft-Name existiert nicht im System.", "error")
    return
  }

  // Neuen Punktabzug-Vorschlag erstellen
  const newPointsRequest = {
    id: generateId(),
    type: "points",
    username: username,
    points: pointsAmount,
    reason: reason,
    date: new Date().toISOString(),
    status: "pending",
  }

  // Zum Anfragen-Array hinzufügen
  requests.push(newPointsRequest)
  saveDataToLocalStorage()

  // Bestätigung anzeigen
  showVisitorMessage("Dein Punktabzug-Vorschlag wurde erfolgreich eingereicht!", "success")
  elements.pointsUsername.value = ""
  elements.pointsAmount.value = ""
  elements.pointsReason.value = ""
}

// Nachricht im Besucher-Bereich anzeigen
function showVisitorMessage(message, type) {
  elements.visitorMessage.textContent = message

  if (type === "success") {
    elements.visitorMessage.style.color = "#4CAF50"
  } else {
    elements.visitorMessage.style.color = "#f44336"
  }

  // Nach 5 Sekunden ausblenden
  setTimeout(() => {
    elements.visitorMessage.textContent = ""
  }, 5000)
}

// Anfragen-Badge aktualisieren
function updateRequestBadge() {
  const pendingRequests = requests.filter((r) => r.status === "pending").length
  const badge = elements.requestBadge

  badge.textContent = pendingRequests

  if (pendingRequests > 0) {
    badge.style.display = "flex"
    badge.classList.add("pulse")
  } else {
    badge.style.display = "none"
    badge.classList.remove("pulse")
  }
}

// Anfragen-Liste aktualisieren
function updateRequestsList() {
  const requestsList = elements.requestsList
  requestsList.innerHTML = ""

  // Nur ausstehende Anfragen anzeigen
  const pendingRequests = requests.filter((r) => r.status === "pending")

  if (pendingRequests.length === 0) {
    requestsList.innerHTML = '<p class="empty-message">Keine offenen Anfragen vorhanden.</p>'
    return
  }

  // Anfragen nach Datum sortieren (neueste zuerst)
  pendingRequests.sort((a, b) => new Date(b.date) - new Date(a.date))

  // Anfragen anzeigen
  pendingRequests.forEach((request) => {
    const requestItem = document.createElement("div")
    requestItem.className = "request-item"

    const date = new Date(request.date)
    const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`

    let content = ""

    if (request.type === "wish") {
      content = `
        <div class="request-header">
          <span class="request-type">Wunsch/Vorschlag</span>
          <span class="request-date">${formattedDate}</span>
        </div>
        <div class="request-content">
          <p>${request.content}</p>
        </div>
      `
    } else if (request.type === "points") {
      content = `
        <div class="request-header">
          <span class="request-type">Punktabzug für ${request.username}</span>
          <span class="request-date">${formattedDate}</span>
        </div>
        <div class="request-content">
          <p><strong>Punktabzug:</strong> ${request.points}</p>
          <p><strong>Grund:</strong> ${request.reason}</p>
        </div>
      `
    }

    // Aktionsbuttons hinzufügen
    content += `
      <div class="request-actions">
        <button class="reject-btn" onclick="handleRequest('${request.id}', 'reject')">Ablehnen</button>
        <button class="accept-btn" onclick="handleRequest('${request.id}', 'accept')">Akzeptieren</button>
      </div>
    `

    requestItem.innerHTML = content
    requestsList.appendChild(requestItem)
  })
}

// Anfrage bearbeiten (akzeptieren oder ablehnen)
function handleRequest(requestId, action) {
  const request = requests.find((r) => r.id === requestId)

  if (!request) return

  if (action === "accept") {
    // Accept request
    if (request.type === "points") {
      // Apply point deduction
      const user = users.find((u) => u.username.toLowerCase() === request.username.toLowerCase())
      if (user) {
        user.points = Math.max(0, user.points - request.points)

        // Record violation
        recordViolation(user.username, "CUSTOM", request.reason, request.points)

        // Check for demotion
        checkForDemotion(user)

        showNotification(`${request.points} Punkte wurden von ${request.username} abgezogen.`, "success")
        updateUserList()
      }
    } else if (request.type === "wish") {
      showNotification("Wunsch wurde akzeptiert.", "success")
    }
  } else {
    // Reject request
    showNotification("Anfrage wurde abgelehnt.", "info")
  }

  // Update request status
  request.status = action === "accept" ? "accepted" : "rejected"
  saveDataToLocalStorage()

  // Update UI
  updateRequestsList()
  updateRequestBadge()
}

// Zufällige ID generieren
function generateId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Neuer Benutzer erstellen (nur für Owner)
function createUser() {
  if ((loggedInUser.role !== "OWNER" && loggedInUser.role !== "CO_OWNER") || viewMode) return

  const newUsername = elements.newUsername.value.trim()
  const newRank = elements.newRank.value

  // Get default points for the selected role
  const defaultPoints = ROLES[newRank]?.defaultPoints || 0

  if (newUsername) {
    if (users.find((u) => u.username.toLowerCase() === newUsername.toLowerCase())) {
      showNotification("Benutzer existiert bereits.", "error")
      return
    }
    users.push({ username: newUsername, points: defaultPoints, rank: newRank || "JR_SUPPORTER" })
    showNotification(`${newUsername} wurde erfolgreich erstellt mit ${defaultPoints} Punkten.`, "success")
    updateUserList()
    saveDataToLocalStorage()
  } else {
    showNotification("Bitte gib einen Benutzernamen ein.", "error")
  }
}

// Punkte hinzufügen (nur für Owner)
function addPoints() {
  if ((loggedInUser.role !== "OWNER" && loggedInUser.role !== "CO_OWNER") || viewMode) return

  const targetUsername = elements.targetUsername.value.trim()
  const modPoints = Number.parseInt(elements.modifyPoints.value.trim())

  if (targetUsername && !isNaN(modPoints)) {
    const user = users.find((u) => u.username.toLowerCase() === targetUsername.toLowerCase())
    if (user) {
      user.points += modPoints
      showNotification(`${modPoints} Punkte wurden zu ${targetUsername} hinzugefügt.`, "success")
      updateUserList()
      saveDataToLocalStorage()
    } else {
      showNotification("Benutzer nicht gefunden.", "error")
    }
  } else {
    showNotification("Bitte alle Felder korrekt ausfüllen.", "error")
  }
}

// Punkte abziehen (nur für Owner)
function deductPoints() {
  if ((loggedInUser.role !== "OWNER" && loggedInUser.role !== "CO_OWNER") || viewMode) return

  const targetUsername = elements.targetUsername.value.trim()
  const modPoints = Number.parseInt(elements.modifyPoints.value.trim())
  const violationType = elements.violationType ? elements.violationType.value : null

  if (targetUsername && !isNaN(modPoints)) {
    const user = users.find((u) => u.username.toLowerCase() === targetUsername.toLowerCase())
    if (user) {
      // Deduct points
      user.points = Math.max(0, user.points - modPoints)

      // Record violation if a type is selected
      if (violationType && violationType !== "custom") {
        const violation = VIOLATIONS[violationType]
        if (violation) {
          recordViolation(user.username, violationType, violation.label, modPoints)
        }
      }

      // Check for demotion
      checkForDemotion(user)

      showNotification(`${modPoints} Punkte wurden von ${targetUsername} abgezogen.`, "success")
      updateUserList()
      saveDataToLocalStorage()
    } else {
      showNotification("Benutzer nicht gefunden.", "error")
    }
  } else {
    showNotification("Bitte alle Felder korrekt ausfüllen.", "error")
  }
}

function recordViolation(username, type, description, points) {
  violations.push({
    id: generateId(),
    username,
    type,
    description,
    points,
    date: new Date().toISOString(),
    reportedBy: loggedInUser.username,
  })

  saveDataToLocalStorage()
}

// Enhance the checkForDemotion function to handle all roles
function checkForDemotion(user) {
  // Skip if user is OWNER or already at lowest rank
  if (user.rank === "OWNER" || user.rank === "USER") {
    return
  }

  const roleInfo = ROLES[user.rank]
  if (!roleInfo || roleInfo.pointThreshold === null) {
    return
  }

  // Check if points are below threshold
  if (user.points < roleInfo.pointThreshold) {
    // Demote user
    const oldRank = user.rank

    // If points are 0 or less, remove from team
    if (user.points <= 0) {
      user.rank = "USER"
      showNotification(`${user.username} wurde aus dem Team entfernt (0 oder weniger Punkte).`, "error")
      return
    }

    // Otherwise demote to the next lower rank
    if (roleInfo.canDemoteTo) {
      user.rank = roleInfo.canDemoteTo
      showNotification(
        `${user.username} wurde von ${getRoleLabel(oldRank)} zu ${getRoleLabel(user.rank)} degradiert.`,
        "warning",
      )
    }
  }
}

function getRoleLabel(role) {
  return ROLES[role]?.label || role
}

// Benutzerstatistik aktualisieren
function updateUserStats() {
  const user = users.find((u) => u.username.toLowerCase() === loggedInUser.username.toLowerCase())
  const userStats = document.getElementById("user-stats")

  if (user) {
    // Create rank badge
    const rankClass = `rank-${user.rank.toLowerCase()}`
    const rankBadge = `<span class="rank-badge ${rankClass}">${getRoleLabel(user.rank)}</span>`

    // Get position in ranking
    const sortedUsers = [...users].sort((a, b) => b.points - a.points)
    const position = sortedUsers.findIndex((u) => u.username.toLowerCase() === loggedInUser.username.toLowerCase()) + 1

    userStats.innerHTML = `
      <div style="display: flex; align-items: center; margin-bottom: 15px;">
        <img src="https://mc-heads.net/avatar/${user.username}/64" 
             onerror="this.src='https://ui-avatars.com/api/?name=${user.username}&size=64&background=random'"
             style="width: 64px; height: 64px; border-radius: 5px; margin-right: 15px; border: 2px solid #555;">
        <div>
          <h3>${user.username} ${rankBadge}</h3>
          <p>Rang in der Bestenliste: <strong>#${position}</strong></p>
        </div>
      </div>
      <p>Punkte: <strong>${user.points}</strong></p>
    `
  } else {
    userStats.innerHTML = "<p>Keine Benutzerdaten gefunden.</p>"
  }
}

// Benutzerliste aktualisieren (Owner-Bereich)
function updateUserList(viewOnly = false) {
  const userList = elements.userList
  userList.innerHTML = "" // Liste leeren

  // Sort users by points (descending)
  const sortedUsers = [...users].sort((a, b) => b.points - a.points)

  sortedUsers.forEach((user, index) => {
    // Create container for the user
    const item = document.createElement("div")
    item.classList.add("user-item")

    // Minecraft Avatar
    const avatar = document.createElement("img")
    avatar.classList.add("user-avatar")
    avatar.src = `https://mc-heads.net/avatar/${user.username}/50`
    avatar.alt = user.username
    avatar.onerror = function () {
      this.src = `https://ui-avatars.com/api/?name=${user.username}&size=50&background=random`
    }

    // User details
    const details = document.createElement("div")
    details.classList.add("user-details")

    // Role badge
    const rankClass = `rank-${user.rank.toLowerCase()}`
    const rankBadge = `<span class="rank-badge ${rankClass}">${getRoleLabel(user.rank)}</span>`

    details.innerHTML = `
      <strong>#${index + 1} ${user.username}</strong> ${rankBadge}<br>
      Punkte: ${user.points}
    `

    // Action buttons (only for OWNER and not in view mode)
    if (!viewOnly && (loggedInUser.role === "OWNER" || loggedInUser.role === "CO_OWNER")) {
      const actions = document.createElement("div")
      actions.classList.add("user-actions")

      // Edit button
      const editBtn = document.createElement("button")
      editBtn.innerHTML = "✏️"
      editBtn.title = "Benutzer bearbeiten"
      editBtn.style.padding = "5px"
      editBtn.style.margin = "0"
      editBtn.addEventListener("click", (e) => {
        e.stopPropagation()
        editUser(user.username)
      })

      // Delete button
      const deleteBtn = document.createElement("button")
      deleteBtn.innerHTML = "🗑️"
      deleteBtn.title = "Benutzer löschen"
      deleteBtn.style.padding = "5px"
      deleteBtn.style.margin = "0"
      deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation()
        deleteUser(user.username)
      })

      actions.appendChild(editBtn)
      actions.appendChild(deleteBtn)
      item.appendChild(actions)
    }

    // Click on user to select
    item.addEventListener("click", () => {
      elements.targetUsername.value = user.username
      if (!viewOnly && (loggedInUser.role === "OWNER" || loggedInUser.role === "CO_OWNER")) {
        elements.modifyPoints.focus()
      }
    })

    item.appendChild(avatar)
    item.appendChild(details)
    userList.appendChild(item)
  })
}

// Display rules in the dashboard
function displayRules() {
  if (!elements.rulesContainer) return

  elements.rulesContainer.innerHTML = `
    <div class="rules-section">
      <h3>⚠ Punktabzüge für Regelverstöße</h3>
      <table class="rules-table">
        <tr>
          <th>Verstoß</th>
          <th>Punktabzug</th>
        </tr>
        <tr>
          <td>Ban ohne Begründung</td>
          <td>-5 Punkte</td>
        </tr>
        <tr>
          <td>Unfaire oder ungerechtfertigte Strafe gegen Spieler</td>
          <td>-10 Punkte</td>
        </tr>
        <tr>
          <td>Missbrauch der Admin-Rechte (z. B. sich OP geben, ohne Erlaubnis)</td>
          <td>-20 Punkte</td>
        </tr>
        <tr>
          <td>Beleidigung oder schlechtes Verhalten gegenüber Spielern</td>
          <td>-15 Punkte</td>
        </tr>
        <tr>
          <td>Inaktiv ohne Abmeldung (z. B. 2 Wochen)</td>
          <td>-10 Punkte</td>
        </tr>
        <tr>
          <td>Wiederholtes Fehlverhalten trotz Ermahnung</td>
          <td>-30 Punkte</td>
        </tr>
        <tr>
          <td>Spamming von Befehlen oder Nachrichten</td>
          <td>-5 Punkte</td>
        </tr>
        <tr>
          <td>Schwere Regelverstöße (z. B. Server- oder Spieler-Daten manipulieren)</td>
          <td>-20 Punkte</td>
        </tr>
      </table>
    </div>
    
    <div class="rules-section">
      <h3>📉 Degradierungssystem</h3>
      <table class="rules-table">
        <tr>
          <th>Rang</th>
          <th>Standard-Punkte</th>
          <th>Punkte für Degradierung</th>
        </tr>
        <tr>
          <td>Co-Owner</td>
          <td>750 Punkte</td>
          <td>500 Punkte → Admin</td>
        </tr>
        <tr>
          <td>Developer</td>
          <td>500 Punkte</td>
          <td>250 Punkte → Entfernt</td>
        </tr>
        <tr>
          <td>Admin</td>
          <td>500 Punkte</td>
          <td>400 Punkte → Jr. Admin</td>
        </tr>
        <tr>
          <td>Jr. Admin</td>
          <td>400 Punkte</td>
          <td>300 Punkte → Moderator</td>
        </tr>
        <tr>
          <td>Moderator</td>
          <td>300 Punkte</td>
          <td>250 Punkte → Jr. Moderator</td>
        </tr>
        <tr>
          <td>Jr. Moderator</td>
          <td>250 Punkte</td>
          <td>200 Punkte → Supporter</td>
        </tr>
        <tr>
          <td>Sr. Builder</td>
          <td>300 Punkte</td>
          <td>250 Punkte → Builder</td>
        </tr>
        <tr>
          <td>Builder</td>
          <td>200 Punkte</td>
          <td>150 Punkte → Entfernt</td>
        </tr>
        <tr>
          <td>Supporter</td>
          <td>200 Punkte</td>
          <td>150 Punkte → Jr. Supporter</td>
        </tr>
        <tr>
          <td>Jr. Supporter</td>
          <td>150 Punkte</td>
          <td>0 Punkte → Entfernt aus dem Team</td>
        </tr>
      </table>
      <div class="warning-box">
        ⚠️ Wenn ein Teammitglied unter 0 Punkte fällt, wird es direkt aus dem Team entfernt!
      </div>
    </div>
    
    <div class="rules-section">
      <h3>📌 Wichtige Regeln</h3>
      <ol>
        <li>Punkte werden am 1. jedes Monats zurückgesetzt, aber Degradierungen bleiben bestehen.</li>
        <li>Admins und Co-Owner müssen Regelverstöße im Discord protokollieren (z. B. wenn sie einen Spieler bannen).</li>
        <li>Bei 0 Punkten oder weniger wird ein Teammitglied entfernt.</li>
        <li>Owner & Co-Owner können Punkte zurücksetzen oder vergeben, falls jemand unfair behandelt wurde.</li>
      </ol>
    </div>
  `
}

// Benutzer bearbeiten
function editUser(username) {
  if (viewMode) return
  const user = users.find((u) => u.username === username)
  if (!user) return

  const newRank = prompt(`Neuer Rang für ${username} (aktuell: ${getRoleLabel(user.rank)}):`, user.rank)
  if (newRank === null) return

  const newPoints = prompt(`Neue Punktzahl für ${username} (aktuell: ${user.points}):`, user.points)
  if (newPoints === null) return

  user.rank = newRank
  user.points = Number.parseInt(newPoints) || 0

  updateUserList()
  saveDataToLocalStorage()
  showNotification(`Benutzer ${username} wurde aktualisiert.`, "success")
}

// Benutzer löschen
function deleteUser(username) {
  if (viewMode) return
  if (!confirm(`Möchtest du den Benutzer ${username} wirklich löschen?`)) return

  const index = users.findIndex((u) => u.username === username)
  if (index !== -1) {
    users.splice(index, 1)
    updateUserList()
    saveDataToLocalStorage()
    showNotification(`Benutzer ${username} wurde gelöscht.`, "success")
  }
}

// Füge diese Funktionen für das Login-Hilfe-Modal hinzu
function showLoginHelp() {
  elements.loginHelpModal.style.display = "flex"
}

function closeLoginHelp() {
  elements.loginHelpModal.style.display = "none"
}

// Benachrichtigung anzeigen
function showNotification(message, type = "info") {
  // Remove existing notification
  const existingNotification = document.querySelector(".notification")
  if (existingNotification) {
    existingNotification.remove()
  }

  // Create new notification
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.textContent = message

  // Styling
  notification.style.position = "fixed"
  notification.style.bottom = "20px"
  notification.style.right = "20px"
  notification.style.padding = "10px 20px"
  notification.style.borderRadius = "5px"
  notification.style.boxShadow = "0 3px 10px rgba(0,0,0,0.2)"
  notification.style.zIndex = "1000"
  notification.style.maxWidth = "300px"
  notification.style.animation = "fadeIn 0.3s"

  // Color based on type
  if (type === "success") {
    notification.style.backgroundColor = "#4CAF50"
    notification.style.color = "white"
  } else if (type === "error") {
    notification.style.backgroundColor = "#f44336"
    notification.style.color = "white"
  } else if (type === "warning") {
    notification.style.backgroundColor = "#ff9800"
    notification.style.color = "white"
  } else {
    notification.style.backgroundColor = "#2196F3"
    notification.style.color = "white"
  }

  document.body.appendChild(notification)

  // Hide after 3 seconds
  setTimeout(() => {
    notification.style.animation = "fadeOut 0.3s"
    setTimeout(() => {
      notification.remove()
    }, 300)
  }, 3000)
}

// Monthly points reset function (to be called by a cron job or manually)
function resetMonthlyPoints() {
  if (loggedInUser.role !== "OWNER" && loggedInUser.role !== "CO_OWNER") return

  if (
    !confirm(
      "Möchtest du die Punkte aller Teammitglieder zurücksetzen? Dies geschieht normalerweise am 1. des Monats.\n\nHinweis: Degradierungen bleiben bestehen!",
    )
  ) {
    return
  }

  // Reset points for all team members (except regular users)
  users.forEach((user) => {
    if (user.rank !== "USER") {
      // Reset to default points for their current rank
      user.points = ROLES[user.rank]?.defaultPoints || 0
    }
  })

  saveDataToLocalStorage()
  updateUserList()
  showNotification("Punkte wurden für alle Teammitglieder zurückgesetzt.", "success")
}

// Export and import data
function exportData() {
  const data = {
    users: users,
    requests: requests,
    violations: violations,
  }

  const dataStr = JSON.stringify(data, null, 2)
  const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

  const exportFileDefaultName = "punktesystem-daten.json"

  const linkElement = document.createElement("a")
  linkElement.setAttribute("href", dataUri)
  linkElement.setAttribute("download", exportFileDefaultName)
  linkElement.click()
}

function importData() {
  if (viewMode) {
    showNotification("Im Ansichtsmodus können keine Daten importiert werden.", "error")
    return
  }

  const input = document.createElement("input")
  input.type = "file"
  input.accept = ".json"

  input.onchange = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result)

        if (importedData.users && Array.isArray(importedData.users)) {
          if (confirm(`${importedData.users.length} Benutzer gefunden. Möchtest du die aktuellen Daten ersetzen?`)) {
            users = importedData.users

            // Import requests if available
            if (importedData.requests && Array.isArray(importedData.requests)) {
              requests = importedData.requests
            }

            // Import violations if available
            if (importedData.violations && Array.isArray(importedData.violations)) {
              violations = importedData.violations
            }

            saveDataToLocalStorage()
            updateUserList()
            updateRequestsList()
            updateRequestBadge()
            showNotification("Daten erfolgreich importiert!", "success")
          }
        } else {
          showNotification("Ungültiges Dateiformat. Bitte eine gültige JSON-Datei importieren.", "error")
        }
      } catch (error) {
        showNotification("Fehler beim Importieren: " + error.message, "error")
      }
    }

    reader.readAsText(file)
  }

  input.click()
}


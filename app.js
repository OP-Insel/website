// Admin Login-Daten
const adminUsername = "owner"
const adminPassword = "admin123"

// Simulierte Benutzerdaten
let users = [
  { username: "Spieler1", points: 100, rank: "Moderator" },
  { username: "Spieler2", points: 150, rank: "Admin" },
]

// Anfragen-Array für Wünsche und Punktabzug-Vorschläge
let requests = []

let loggedInUser = null
let viewMode = false // Für Besucher-Modus

// Beim Laden der Seite: Daten aus dem localStorage laden
document.addEventListener("DOMContentLoaded", () => {
  loadDataFromLocalStorage()

  // Prüfen, ob URL-Parameter "view=true" vorhanden ist
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.get("view") === "true") {
    viewMode = true
    loggedInUser = { username: "Besucher", role: "viewer" }
    showDashboard()
  }
})

// Daten im localStorage speichern
function saveDataToLocalStorage() {
  localStorage.setItem("punkteSystemUsers", JSON.stringify(users))
  localStorage.setItem("punkteSystemRequests", JSON.stringify(requests))
}

// Daten aus dem localStorage laden
function loadDataFromLocalStorage() {
  const savedUsers = localStorage.getItem("punkteSystemUsers")
  if (savedUsers) {
    users = JSON.parse(savedUsers)
  }

  const savedRequests = localStorage.getItem("punkteSystemRequests")
  if (savedRequests) {
    requests = JSON.parse(savedRequests)
  }
}

// Füge diese Funktionen für das Login-Hilfe-Modal hinzu
function showLoginHelp() {
  const modal = document.getElementById("login-help-modal")
  modal.style.display = "flex"
}

function closeLoginHelp() {
  const modal = document.getElementById("login-help-modal")
  modal.style.display = "none"
}

// Schließe das Modal, wenn außerhalb geklickt wird
window.onclick = (event) => {
  const modal = document.getElementById("login-help-modal")
  if (event.target === modal) {
    modal.style.display = "none"
  }
}

// Login-Funktion
function login() {
  const username = document.getElementById("username").value.trim()
  const password = document.getElementById("password").value.trim()
  const loginMessage = document.getElementById("login-message")

  // Überprüfung für Owner
  if (username === adminUsername && password === adminPassword) {
    loggedInUser = { username: adminUsername, role: "owner" }
    showDashboard()
    return
  }

  // Überprüfung für Admin (kann nur anschauen, nicht ändern)
  if (username === "admin" && password === "admin") {
    loggedInUser = { username: "Admin", role: "admin" }
    viewMode = true
    showDashboard()
    return
  }

  // Normale Benutzer (Passwortprüfung entfällt hier)
  const user = users.find((u) => u.username.toLowerCase() === username.toLowerCase())
  if (user) {
    loggedInUser = { username: user.username, role: "user" }
    showDashboard()
  } else {
    loginMessage.textContent = "Ungültiger Benutzername oder Passwort!"
    loginMessage.style.animation = "shake 0.5s"
    setTimeout(() => {
      loginMessage.style.animation = ""
    }, 500)
  }
}

// Dashboard anzeigen und Login-Bereich ausblenden
function showDashboard() {
  document.getElementById("login-section").classList.remove("active")
  document.getElementById("visitor-section").classList.remove("active")
  document.getElementById("dashboard-section").classList.add("active")

  if (loggedInUser.role === "owner") {
    document.getElementById("admin-panel").style.display = "block"
    document.getElementById("user-panel").style.display = "none"
    updateUserList()
    updateRequestsList()
    updateRequestBadge()
  } else if (loggedInUser.role === "admin" || loggedInUser.role === "viewer") {
    // Admin kann nur anschauen
    document.getElementById("admin-panel").style.display = "block"
    document.getElementById("user-panel").style.display = "none"
    updateUserList(true) // true = nur Ansicht

    // Anfragen-Tab ausblenden für Admin/Viewer
    document.querySelector("[onclick=\"switchAdminTab('requests-tab')\"]").style.display = "none"
  } else {
    document.getElementById("admin-panel").style.display = "none"
    document.getElementById("user-panel").style.display = "block"
    updateUserStats()
  }
}

// Besucher-Formular anzeigen
function showVisitorForm() {
  document.getElementById("login-section").classList.remove("active")
  document.getElementById("dashboard-section").classList.remove("active")
  document.getElementById("visitor-section").classList.add("active")

  // Standardmäßig den ersten Tab anzeigen
  switchTab("wish-tab")
}

// Zurück zum Login
function backToLogin() {
  document.getElementById("visitor-section").classList.remove("active")
  document.getElementById("login-section").classList.add("active")

  // Formularfelder zurücksetzen
  document.getElementById("wish-text").value = ""
  document.getElementById("points-username").value = ""
  document.getElementById("points-amount").value = ""
  document.getElementById("points-reason").value = ""
  document.getElementById("visitor-message").textContent = ""
}

// Logout-Funktion
function logout() {
  loggedInUser = null
  viewMode = false
  document.getElementById("username").value = ""
  document.getElementById("password").value = ""
  document.getElementById("login-message").textContent = ""
  document.getElementById("dashboard-section").classList.remove("active")
  document.getElementById("login-section").classList.add("active")

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
  const wishText = document.getElementById("wish-text").value.trim()

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
  document.getElementById("wish-text").value = ""
}

// Punktabzug vorschlagen
function submitPointsRequest() {
  const username = document.getElementById("points-username").value.trim()
  const pointsAmount = Number.parseInt(document.getElementById("points-amount").value.trim())
  const reason = document.getElementById("points-reason").value.trim()

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
  document.getElementById("points-username").value = ""
  document.getElementById("points-amount").value = ""
  document.getElementById("points-reason").value = ""
}

// Nachricht im Besucher-Bereich anzeigen
function showVisitorMessage(message, type) {
  const visitorMessage = document.getElementById("visitor-message")
  visitorMessage.textContent = message

  if (type === "success") {
    visitorMessage.style.color = "#4CAF50"
  } else {
    visitorMessage.style.color = "#f44336"
  }

  // Nach 5 Sekunden ausblenden
  setTimeout(() => {
    visitorMessage.textContent = ""
  }, 5000)
}

// Anfragen-Badge aktualisieren
function updateRequestBadge() {
  const pendingRequests = requests.filter((r) => r.status === "pending").length
  const badge = document.getElementById("request-badge")

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
  const requestsList = document.getElementById("requests-list")
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
    // Anfrage akzeptieren
    if (request.type === "points") {
      // Punktabzug durchführen
      const user = users.find((u) => u.username.toLowerCase() === request.username.toLowerCase())
      if (user) {
        user.points = Math.max(0, user.points - request.points)
        showNotification(`${request.points} Punkte wurden von ${request.username} abgezogen.`, "success")
        updateUserList()
      }
    } else if (request.type === "wish") {
      showNotification("Wunsch wurde akzeptiert.", "success")
    }
  } else {
    // Anfrage ablehnen
    showNotification("Anfrage wurde abgelehnt.", "info")
  }

  // Status der Anfrage aktualisieren
  request.status = action === "accept" ? "accepted" : "rejected"
  saveDataToLocalStorage()

  // Listen aktualisieren
  updateRequestsList()
  updateRequestBadge()
}

// Zufällige ID generieren
function generateId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Neuer Benutzer erstellen (nur für Owner)
function createUser() {
  if (loggedInUser.role !== "owner" || viewMode) return
  const newUsername = document.getElementById("new-username").value.trim()
  const newPoints = Number.parseInt(document.getElementById("new-points").value.trim())
  const newRank = document.getElementById("new-rank").value

  if (newUsername && !isNaN(newPoints)) {
    if (users.find((u) => u.username.toLowerCase() === newUsername.toLowerCase())) {
      showNotification("Benutzer existiert bereits.", "error")
      return
    }
    users.push({ username: newUsername, points: newPoints, rank: newRank || "Supporter" })
    showNotification(`${newUsername} wurde erfolgreich erstellt.`, "success")
    updateUserList()
    saveDataToLocalStorage()
  } else {
    showNotification("Bitte alle Felder korrekt ausfüllen.", "error")
  }
}

// Punkte hinzufügen (nur für Owner)
function addPoints() {
  if (loggedInUser.role !== "owner" || viewMode) return
  const targetUsername = document.getElementById("target-username").value.trim()
  const modPoints = Number.parseInt(document.getElementById("modify-points").value.trim())

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
  if (loggedInUser.role !== "owner" || viewMode) return
  const targetUsername = document.getElementById("target-username").value.trim()
  const modPoints = Number.parseInt(document.getElementById("modify-points").value.trim())

  if (targetUsername && !isNaN(modPoints)) {
    const user = users.find((u) => u.username.toLowerCase() === targetUsername.toLowerCase())
    if (user) {
      user.points -= modPoints
      if (user.points < 0) user.points = 0
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

// Für Owner: Punkte eines Zielbenutzers anzeigen
function viewPoints() {
  const targetUsername = document.getElementById("target-username").value.trim()
  const adminMessage = document.getElementById("admin-message")
  const user = users.find((u) => u.username.toLowerCase() === targetUsername.toLowerCase())
  if (user) {
    adminMessage.textContent = `${user.username} hat ${user.points} Punkte und ist ${user.rank}.`
  } else {
    adminMessage.textContent = "Benutzer nicht gefunden."
  }
}

// Für normale Benutzer: Eigene Punkte anzeigen
function viewUserPoints() {
  const user = users.find((u) => u.username.toLowerCase() === loggedInUser.username.toLowerCase())
  const userMessage = document.getElementById("user-message")
  if (user) {
    userMessage.textContent = `Du hast ${user.points} Punkte und bist ${user.rank}.`
  } else {
    userMessage.textContent = "Benutzer nicht gefunden."
  }
}

// Benutzerstatistik aktualisieren
function updateUserStats() {
  const user = users.find((u) => u.username.toLowerCase() === loggedInUser.username.toLowerCase())
  const userStats = document.getElementById("user-stats")

  if (user) {
    // Rang-Badge erstellen
    const rankClass = `rank-${user.rank.toLowerCase()}`
    const rankBadge = `<span class="rank-badge ${rankClass}">${user.rank}</span>`

    // Position in der Rangliste ermitteln
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
  const userList = document.getElementById("user-list")
  userList.innerHTML = "" // Liste leeren

  // Sortiere Benutzer nach Punkten (absteigend)
  const sortedUsers = [...users].sort((a, b) => b.points - a.points)

  sortedUsers.forEach((user, index) => {
    // Erzeuge Container für den Benutzer
    const item = document.createElement("div")
    item.classList.add("user-item")

    // Minecraft Avatar (verwende mc-heads.net statt crafatar.com)
    const avatar = document.createElement("img")
    avatar.classList.add("user-avatar")
    avatar.src = `https://mc-heads.net/avatar/${user.username}/50`
    avatar.alt = user.username
    avatar.onerror = function () {
      this.src = `https://ui-avatars.com/api/?name=${user.username}&size=50&background=random`
    }

    // Benutzer-Details (Name, Punkte, Rang)
    const details = document.createElement("div")
    details.classList.add("user-details")

    // Rang-Badge erstellen
    const rankClass = `rank-${user.rank.toLowerCase()}`
    const rankBadge = `<span class="rank-badge ${rankClass}">${user.rank}</span>`

    details.innerHTML = `
      <strong>#${index + 1} ${user.username}</strong> ${rankBadge}<br>
      Punkte: ${user.points}
    `

    // Aktionsbuttons (nur wenn nicht im View-Modus)
    if (!viewOnly && loggedInUser.role === "owner") {
      const actions = document.createElement("div")
      actions.classList.add("user-actions")

      // Bearbeiten-Button
      const editBtn = document.createElement("button")
      editBtn.innerHTML = "✏️"
      editBtn.title = "Benutzer bearbeiten"
      editBtn.style.padding = "5px"
      editBtn.style.margin = "0"
      editBtn.addEventListener("click", (e) => {
        e.stopPropagation()
        editUser(user.username)
      })

      // Löschen-Button
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

    // Bei Klick auf den Benutzer: Benutzername in Zielfeld eintragen
    item.addEventListener("click", () => {
      document.getElementById("target-username").value = user.username
      if (!viewOnly && loggedInUser.role === "owner") {
        document.getElementById("modify-points").focus()
      }
    })

    item.appendChild(avatar)
    item.appendChild(details)
    userList.appendChild(item)
  })
}

// Benutzer bearbeiten
function editUser(username) {
  if (viewMode) return
  const user = users.find((u) => u.username === username)
  if (!user) return

  const newRank = prompt(`Neuer Rang für ${username} (aktuell: ${user.rank}):`, user.rank)
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

// Daten exportieren
function exportData() {
  const data = {
    users: users,
    requests: requests,
  }

  const dataStr = JSON.stringify(data, null, 2)
  const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

  const exportFileDefaultName = "punktesystem-daten.json"

  const linkElement = document.createElement("a")
  linkElement.setAttribute("href", dataUri)
  linkElement.setAttribute("download", exportFileDefaultName)
  linkElement.click()
}

// Daten importieren
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

            // Wenn Anfragen vorhanden sind, auch diese importieren
            if (importedData.requests && Array.isArray(importedData.requests)) {
              requests = importedData.requests
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

// Benachrichtigung anzeigen
function showNotification(message, type = "info") {
  // Bestehende Benachrichtigung entfernen
  const existingNotification = document.querySelector(".notification")
  if (existingNotification) {
    existingNotification.remove()
  }

  // Neue Benachrichtigung erstellen
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

  // Farbe je nach Typ
  if (type === "success") {
    notification.style.backgroundColor = "#4CAF50"
    notification.style.color = "white"
  } else if (type === "error") {
    notification.style.backgroundColor = "#f44336"
    notification.style.color = "white"
  } else {
    notification.style.backgroundColor = "#2196F3"
    notification.style.color = "white"
  }

  document.body.appendChild(notification)

  // Nach 3 Sekunden ausblenden
  setTimeout(() => {
    notification.style.animation = "fadeOut 0.3s"
    setTimeout(() => {
      notification.remove()
    }, 300)
  }, 3000)
}

// Automatisches Speichern beim Verlassen der Seite
window.addEventListener("beforeunload", () => {
  saveDataToLocalStorage()
})


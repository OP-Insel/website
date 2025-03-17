// Admin Login-Daten
const adminUsername = "owner"
const adminPassword = "admin123"

// Simulierte Benutzerdaten
let users = [
  { username: "Spieler1", points: 100, rank: "Moderator" },
  { username: "Spieler2", points: 150, rank: "Admin" },
]

let loggedInUser = null

// Beim Laden der Seite: Daten aus dem localStorage laden
document.addEventListener("DOMContentLoaded", () => {
  loadDataFromLocalStorage()
})

// Daten im localStorage speichern
function saveDataToLocalStorage() {
  localStorage.setItem("punkteSystemUsers", JSON.stringify(users))
}

// Daten aus dem localStorage laden
function loadDataFromLocalStorage() {
  const savedUsers = localStorage.getItem("punkteSystemUsers")
  if (savedUsers) {
    users = JSON.parse(savedUsers)
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

  // Normale Benutzer (Passwortprüfung entfällt hier)
  const user = users.find((u) => u.username.toLowerCase() === username.toLowerCase())
  if (user) {
    loggedInUser = { username: user.username, role: "user" }
    showDashboard()
  } else {
    loginMessage.textContent = "Ungültiger Benutzername oder Passwort!"
  }
}

// Dashboard anzeigen und Login-Bereich ausblenden
function showDashboard() {
  document.getElementById("login-section").classList.remove("active")
  document.getElementById("dashboard-section").classList.add("active")

  if (loggedInUser.role === "owner") {
    document.getElementById("admin-panel").style.display = "block"
    document.getElementById("user-panel").style.display = "none"
    updateUserList()
  } else {
    document.getElementById("admin-panel").style.display = "none"
    document.getElementById("user-panel").style.display = "block"
    updateUserStats()
  }
}

// Logout-Funktion
function logout() {
  loggedInUser = null
  document.getElementById("username").value = ""
  document.getElementById("password").value = ""
  document.getElementById("login-message").textContent = ""
  document.getElementById("dashboard-section").classList.remove("active")
  document.getElementById("login-section").classList.add("active")
}

// Neuer Benutzer erstellen (nur für Owner)
function createUser() {
  if (loggedInUser.role !== "owner") return
  const newUsername = document.getElementById("new-username").value.trim()
  const newPoints = Number.parseInt(document.getElementById("new-points").value.trim())
  const newRank = document.getElementById("new-rank").value

  if (newUsername && !isNaN(newPoints)) {
    if (users.find((u) => u.username.toLowerCase() === newUsername.toLowerCase())) {
      alert("Benutzer existiert bereits.")
      return
    }
    users.push({ username: newUsername, points: newPoints, rank: newRank || "Supporter" })
    alert(`${newUsername} wurde erfolgreich erstellt.`)
    updateUserList()
    saveDataToLocalStorage()
  } else {
    alert("Bitte alle Felder korrekt ausfüllen.")
  }
}

// Punkte hinzufügen (nur für Owner)
function addPoints() {
  if (loggedInUser.role !== "owner") return
  const targetUsername = document.getElementById("target-username").value.trim()
  const modPoints = Number.parseInt(document.getElementById("modify-points").value.trim())

  if (targetUsername && !isNaN(modPoints)) {
    const user = users.find((u) => u.username.toLowerCase() === targetUsername.toLowerCase())
    if (user) {
      user.points += modPoints
      alert(`${modPoints} Punkte wurden zu ${targetUsername} hinzugefügt.`)
      updateUserList()
      saveDataToLocalStorage()
    } else {
      alert("Benutzer nicht gefunden.")
    }
  } else {
    alert("Bitte alle Felder korrekt ausfüllen.")
  }
}

// Punkte abziehen (nur für Owner)
function deductPoints() {
  if (loggedInUser.role !== "owner") return
  const targetUsername = document.getElementById("target-username").value.trim()
  const modPoints = Number.parseInt(document.getElementById("modify-points").value.trim())

  if (targetUsername && !isNaN(modPoints)) {
    const user = users.find((u) => u.username.toLowerCase() === targetUsername.toLowerCase())
    if (user) {
      user.points -= modPoints
      if (user.points < 0) user.points = 0
      alert(`${modPoints} Punkte wurden von ${targetUsername} abgezogen.`)
      updateUserList()
      saveDataToLocalStorage()
    } else {
      alert("Benutzer nicht gefunden.")
    }
  } else {
    alert("Bitte alle Felder korrekt ausfüllen.")
  }
}

// Für Owner: Punkte eines Zielbenutzers anzeigen
function viewPoints() {
  if (loggedInUser.role !== "owner") return
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
    userStats.innerHTML = `
      <h3>${user.username}</h3>
      <p>Punkte: <strong>${user.points}</strong></p>
      <p>Rang: <strong>${user.rank}</strong></p>
    `
  } else {
    userStats.innerHTML = "<p>Keine Benutzerdaten gefunden.</p>"
  }
}

// Benutzerliste aktualisieren (Owner-Bereich)
function updateUserList() {
  const userList = document.getElementById("user-list")
  userList.innerHTML = "" // Liste leeren

  // Sortiere Benutzer nach Punkten (absteigend)
  const sortedUsers = [...users].sort((a, b) => b.points - a.points)

  sortedUsers.forEach((user, index) => {
    // Erzeuge Container für den Benutzer
    const item = document.createElement("div")
    item.classList.add("user-item")

    // Minecraft Avatar (verwende crafatar.com, Overlay optional)
    const avatar = document.createElement("img")
    avatar.classList.add("user-avatar")
    // Hier wird der Benutzername als Minecraft-Name genutzt – passe ggf. an
    avatar.src = `https://crafatar.com/avatars/${user.username}?size=50&overlay`
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
      <strong>${index + 1}. ${user.username}</strong> ${rankBadge}<br>
      Punkte: ${user.points}
    `

    // Aktionsbuttons
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

    // Bei Klick auf den Benutzer: Prompt für Punktabzug
    item.addEventListener("click", () => {
      document.getElementById("target-username").value = user.username
      document.getElementById("modify-points").focus()
    })

    item.appendChild(avatar)
    item.appendChild(details)
    item.appendChild(actions)
    userList.appendChild(item)
  })
}

// Benutzer bearbeiten
function editUser(username) {
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
  alert(`Benutzer ${username} wurde aktualisiert.`)
}

// Benutzer löschen
function deleteUser(username) {
  if (!confirm(`Möchtest du den Benutzer ${username} wirklich löschen?`)) return

  const index = users.findIndex((u) => u.username === username)
  if (index !== -1) {
    users.splice(index, 1)
    updateUserList()
    saveDataToLocalStorage()
    alert(`Benutzer ${username} wurde gelöscht.`)
  }
}

// Daten exportieren
function exportData() {
  const dataStr = JSON.stringify(users, null, 2)
  const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

  const exportFileDefaultName = "punktesystem-daten.json"

  const linkElement = document.createElement("a")
  linkElement.setAttribute("href", dataUri)
  linkElement.setAttribute("download", exportFileDefaultName)
  linkElement.click()
}

// Daten importieren
function importData() {
  const input = document.createElement("input")
  input.type = "file"
  input.accept = ".json"

  input.onchange = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result)
        if (Array.isArray(importedData)) {
          if (confirm(`${importedData.length} Benutzer gefunden. Möchtest du die aktuellen Daten ersetzen?`)) {
            users = importedData
            saveDataToLocalStorage()
            updateUserList()
            alert("Daten erfolgreich importiert!")
          }
        } else {
          alert("Ungültiges Dateiformat. Bitte eine gültige JSON-Datei importieren.")
        }
      } catch (error) {
        alert("Fehler beim Importieren: " + error.message)
      }
    }

    reader.readAsText(file)
  }

  input.click()
}

// Automatisches Speichern beim Verlassen der Seite
window.addEventListener("beforeunload", () => {
  saveDataToLocalStorage()
})


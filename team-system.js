// Vorinitialisierte Teammitglieder
const INITIAL_USERS = [
  {
    mcname: "MaxMustermann",
    rank: "owner",
    points: Number.POSITIVE_INFINITY,
    warnings: [],
  },
  {
    mcname: "MineCraftPro",
    rank: "coowner",
    points: 1000,
    warnings: [],
  },
  {
    mcname: "BuildMaster",
    rank: "admin",
    points: 800,
    warnings: [],
  },
  {
    mcname: "GameMaster123",
    rank: "jradmin",
    points: 700,
    warnings: [],
  },
  {
    mcname: "ModeratorPro",
    rank: "moderator",
    points: 600,
    warnings: [],
  },
  {
    mcname: "JrMod2024",
    rank: "jrmoderator",
    points: 500,
    warnings: [],
  },
  {
    mcname: "HelperElite",
    rank: "supporter",
    points: 400,
    warnings: [],
  },
  {
    mcname: "NewHelper",
    rank: "jrsupporter",
    points: 300,
    warnings: [],
  },
  {
    mcname: "CreativBuilder",
    rank: "builder",
    points: 400,
    warnings: [],
  },
]

// Rang-Anmeldedaten
const RANK_DATA = {
  owner: {
    password: "owner123",
    isAdmin: true,
    canAddOwner: true,
    canDeductPoints: true,
    canAddUsers: true,
  },
  coowner: {
    password: "coowner123",
    isAdmin: true,
    canAddOwner: false,
    canDeductPoints: true,
    canAddUsers: true,
  },
  admin: {
    password: "admin123",
    isAdmin: true,
    canAddOwner: false,
    canDeductPoints: false,
    canAddUsers: false,
  },
  jradmin: {
    password: "jradmin123",
    isAdmin: true,
    canAddOwner: false,
    canDeductPoints: false,
    canAddUsers: false,
  },
  moderator: {
    password: "mod123",
    isAdmin: true,
    canAddOwner: false,
    canDeductPoints: false,
    canAddUsers: false,
  },
  jrmoderator: {
    password: "jrmod123",
    isAdmin: true,
    canAddOwner: false,
    canDeductPoints: false,
    canAddUsers: false,
  },
  supporter: {
    password: "supporter123",
    isAdmin: true,
    canAddOwner: false,
    canDeductPoints: false,
    canAddUsers: false,
  },
  jrsupporter: {
    password: "jrsupporter123",
    isAdmin: true,
    canAddOwner: false,
    canDeductPoints: false,
    canAddUsers: false,
  },
  builder: {
    password: "builder123",
    isAdmin: true,
    canAddOwner: false,
    canDeductPoints: false,
    canAddUsers: false,
  },
}

// Benutzer-Daten initialisieren oder aus localStorage laden
let USERS = JSON.parse(localStorage.getItem("users")) || INITIAL_USERS

// Wenn keine Benutzer im localStorage sind, initialisiere sie
if (!localStorage.getItem("users")) {
  localStorage.setItem("users", JSON.stringify(INITIAL_USERS))
}

// Vorschläge
const SUGGESTIONS = JSON.parse(localStorage.getItem("suggestions")) || []

// Deklariere die updateSuggestionsList Variable als leere Funktion
const updateSuggestionsList = () => {} // Deklariere die updateSuggestionsList Variable als leere Funktion
// Ausgewählter Benutzer für Aktionen
let selectedUser = null
const closePopup = () => {
  const popup = document.querySelector(".minecraft-popup")
  const backdrop = document.getElementById("popupBackdrop")
  if (popup) {
    popup.remove()
  }
  if (backdrop) {
    backdrop.classList.remove("show")
  }
} // Deklariere die closePopup Variable als leere Funktion

// Modifiziere die updateTeamList Funktion
function updateTeamList() {
  const teamList = document.getElementById("teamList")
  const currentRank = localStorage.getItem("currentRank")
  if (!teamList) return

  teamList.innerHTML = ""

  USERS.forEach((user) => {
    const memberCard = document.createElement("div")
    memberCard.className = "member-card"

    memberCard.dataset.username = user.mcname
    memberCard.dataset.rank = user.rank
    memberCard.dataset.points = user.points

    // Füge das 3-Punkte-Menü hinzu (nur für Owner und Co-Owner sichtbar)
    const menuVisible = currentRank === "owner" || currentRank === "coowner"

    memberCard.innerHTML = `
            <img src="https://mc-heads.net/avatar/${user.mcname}" alt="${user.mcname}" class="mc-head">
            <div class="member-info">
                <div class="member-header">
                    <h3 class="rank-${user.rank}">${user.rank}</h3>
                    ${
                      menuVisible
                        ? `
                        <button class="three-dots-menu" onclick="showOptionsMenu(event, '${user.mcname}')">
                            ⋮
                        </button>
                    `
                        : ""
                    }
                </div>
                <p>${user.mcname}</p>
                <p class="points">Punkte: ${user.points === Number.POSITIVE_INFINITY ? "∞" : user.points}</p>
            </div>
        `

    teamList.appendChild(memberCard)
  })

  if (USERS.length === 0) {
    teamList.innerHTML = '<p class="no-users">Noch keine Teammitglieder hinzugefügt</p>'
  }

  updateSuggestionsList()
}

// Funktion zum Anzeigen des Options-Menüs
function showOptionsMenu(event, username) {
  event.stopPropagation()

  const optionsMenu = document.getElementById("optionsMenu")
  const user = USERS.find((u) => u.mcname === username)

  if (!user) return

  // Position des Menüs setzen
  const button = event.target
  const rect = button.getBoundingClientRect()
  optionsMenu.style.top = `${rect.bottom + window.scrollY}px`
  optionsMenu.style.left = `${rect.left}px`

  // Menü mit Optionen füllen
  optionsMenu.innerHTML = `
        <div class="menu-item" onclick="editUserRank('${username}')">Rang ändern</div>
        <div class="menu-item" onclick="editPoints()">Punkte bearbeiten</div>
        <div class="menu-item" onclick="resetPoints('${username}')">Punkte zurücksetzen</div>
        <div class="menu-item" onclick="showWarnings('${username}')">Verwarnungen</div>
        <div class="menu-item warning" onclick="removeUser('${username}')">Benutzer entfernen</div>
    `

  // Menü anzeigen
  optionsMenu.classList.add("show")
  selectedUser = user
}

// Neue Funktionen für die Menü-Optionen
function editUserRank(username) {
  const user = USERS.find((u) => u.mcname === username)
  if (!user) return

  const popup = document.createElement("div")
  popup.className = "minecraft-popup"
  popup.innerHTML = `
        <h3>Rang ändern</h3>
        <select id="newRank">
            <option value="admin" ${user.rank === "admin" ? "selected" : ""}>Admin</option>
            <option value="jradmin" ${user.rank === "jradmin" ? "selected" : ""}>Jr. Admin</option>
            <option value="moderator" ${user.rank === "moderator" ? "selected" : ""}>Moderator</option>
            <option value="jrmoderator" ${user.rank === "jrmoderator" ? "selected" : ""}>Jr. Moderator</option>
            <option value="supporter" ${user.rank === "supporter" ? "selected" : ""}>Supporter</option>
            <option value="jrsupporter" ${user.rank === "jrsupporter" ? "selected" : ""}>Jr. Supporter</option>
            <option value="builder" ${user.rank === "builder" ? "selected" : ""}>Builder</option>
        </select>
        <div class="popup-buttons">
            <button onclick="saveNewRank('${username}')">Speichern</button>
            <button onclick="closePopup()" class="cancel-button">Abbrechen</button>
        </div>
    `

  document.body.appendChild(popup)
  document.getElementById("popupBackdrop").classList.add("show")
}

function saveNewRank(username) {
  const newRank = document.getElementById("newRank").value
  const userIndex = USERS.findIndex((u) => u.mcname === username)

  if (userIndex !== -1) {
    USERS[userIndex].rank = newRank
    localStorage.setItem("users", JSON.stringify(USERS))
    updateTeamList()
  }

  closePopup()
}

function resetPoints(username) {
  if (confirm(`Möchtest du wirklich die Punkte von ${username} zurücksetzen?`)) {
    const userIndex = USERS.findIndex((u) => u.mcname === username)
    if (userIndex !== -1) {
      USERS[userIndex].points = 500 // Standardpunktzahl
      localStorage.setItem("users", JSON.stringify(USERS))
      updateTeamList()
    }
  }
}

function showWarnings(username) {
  const user = USERS.find((u) => u.mcname === username)
  if (!user) return

  const warnings = user.warnings || []

  const popup = document.createElement("div")
  popup.className = "minecraft-popup"
  popup.innerHTML = `
        <h3>Verwarnungen - ${username}</h3>
        <div class="warnings-list">
            ${
              warnings.length > 0
                ? warnings
                    .map(
                      (w) => `
                <div class="warning-item">
                    <p><strong>Datum:</strong> ${new Date(w.date).toLocaleString()}</p>
                    <p><strong>Grund:</strong> ${w.reason}</p>
                    <p><strong>Von:</strong> ${w.by}</p>
                </div>
            `,
                    )
                    .join("")
                : "<p>Keine Verwarnungen vorhanden</p>"
            }
        </div>
        <button onclick="addWarning('${username}')" class="warning-button">Neue Verwarnung</button>
        <button onclick="closePopup()" class="cancel-button">Schließen</button>
    `

  document.body.appendChild(popup)
  document.getElementById("popupBackdrop").classList.add("show")
}

function addWarning(username) {
  const popup = document.createElement("div")
  popup.className = "minecraft-popup"
  popup.innerHTML = `
        <h3>Neue Verwarnung</h3>
        <textarea id="warningReason" placeholder="Grund der Verwarnung"></textarea>
        <div class="popup-buttons">
            <button onclick="saveWarning('${username}')">Speichern</button>
            <button onclick="closePopup()" class="cancel-button">Abbrechen</button>
        </div>
    `

  document.body.appendChild(popup)
}

function saveWarning(username) {
  const reason = document.getElementById("warningReason").value
  if (!reason) return

  const userIndex = USERS.findIndex((u) => u.mcname === username)
  if (userIndex !== -1) {
    if (!USERS[userIndex].warnings) USERS[userIndex].warnings = []

    USERS[userIndex].warnings.push({
      date: new Date(),
      reason: reason,
      by: localStorage.getItem("currentRank"),
    })

    localStorage.setItem("users", JSON.stringify(USERS))
  }

  closePopup()
}

function removeUser(username) {
  if (confirm(`Möchtest du wirklich ${username} aus dem Team entfernen?`)) {
    USERS = USERS.filter((u) => u.mcname !== username)
    localStorage.setItem("users", JSON.stringify(USERS))
    updateTeamList()
  }
}

// Klick-Handler zum Schließen des Options-Menüs
document.addEventListener("click", (event) => {
  const optionsMenu = document.getElementById("optionsMenu")
  if (!event.target.closest(".three-dots-menu") && !event.target.closest("#optionsMenu")) {
    optionsMenu?.classList.remove("show")
  }
})

// Login Handler
function handleLogin(event) {
  event.preventDefault()

  const rank = document.getElementById("rank").value
  const password = document.getElementById("password").value

  console.log("Login-Versuch")
  console.log("Rang:", rank)
  console.log("Passwort eingegeben:", !!password)

  if (!rank || !password) {
    alert("Bitte fülle alle Felder aus!")
    return false
  }

  if (RANK_DATA[rank] && RANK_DATA[rank].password === password) {
    console.log("Login erfolgreich!")

    localStorage.setItem("currentRank", rank)

    document.getElementById("loginArea").style.display = "none"
    document.getElementById("adminArea").style.display = RANK_DATA[rank].isAdmin ? "block" : "none"

    setupAdminArea(rank)
    updateTeamList()

    return false
  } else {
    console.log("Login fehlgeschlagen!")
    alert("Falsches Passwort oder ungültiger Rang!")
    return false
  }
}

// Benutzer hinzufügen Handler
function handleAddUser(event) {
  event.preventDefault()

  const mcname = document.getElementById("mcname").value
  const rank = document.getElementById("userRank").value
  const points = Number.parseInt(document.getElementById("points").value)

  if (!mcname || !rank || isNaN(points)) {
    alert("Bitte fülle alle Felder korrekt aus!")
    return false
  }

  // Prüfe, ob Benutzer bereits existiert
  if (USERS.some((user) => user.mcname.toLowerCase() === mcname.toLowerCase())) {
    alert("Dieser Benutzer existiert bereits!")
    return false
  }

  const newUser = {
    mcname: mcname,
    rank: rank,
    points: points,
    warnings: [],
  }

  USERS.push(newUser)
  localStorage.setItem("users", JSON.stringify(USERS))

  document.getElementById("addUserForm").reset()
  updateTeamList()

  alert("Benutzer erfolgreich hinzugefügt!")
  return false
}

// Punkteabzug Handler
function handlePoints(event) {
  event.preventDefault()

  const memberSelect = document.getElementById("member")
  const reasonSelect = document.getElementById("reason")

  const mcname = memberSelect.value
  const pointsToDeduct = Number.parseInt(reasonSelect.value)
  const reason = reasonSelect.options[reasonSelect.selectedIndex].text

  if (!mcname || !pointsToDeduct) {
    alert("Bitte fülle alle Felder aus!")
    return false
  }

  const currentRank = localStorage.getItem("currentRank")
  const user = USERS.find((u) => u.mcname === mcname)

  if (!user) {
    alert("Benutzer nicht gefunden!")
    return false
  }

  if (RANK_DATA[currentRank].canDeductPoints) {
    // Direkt Punkte abziehen
    user.points = Math.max(0, user.points - pointsToDeduct)
    localStorage.setItem("users", JSON.stringify(USERS))
    updateTeamList()
    alert("Punkte wurden abgezogen!")
  } else {
    // Vorschlag erstellen
    const suggestion = {
      mcname: mcname,
      points: pointsToDeduct,
      reason: reason,
      fromRank: currentRank,
      date: new Date().toISOString(),
    }

    SUGGESTIONS.push(suggestion)
    localStorage.setItem("suggestions", JSON.stringify(SUGGESTIONS))
    updateSuggestionsList()
    alert("Vorschlag wurde erstellt!")
  }

  document.getElementById("pointsForm").reset()
  return false
}

// Beim Laden der Seite
window.onload = () => {
  console.log("Seite geladen")

  // Aktualisiere die Benutzer-Auswahlliste
  const memberSelect = document.getElementById("member")
  if (memberSelect) {
    memberSelect.innerHTML =
      '<option value="">Wähle ein Teammitglied</option>' +
      USERS.map((user) => `<option value="${user.mcname}">${user.mcname} (${user.rank})</option>`).join("")
  }

  // Prüfe auf gespeicherten Login
  const currentRank = localStorage.getItem("currentRank")
  if (currentRank && RANK_DATA[currentRank]) {
    console.log("Automatischer Login mit:", currentRank)
    document.getElementById("loginArea").style.display = "none"
    document.getElementById("adminArea").style.display = "block"
    setupAdminArea(currentRank)
  }

  updateTeamList()
}

// Event Listener für das Login-Formular
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm")
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin)
  }
})

// Dummy setupAdminArea function to prevent errors
function setupAdminArea(rank) {
  // Implementation for setting up the admin area based on rank
  console.log(`Setting up admin area for rank: ${rank}`)
}


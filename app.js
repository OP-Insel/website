// Admin Login-Daten
const adminUsername = "owner";
const adminPassword = "admin123";

// Simulierte Benutzerdaten
let users = [
  { username: "Spieler1", points: 100, rank: "Moderator" },
  { username: "Spieler2", points: 150, rank: "Admin" }
];

let loggedInUser = null;

// Login-Funktion
function login() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const loginMessage = document.getElementById('login-message');

  // Überprüfung für Owner
  if (username === adminUsername && password === adminPassword) {
    loggedInUser = { username: adminUsername, role: "owner" };
    showDashboard();
    return;
  }
  
  // Normale Benutzer (Passwortprüfung entfällt hier)
  const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
  if (user) {
    loggedInUser = { username: user.username, role: "user" };
    showDashboard();
  } else {
    loginMessage.textContent = "Ungültiger Benutzername oder Passwort!";
  }
}

// Dashboard anzeigen und Login-Bereich ausblenden
function showDashboard() {
  document.getElementById('login-section').classList.remove('active');
  document.getElementById('dashboard-section').classList.add('active');
  
  if (loggedInUser.role === "owner") {
    document.getElementById('admin-panel').style.display = 'block';
    document.getElementById('user-panel').style.display = 'none';
    updateUserList();
  } else {
    document.getElementById('admin-panel').style.display = 'none';
    document.getElementById('user-panel').style.display = 'block';
  }
}

// Logout-Funktion
function logout() {
  loggedInUser = null;
  document.getElementById('username').value = "";
  document.getElementById('password').value = "";
  document.getElementById('login-message').textContent = "";
  document.getElementById('dashboard-section').classList.remove('active');
  document.getElementById('login-section').classList.add('active');
}

// Neuer Benutzer erstellen (nur für Owner)
function createUser() {
  if (loggedInUser.role !== "owner") return;
  const newUsername = document.getElementById('new-username').value.trim();
  const newPoints = parseInt(document.getElementById('new-points').value.trim());
  
  if (newUsername && !isNaN(newPoints)) {
    if (users.find(u => u.username.toLowerCase() === newUsername.toLowerCase())) {
      alert("Benutzer existiert bereits.");
      return;
    }
    users.push({ username: newUsername, points: newPoints, rank: "Supporter" });
    alert(`${newUsername} wurde erfolgreich erstellt.`);
    updateUserList();
  } else {
    alert("Bitte alle Felder korrekt ausfüllen.");
  }
}

// Punkte hinzufügen (nur für Owner)
function addPoints() {
  if (loggedInUser.role !== "owner") return;
  const targetUsername = document.getElementById('target-username').value.trim();
  const modPoints = parseInt(document.getElementById('modify-points').value.trim());
  
  if (targetUsername && !isNaN(modPoints)) {
    const user = users.find(u => u.username.toLowerCase() === targetUsername.toLowerCase());
    if (user) {
      user.points += modPoints;
      alert(`${modPoints} Punkte wurden zu ${targetUsername} hinzugefügt.`);
      updateUserList();
    } else {
      alert("Benutzer nicht gefunden.");
    }
  } else {
    alert("Bitte alle Felder korrekt ausfüllen.");
  }
}

// Punkte abziehen (nur für Owner)
function deductPoints() {
  if (loggedInUser.role !== "owner") return;
  const targetUsername = document.getElementById('target-username').value.trim();
  const modPoints = parseInt(document.getElementById('modify-points').value.trim());
  
  if (targetUsername && !isNaN(modPoints)) {
    const user = users.find(u => u.username.toLowerCase() === targetUsername.toLowerCase());
    if (user) {
      user.points -= modPoints;
      if (user.points < 0) user.points = 0;
      alert(`${modPoints} Punkte wurden von ${targetUsername} abgezogen.`);
      updateUserList();
    } else {
      alert("Benutzer nicht gefunden.");
    }
  } else {
    alert("Bitte alle Felder korrekt ausfüllen.");
  }
}

// Für Owner: Punkte eines Zielbenutzers anzeigen
function viewPoints() {
  if (loggedInUser.role !== "owner") return;
  const targetUsername = document.getElementById('target-username').value.trim();
  const adminMessage = document.getElementById('admin-message');
  const user = users.find(u => u.username.toLowerCase() === targetUsername.toLowerCase());
  if (user) {
    adminMessage.textContent = `${user.username} hat ${user.points} Punkte und ist ${user.rank}.`;
  } else {
    adminMessage.textContent = "Benutzer nicht gefunden.";
  }
}

// Für normale Benutzer: Eigene Punkte anzeigen
function viewUserPoints() {
  const user = users.find(u => u.username.toLowerCase() === loggedInUser.username.toLowerCase());
  const userMessage = document.getElementById('user-message');
  if (user) {
    userMessage.textContent = `Du hast ${user.points} Punkte und bist ${user.rank}.`;
  } else {
    userMessage.textContent = "Benutzer nicht gefunden.";
  }
}

// Benutzerliste aktualisieren (Owner-Bereich)
// Zeigt jeden Benutzer mit Minecraft-Avatar und Details an
function updateUserList() {
  const userList = document.getElementById('user-list');
  userList.innerHTML = ""; // Liste leeren

  users.forEach(user => {
    // Erzeuge Container für den Benutzer
    const item = document.createElement('div');
    item.classList.add('user-item');

    // Minecraft Avatar (verwende crafatar.com, Overlay optional)
    const avatar = document.createElement('img');
    avatar.classList.add('user-avatar');
    // Hier wird der Benutzername als Minecraft-Name genutzt – passe ggf. an
    avatar.src = `https://crafatar.com/avatars/${user.username}?size=50&overlay`;
    avatar.alt = user.username;

    // Benutzer-Details (Name, Punkte, Rang)
    const details = document.createElement('div');
    details.classList.add('user-details');
    details.innerHTML = `<strong>${user.username}</strong><br>Punkte: ${user.points}<br>Rang: ${user.rank}`;

    // Bei Klick auf den Benutzer: Prompt für Punktabzug
    item.addEventListener('click', () => {
      const pointsToDeduct = parseInt(prompt(`Wie viele Punkte sollen von ${user.username} abgezogen werden?`));
      if (!isNaN(pointsToDeduct)) {
        user.points -= pointsToDeduct;
        if (user.points < 0) user.points = 0;
        alert(`${pointsToDeduct} Punkte wurden von ${user.username} abgezogen.`);
        updateUserList();
      }
    });

    item.appendChild(avatar);
    item.appendChild(details);
    userList.appendChild(item);
  });
}

// Admin Login-Daten
const adminUsername = "owner";
const adminPassword = "admin123";

// Beispiel-Daten für Benutzer
let users = [
  { username: "Spieler1", points: 100, rank: "Moderator" },
  { username: "Spieler2", points: 150, rank: "Admin" }
];

let loggedInUser = null;

// Login-Funktion
function login() {
  const usernameInput = document.getElementById('username').value.trim();
  const passwordInput = document.getElementById('password').value.trim();
  const loginMessage = document.getElementById('login-message');

  // Überprüfe Admin-Zugang
  if (usernameInput === adminUsername && passwordInput === adminPassword) {
    loggedInUser = { username: adminUsername, role: "owner" };
    showDashboard();
    return;
  }
  
  // Überprüfe, ob der Benutzer existiert (für normale Benutzer)
  const user = users.find(u => u.username === usernameInput);
  if (user) {
    // Für dieses Beispiel entfällt die Passwortprüfung für normale Benutzer
    loggedInUser = { username: user.username, role: "user" };
    showDashboard();
  } else {
    loginMessage.textContent = "Benutzername oder Passwort falsch!";
  }
}

// Zeigt das Dashboard an und blendet den Login-Bereich aus
function showDashboard() {
  document.querySelector('.login-container').style.display = 'none';
  document.querySelector('.dashboard-container').style.display = 'block';
  
  if (loggedInUser.role === "owner") {
    document.getElementById('admin-panel').style.display = 'block';
    document.getElementById('user-panel').style.display = 'none';
  } else {
    document.getElementById('admin-panel').style.display = 'none';
    document.getElementById('user-panel').style.display = 'block';
  }
}

// Erstellen eines neuen Benutzers (nur für Owner)
function createUser() {
  const username = document.getElementById('new-username').value.trim();
  const points = parseInt(document.getElementById('new-points').value.trim());
  
  if (username && !isNaN(points)) {
    if (users.find(u => u.username === username)) {
      alert("Benutzer existiert bereits.");
      return;
    }
    users.push({ username: username, points: points, rank: "Supporter" });
    alert(`${username} wurde erfolgreich erstellt.`);
  } else {
    alert("Bitte alle Felder korrekt ausfüllen.");
  }
}

// Punkte hinzufügen (nur für Owner)
function addPoints() {
  const targetUsername = document.getElementById('target-username').value.trim();
  const points = parseInt(document.getElementById('modify-points').value.trim());
  
  if (targetUsername && !isNaN(points)) {
    const user = users.find(u => u.username === targetUsername);
    if (user) {
      user.points += points;
      alert(`${points} Punkte wurden zu ${targetUsername} hinzugefügt.`);
    } else {
      alert("Benutzer nicht gefunden.");
    }
  } else {
    alert("Bitte alle Felder korrekt ausfüllen.");
  }
}

// Punkte abziehen (nur für Owner)
function deductPoints() {
  const targetUsername = document.getElementById('target-username').value.trim();
  const points = parseInt(document.getElementById('modify-points').value.trim());
  
  if (targetUsername && !isNaN(points)) {
    const user = users.find(u => u.username === targetUsername);
    if (user) {
      user.points -= points;
      if (user.points < 0) {
        user.points = 0;
      }
      alert(`${points} Punkte wurden von ${targetUsername} abgezogen.`);
    } else {
      alert("Benutzer nicht gefunden.");
    }
  } else {
    alert("Bitte alle Felder korrekt ausfüllen.");
  }
}

// Punkte eines Benutzers anzeigen (für Owner)
function viewPoints() {
  const targetUsername = document.getElementById('target-username').value.trim();
  const adminMessage = document.getElementById('admin-message');
  const user = users.find(u => u.username === targetUsername);
  if (user) {
    adminMessage.textContent = `${user.username} hat ${user.points} Punkte und ist ${user.rank}.`;
  } else {
    adminMessage.textContent = "Benutzer nicht gefunden.";
  }
}

// Punkte für den eingeloggten normalen Benutzer anzeigen
function viewUserPoints() {
  const user = users.find(u => u.username === loggedInUser.username);
  const userMessage = document.getElementById('user-message');
  if (user) {
    userMessage.textContent = `Du hast ${user.points} Punkte und bist ${user.rank}.`;
  } else {
    userMessage.textContent = "Benutzer nicht gefunden.";
  }
}

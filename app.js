// Beispiel für Admin Login-Daten
const adminUsername = "owner";
const adminPassword = "admin123";

// Beispiel für Benutzer und Punkte
let users = [
    { username: "Spieler1", points: 100, rank: "Moderator" },
    { username: "Spieler2", points: 150, rank: "Admin" }
];

// Funktion, die beim Login ausgeführt wird
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginMessage = document.getElementById('login-message');
    
    if (username === adminUsername && password === adminPassword) {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('admin-section').style.display = 'block';
        loginMessage.textContent = '';
    } else {
        const user = users.find(u => u.username === username);
        if (user) {
            document.getElementById('login-section').style.display = 'none';
            document.getElementById('user-section').style.display = 'block';
            loginMessage.textContent = '';
        } else {
            loginMessage.textContent = "Benutzername oder Passwort falsch!";
        }
    }
}

// Funktion zum Erstellen eines neuen Benutzers
function createUser() {
    const username = document.getElementById('new-username').value;
    const points = document.getElementById('new-points').value;
    
    if (username && points) {
        users.push({ username: username, points: parseInt(points), rank: "Supporter" });
        alert(`${username} wurde erfolgreich erstellt.`);
    } else {
        alert("Bitte alle Felder ausfüllen.");
    }
}

// Funktion zum Hinzufügen von Punkten
function addPoints() {
    const username = document.getElementById('new-username').value;
    const points = document.getElementById('new-points').value;
    
    if (username && points) {
        const user = users.find(u => u.username === username);
        if (user) {
            user.points += parseInt(points);
            alert(`${points} Punkte wurden zu ${username}'s Konto hinzugefügt.`);
        } else {
            alert("Benutzer nicht gefunden.");
        }
    } else {
        alert("Bitte alle Felder ausfüllen.");
    }
}

// Funktion zum Abziehen von Punkten
function deductPoints() {
    const username = document.getElementById('new-username').value;
    const points = document.getElementById('new-points').value;
    
    if (username && points) {
        const user = users.find(u => u.username === username);
        if (user) {
            user.points -= parseInt(points);
            if (user.points < 0) {
                user.points = 0;
            }
            alert(`${points} Punkte wurden von ${username}'s Konto abgezogen.`);
        } else {
            alert("Benutzer nicht gefunden.");
        }
    } else {
        alert("Bitte alle Felder ausfüllen.");
    }
}

// Funktion, um die Punkte eines Benutzers anzuzeigen
function viewPoints() {
    const username = prompt("Geben Sie den Minecraft-Benutzernamen ein:");
    const user = users.find(u => u.username === username);
    
    if (user) {
        alert(`${user.username} hat ${user.points} Punkte und ist ein ${user.rank}.`);
    } else {
        alert("Benutzer nicht gefunden.");
    }
}

// Funktion zum Degradieren eines Benutzers basierend auf Punkten
function degradeUser() {
    users.forEach(user => {
        if (user.points >= 500) {
            user.rank = "Admin";
        } else if (user.points >= 400) {
            user.rank = "Jr. Admin";
        } else if (user.points >= 300) {
            user.rank = "Moderator";
        } else if (user.points >= 250) {
            user.rank = "Jr. Moderator";
        } else if (user.points >= 200) {
            user.rank = "Supporter";
        } else if (user.points >= 150) {
            user.rank = "Jr. Supporter";
        } else {
            user.rank = "Entfernt";
        }
    });
    alert("Alle Benutzer wurden überprüft und ggf. degradiert.");
}

// Funktion, die das Regelverstoß-Punktesystem anwendet
function applyRuleViolation(username, rule) {
    const user = users.find(u => u.username === username);
    
    if (user) {
        let pointsDeducted = 0;
        
        switch (rule) {
            case "Ban ohne Begründung":
                pointsDeducted = 5;
                break;
            case "Unfaire Strafe":
                pointsDeducted = 10;
                break;
            case "Missbrauch der Admin-Rechte":
                pointsDeducted = 20;
                break;
            case "Beleidigung":
                pointsDeducted = 15;
                break;
            case "Inaktiv ohne Abmeldung":
                pointsDeducted = 10;
                break;
            case "Wiederholtes Fehlverhalten":
                pointsDeducted = 30;
                break;
            case "Spamming":
                pointsDeducted = 5;
                break;
            case "Schwere Regelverstöße":
                pointsDeducted = 20;
                break;
            default:
                alert("Unbekannter Regelverstoß.");
                return;
        }
        
        user.points -= pointsDeducted;
        if (user.points < 0) {
            user.points = 0;
        }
        alert(`${pointsDeducted} Punkte wurden wegen des Verstoßes '${rule}' von ${username}'s Konto abgezogen.`);
    } else {
        alert("Benutzer nicht gefunden.");
    }
}

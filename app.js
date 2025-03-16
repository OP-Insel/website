// Hier speichern wir Benutzerdaten simuliert in einem Array (dies ist nur ein Beispiel)
const usersData = [
    { username: "Spieler1", points: 100 },
    { username: "Spieler2", points: 200 },
];

// Funktion zum Abrufen der Punkte eines Benutzers
function getPoints() {
    const username = document.getElementById('username').value;
    const message = document.getElementById('message');
    if (!username) {
        message.textContent = "Bitte gib einen Benutzernamen ein!";
        return;
    }

    const user = usersData.find(u => u.username === username);
    if (user) {
        message.textContent = `${username} hat ${user.points} Punkte.`;
    } else {
        message.textContent = "Benutzer nicht gefunden!";
    }
}

// Funktion zum Hinzufügen von Punkten
function addPoints() {
    const username = document.getElementById('username').value;
    const points = prompt("Wie viele Punkte möchtest du hinzufügen?");
    if (username && points) {
        const user = usersData.find(u => u.username === username);
        if (user) {
            user.points += parseInt(points);
            alert("Punkte erfolgreich hinzugefügt!");
        } else {
            alert("Benutzer nicht gefunden!");
        }
    }
}

// Funktion zum Abziehen von Punkten
function deductPoints() {
    const username = document.getElementById('username').value;
    const points = prompt("Wie viele Punkte möchtest du abziehen?");
    if (username && points) {
        const user = usersData.find(u => u.username === username);
        if (user) {
            user.points -= parseInt(points);
            alert("Punkte erfolgreich abgezogen!");
        } else {
            alert("Benutzer nicht gefunden!");
        }
    }
}

// Funktion zum Abrufen der Punkte eines Benutzers
async function getPoints() {
    const username = document.getElementById('username').value;
    const message = document.getElementById('message');
    if (!username) {
        message.textContent = "Bitte gib einen Benutzernamen ein!";
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/get-points?username=${username}`);
        const data = await response.json();
        if (data.success) {
            message.textContent = `${username} hat ${data.points} Punkte.`;
        } else {
            message.textContent = "Benutzer nicht gefunden!";
        }
    } catch (error) {
        message.textContent = "Fehler beim Abrufen der Punkte!";
    }
}

// Funktion zum Hinzufügen von Punkten
async function addPoints() {
    const username = document.getElementById('username').value;
    const points = prompt("Wie viele Punkte möchtest du hinzufügen?");
    if (username && points) {
        try {
            await fetch('http://localhost:3000/add-points', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, points: parseInt(points) })
            });
            alert("Punkte erfolgreich hinzugefügt!");
        } catch (error) {
            alert("Fehler beim Hinzufügen der Punkte!");
        }
    }
}

// Funktion zum Abziehen von Punkten
async function deductPoints() {
    const username = document.getElementById('username').value;
    const points = prompt("Wie viele Punkte möchtest du abziehen?");
    if (username && points) {
        try {
            await fetch('http://localhost:3000/deduct-points', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, points: parseInt(points) })
            });
            alert("Punkte erfolgreich abgezogen!");
        } catch (error) {
            alert("Fehler beim Abziehen der Punkte!");
        }
    }
}

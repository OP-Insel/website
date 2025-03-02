// Mock implementations for missing dependencies
const RANK_DATA = {
    'admin': { password: 'admin', canDeductPoints: true },
    'moderator': { password: 'moderator', canDeductPoints: false }
};

function setupAdminArea(rank) {
    console.log("setupAdminArea called for rank:", rank);
}

function updateTeamList() {
    console.log("updateTeamList called");
}

function showNotification(message) {
    console.log("Notification:", message);
}

// Login Handler
function handleLogin(event) {
    event.preventDefault();
    
    const rank = document.getElementById('rank').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');
    
    // Entferne alte Fehlermeldungen
    if (errorDiv) {
        errorDiv.remove();
    }

    // Überprüfe ob ein Rang ausgewählt wurde
    if (!rank) {
        showLoginError('Bitte wähle einen Rang aus!');
        return false;
    }

    // Überprüfe ob ein Passwort eingegeben wurde
    if (!password) {
        showLoginError('Bitte gib ein Passwort ein!');
        return false;
    }

    // Überprüfe ob der Rang existiert
    if (!RANK_DATA[rank]) {
        showLoginError('Ungültiger Rang!');
        return false;
    }

    // Überprüfe das Passwort
    if (RANK_DATA[rank].password !== password) {
        showLoginError('Falsches Passwort!');
        // Passwort-Feld zurücksetzen
        document.getElementById('password').value = '';
        return false;
    }

    // Login erfolgreich
    console.log("Login erfolgreich!");
    document.getElementById('loginArea').style.display = 'none';
    document.getElementById('adminArea').style.display = 'block';
    
    localStorage.setItem('currentRank', rank);
    setupAdminArea(rank);
    updateTeamList();
    
    // Ändere den Button-Text basierend auf den Berechtigungen
    const pointsButton = document.querySelector('#pointsForm button[type="submit"]');
    if (pointsButton) {
        if (RANK_DATA[rank].canDeductPoints) {
            pointsButton.textContent = "Punkte abziehen";
        } else {
            pointsButton.textContent = "Punkteabzug vorschlagen";
        }
    }

    // Zeige Erfolgsmeldung
    showNotification(`Erfolgreich als ${rank} eingeloggt!`);
    
    return false;
}

// Funktion zum Anzeigen von Login-Fehlern
function showLoginError(message) {
    // Entferne alte Fehlermeldungen
    const oldError = document.getElementById('loginError');
    if (oldError) {
        oldError.remove();
    }

    // Erstelle neue Fehlermeldung
    const errorDiv = document.createElement('div');
    errorDiv.id = 'loginError';
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;

    // Füge Fehlermeldung nach dem Formular ein
    const loginForm = document.getElementById('loginForm');
    loginForm.appendChild(errorDiv);

    // Schüttle das Formular
    loginForm.classList.add('shake');
    setTimeout(() => {
        loginForm.classList.remove('shake');
    }, 500);
}

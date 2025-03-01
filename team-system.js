// Rang-Anmeldedaten und Punktegrenzen
const RANK_DATA = {
    owner: {
        password: "OwnerSecure123!",
        isAdmin: true,
        canAddOwner: true,
        canDeductPoints: true,
        minPoints: Infinity
    },
    coowner: {
        password: "CoOwnerSecure123!",
        isAdmin: true,
        canAddOwner: false,
        canDeductPoints: true,
        minPoints: 750
    },
    admin: {
        password: "AdminSecure123!",
        isAdmin: true,
        canAddOwner: false,
        canDeductPoints: false,
        minPoints: 500
    },
    jradmin: {
        password: "JrAdminSecure123!",
        isAdmin: true,
        canAddOwner: false,
        canDeductPoints: false,
        minPoints: 400
    },
    moderator: {
        password: "ModSecure123!",
        isAdmin: true,
        canAddOwner: false,
        canDeductPoints: false,
        minPoints: 300
    },
    jrmoderator: {
        password: "JrModSecure123!",
        isAdmin: true,
        canAddOwner: false,
        canDeductPoints: false,
        minPoints: 250
    },
    supporter: {
        password: "SupporterSecure123!",
        isAdmin: true,
        canAddOwner: false,
        canDeductPoints: false,
        minPoints: 200
    },
    jrsupporter: {
        password: "JrSupporterSecure123!",
        isAdmin: true,
        canAddOwner: false,
        canDeductPoints: false,
        minPoints: 150
    },
    builder: {
        password: "BuilderSecure123!",
        isAdmin: true,
        canAddOwner: false,
        canDeductPoints: false,
        minPoints: 100
    }
};

// Rangfolge von hoch nach niedrig
const RANK_ORDER = [
    'owner',
    'coowner',
    'admin',
    'jradmin',
    'moderator',
    'jrmoderator',
    'supporter',
    'jrsupporter',
    'builder'
];

// Deklaration der fehlenden Variablen
let USERS = [];
let SUGGESTIONS = [];

// Funktion zum Überprüfen und Aktualisieren des Rangs basierend auf Punkten
function checkAndUpdateRank(user) {
    if (user.rank === 'owner') return; // Owner können nicht herabgestuft werden

    // Aktueller Rang hat nicht genügend Punkte
    if (user.points < RANK_DATA[user.rank].minPoints) {
        // Finde den höchsten passenden Rang für die aktuellen Punkte
        const newRank = findAppropriateRank(user.points);
        
        if (newRank && newRank !== user.rank) {
            const oldRank = user.rank;
            user.rank = newRank;
            
            showNotification(`${user.mcname} wurde von ${oldRank} zu ${newRank} herabgestuft (${user.points} Punkte)`);
            return true; // Rang wurde geändert
        }
    }
    return false; // Keine Änderung
}

// Funktion zum Finden des passenden Rangs basierend auf Punkten
function findAppropriateRank(points) {
    for (const rank of RANK_ORDER) {
        if (points >= RANK_DATA[rank].minPoints) {
            return rank;
        }
    }
    return 'builder'; // Standardrang, wenn keine anderen Kriterien erfüllt sind
}

// Funktion zum Anzeigen von Benachrichtigungen
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Entferne alte Benachrichtigungen
    const oldNotifications = document.querySelectorAll('.notification');
    oldNotifications.forEach(notif => notif.remove());
    
    document.body.appendChild(notification);
    
    // Benachrichtigung nach 5 Sekunden ausblenden
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 5000);
}

// Punkteabzug Handler aktualisieren
function handlePoints(event) {
    event.preventDefault();
    const currentRank = localStorage.getItem('currentRank');
    const mcname = document.getElementById('member').value;
    const points = parseInt(document.getElementById('reason').value);
    const reasonText = document.getElementById('reason').options[document.getElementById('reason').selectedIndex].text;

    if (!mcname) {
        alert('Bitte wähle ein Teammitglied aus!');
        return false;
    }

    if (RANK_DATA[currentRank].canDeductPoints) {
        const userIndex = USERS.findIndex(user => user.mcname === mcname);
        if (userIndex !== -1) {
            if (USERS[userIndex].rank === 'owner') {
                alert('Von einem Owner können keine Punkte abgezogen werden!');
                return false;
            }

            // Punkte abziehen
            USERS[userIndex].points -= points;
            
            // Rang überprüfen und aktualisieren
            checkAndUpdateRank(USERS[userIndex]);

            localStorage.setItem('users', JSON.stringify(USERS));
            updateTeamList();
            setupAdminArea(currentRank);
            
            alert(`${points} Punkte von ${mcname} abgezogen! Neue Punktzahl: ${USERS[userIndex].points}`);
        }
    } else {
        // Vorschlag erstellen für andere Ränge
        SUGGESTIONS.push({
            mcname: mcname,
            points: points,
            reason: reasonText,
            fromRank: currentRank,
            date: new Date().toISOString()
        });
        localStorage.setItem('suggestions', JSON.stringify(SUGGESTIONS));
        alert('Dein Vorschlag für einen Punkteabzug wurde an die Team-Leitung gesendet!');
    }
    
    document.getElementById('pointsForm').reset();
    return false;
}

// Vorschlag behandeln aktualisieren
function handleSuggestion(index, accept) {
    const suggestion = SUGGESTIONS[index];
    if (accept) {
        const userIndex = USERS.findIndex(user => user.mcname === suggestion.mcname);
        if (userIndex !== -1) {
            if (USERS[userIndex].rank === 'owner') {
                alert('Von einem Owner können keine Punkte abgezogen werden!');
                return;
            }

            // Punkte abziehen
            USERS[userIndex].points -= suggestion.points;
            
            // Rang überprüfen und aktualisieren
            checkAndUpdateRank(USERS[userIndex]);
            
            localStorage.setItem('users', JSON.stringify(USERS));
        }
    }
    
    SUGGESTIONS.splice(index, 1);
    localStorage.setItem('suggestions', JSON.stringify(SUGGESTIONS));
    updateTeamList();
}

// Beim Laden der Seite
window.onload = function() {
    // Lade und überprüfe alle Benutzerränge
    USERS = JSON.parse(localStorage.getItem('users')) || [];
    USERS.forEach(user => {
        checkAndUpdateRank(user);
    });
    localStorage.setItem('users', JSON.stringify(USERS));
    
    updateTeamList();
    const currentRank = localStorage.getItem('currentRank');
    
    if (currentRank && RANK_DATA[currentRank]) {
        document.getElementById('loginArea').style.display = 'none';
        document.getElementById('adminArea').style.display = 'block';
        setupAdminArea(currentRank);
    }
};

// Dummy-Funktionen für updateTeamList und setupAdminArea, um Fehler zu vermeiden
function updateTeamList() {
    // Implementiere die Logik zum Aktualisieren der Teamliste hier
    console.log("Funktion updateTeamList() wurde aufgerufen.");
}

function setupAdminArea(currentRank) {
    // Implementiere die Logik zum Einrichten des Admin-Bereichs hier
    console.log("Funktion setupAdminArea() wurde aufgerufen mit Rang:", currentRank);
}

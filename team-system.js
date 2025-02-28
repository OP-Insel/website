// Rang-Anmeldedaten
const RANK_DATA = {
    owner: {
        password: "owner123",
        isAdmin: true,
        canAddOwner: true,
        canDeductPoints: true,
        canAddUsers: true
    },
    coowner: {
        password: "coowner123",
        isAdmin: true,
        canAddOwner: false,
        canDeductPoints: true,
        canAddUsers: true
    },
    admin: {
        password: "admin123",
        isAdmin: true,
        canAddOwner: false,
        canDeductPoints: false,
        canAddUsers: false
    },
    jradmin: {
        password: "jradmin123",
        isAdmin: true,
        canAddOwner: false,
        canDeductPoints: false,
        canAddUsers: false
    },
    moderator: {
        password: "mod123",
        isAdmin: true,
        canAddOwner: false,
        canDeductPoints: false,
        canAddUsers: false
    },
    jrmoderator: {
        password: "jrmod123",
        isAdmin: true,
        canAddOwner: false,
        canDeductPoints: false,
        canAddUsers: false
    },
    supporter: {
        password: "supporter123",
        isAdmin: true,
        canAddOwner: false,
        canDeductPoints: false,
        canAddUsers: false
    },
    jrsupporter: {
        password: "jrsupporter123",
        isAdmin: true,
        canAddOwner: false,
        canDeductPoints: false,
        canAddUsers: false
    },
    builder: {
        password: "builder123",
        isAdmin: true,
        canAddOwner: false,
        canDeductPoints: false,
        canAddUsers: false
    }
};

// Standard-Punktzahlen für Ränge
const DEFAULT_POINTS = {
    owner: Infinity,
    coowner: 750,
    admin: 500,
    jradmin: 400,
    moderator: 300,
    jrmoderator: 250,
    supporter: 200,
    jrsupporter: 150,
    builder: 100
};

// Benutzer-Daten und Vorschläge aus localStorage laden oder initialisieren
let USERS = JSON.parse(localStorage.getItem('users')) || [];
let SUGGESTIONS = JSON.parse(localStorage.getItem('suggestions')) || [];

// Team Übersicht aktualisieren
function updateTeamList() {
    const teamList = document.getElementById('teamList');
    if (!teamList) return;
    
    teamList.innerHTML = '';

    USERS.forEach(user => {
        const memberCard = document.createElement('div');
        memberCard.className = 'member-card';
        
        memberCard.innerHTML = `
            <img src="https://mc-heads.net/avatar/${user.mcname}" alt="${user.mcname}" class="mc-head">
            <div class="member-info">
                <h3 class="rank-${user.rank}">${user.rank}</h3>
                <p>${user.mcname}</p>
                <p class="points">Punkte: ${user.points === Infinity ? '∞' : user.points}</p>
            </div>
        `;
        
        teamList.appendChild(memberCard);
    });

    if (USERS.length === 0) {
        teamList.innerHTML = '<p class="no-users">Noch keine Teammitglieder hinzugefügt</p>';
    }
}

// Login Handler
function handleLogin(event) {
    event.preventDefault();
    
    const rank = document.getElementById('rank').value;
    const password = document.getElementById('password').value;

    console.log("Login-Versuch:", rank); // Debug-Log

    if (!rank || !password) {
        alert('Bitte fülle alle Felder aus!');
        return false;
    }

    if (!RANK_DATA[rank]) {
        alert('Ungültiger Rang!');
        return false;
    }

    if (RANK_DATA[rank].password === password) {
        console.log("Login erfolgreich!"); // Debug-Log
        
        // Speichere den aktuellen Rang
        localStorage.setItem('currentRank', rank);
        
        // Verstecke Login-Bereich
        const loginArea = document.getElementById('loginArea');
        if (loginArea) loginArea.style.display = 'none';
        
        // Zeige Admin-Bereich
        const adminArea = document.getElementById('adminArea');
        if (adminArea) adminArea.style.display = 'block';
        
        // Aktualisiere die Benutzeroberfläche
        setupAdminArea(rank);
        updateTeamList();
        
        return false;
    } else {
        console.log("Falsches Passwort!"); // Debug-Log
        alert('Falsches Passwort!');
        return false;
    }
}

// Admin Bereich einrichten
function setupAdminArea(currentRank) {
    console.log("Setup Admin Bereich für:", currentRank); // Debug-Log

    // Benutzerhinzufügen-Bereich
    const addUserArea = document.getElementById('addUserArea');
    if (addUserArea) {
        addUserArea.style.display = RANK_DATA[currentRank].canAddUsers ? 'block' : 'none';
    }

    // Punkteabzug-Button Text
    const pointsButton = document.querySelector('#pointsForm button[type="submit"]');
    if (pointsButton) {
        pointsButton.textContent = RANK_DATA[currentRank].canDeductPoints ? 
            "Punkte abziehen" : "Punkteabzug vorschlagen";
    }

    // Teammitglieder-Liste für Punkteabzug
    const memberSelect = document.getElementById('member');
    if (memberSelect) {
        memberSelect.innerHTML = '<option value="">Wähle ein Teammitglied</option>';
        USERS.forEach(user => {
            if (user.rank !== 'owner') {
                const option = document.createElement('option');
                option.value = user.mcname;
                option.textContent = `${user.mcname} (${user.rank}) - ${user.points} Punkte`;
                memberSelect.appendChild(option);
            }
        });
    }
}

// Logout Handler
function handleLogout() {
    console.log("Logout durchgeführt"); // Debug-Log
    localStorage.removeItem('currentRank');
    
    const loginArea = document.getElementById('loginArea');
    const adminArea = document.getElementById('adminArea');
    
    if (loginArea) loginArea.style.display = 'block';
    if (adminArea) adminArea.style.display = 'none';
    
    // Formular zurücksetzen
    document.getElementById('loginForm').reset();
}

// Beim Laden der Seite
window.onload = function() {
    console.log("Seite geladen"); // Debug-Log
    
    const currentRank = localStorage.getItem('currentRank');
    console.log("Gespeicherter Rang:", currentRank); // Debug-Log

    if (currentRank && RANK_DATA[currentRank]) {
        console.log("Automatischer Login mit gespeichertem Rang"); // Debug-Log
        const loginArea = document.getElementById('loginArea');
        const adminArea = document.getElementById('adminArea');
        
        if (loginArea) loginArea.style.display = 'none';
        if (adminArea) adminArea.style.display = 'block';
        
        setupAdminArea(currentRank);
    }
    
    updateTeamList();
};

// Event Listener für das Login-Formular
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

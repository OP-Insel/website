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

// Benutzer-Daten aus localStorage laden oder initialisieren
let USERS = JSON.parse(localStorage.getItem('users')) || [];

// Login Handler - VEREINFACHT
function handleLogin(event) {
    // Verhindere Standard-Formular-Aktion
    event.preventDefault();
    
    // Hole Formular-Daten
    const rank = document.getElementById('rank').value;
    const password = document.getElementById('password').value;

    // Debug-Ausgaben
    console.log('Login-Versuch');
    console.log('Rang:', rank);
    console.log('Passwort eingegeben:', !!password);

    // Überprüfe Eingaben
    if (!rank || !password) {
        alert('Bitte fülle alle Felder aus!');
        return false;
    }

    // Überprüfe Rang und Passwort
    if (RANK_DATA[rank] && RANK_DATA[rank].password === password) {
        console.log('Login erfolgreich!');
        
        // Speichere aktuellen Rang
        localStorage.setItem('currentRank', rank);
        
        // Zeige/Verstecke Bereiche
        document.getElementById('loginArea').style.display = 'none';
        document.getElementById('adminArea').style.display = 'block';
        
        // Initialisiere Admin-Bereich
        setupAdminArea(rank);
        updateTeamList();
        
        return false;
    } else {
        console.log('Login fehlgeschlagen!');
        alert('Falsches Passwort oder ungültiger Rang!');
        return false;
    }
}

// Admin Bereich einrichten
function setupAdminArea(currentRank) {
    console.log('Setup Admin-Bereich für:', currentRank);
    
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
}

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

// Logout Handler
function handleLogout() {
    localStorage.removeItem('currentRank');
    document.getElementById('loginArea').style.display = 'block';
    document.getElementById('adminArea').style.display = 'none';
    document.getElementById('loginForm').reset();
}

// Beim Laden der Seite
window.onload = function() {
    console.log('Seite geladen');
    
    // Prüfe auf gespeicherten Login
    const currentRank = localStorage.getItem('currentRank');
    if (currentRank && RANK_DATA[currentRank]) {
        console.log('Automatischer Login mit:', currentRank);
        document.getElementById('loginArea').style.display = 'none';
        document.getElementById('adminArea').style.display = 'block';
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

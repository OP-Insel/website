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

// Füge diese Variablen zu den bestehenden hinzu
let selectedUser = null;
let contextMenu = null;

// Vorschläge
let SUGGESTIONS = JSON.parse(localStorage.getItem('suggestions')) || [];

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

// Modifiziere die updateTeamList Funktion
function updateTeamList() {
    const teamList = document.getElementById('teamList');
    if (!teamList) return;
    
    teamList.innerHTML = '';

    USERS.forEach(user => {
        const memberCard = document.createElement('div');
        memberCard.className = 'member-card';
        
        // Füge data-Attribute hinzu
        memberCard.dataset.username = user.mcname;
        memberCard.dataset.rank = user.rank;
        memberCard.dataset.points = user.points;
        
        memberCard.innerHTML = `
            <img src="https://mc-heads.net/avatar/${user.mcname}" alt="${user.mcname}" class="mc-head">
            <div class="member-info">
                <h3 class="rank-${user.rank}">${user.rank}</h3>
                <p>${user.mcname}</p>
                <p class="points">Punkte: ${user.points === Infinity ? '∞' : user.points}</p>
            </div>
        `;
        
        // Füge Rechtsklick-Event hinzu
        memberCard.addEventListener('contextmenu', handleContextMenu);
        
        teamList.appendChild(memberCard);
    });

    if (USERS.length === 0) {
        teamList.innerHTML = '<p class="no-users">Noch keine Teammitglieder hinzugefügt</p>';
    }

    // Zeige Vorschläge für Owner und Co-Owner
    updateSuggestionsList();
}

// Kontextmenü Handler
function handleContextMenu(event) {
    event.preventDefault();
    
    const currentRank = localStorage.getItem('currentRank');
    if (!RANK_DATA[currentRank]?.canDeductPoints) return;
    
    selectedUser = {
        mcname: event.currentTarget.dataset.username,
        rank: event.currentTarget.dataset.rank,
        points: parseInt(event.currentTarget.dataset.points)
    };
    
    const contextMenu = document.getElementById('contextMenu');
    contextMenu.style.left = `${event.pageX}px`;
    contextMenu.style.top = `${event.pageY}px`;
    contextMenu.classList.add('show');
}

// Popup für Punktebearbeitung
function editPoints() {
    if (!selectedUser) return;
    
    const popup = document.getElementById('editPointsPopup');
    const backdrop = document.getElementById('popupBackdrop');
    const pointsInput = document.getElementById('editPoints');
    
    pointsInput.value = selectedUser.points === Infinity ? '' : selectedUser.points;
    
    popup.classList.add('show');
    backdrop.classList.add('show');
    closeContextMenu();
}

// Punkte speichern
function savePoints() {
    const newPoints = parseInt(document.getElementById('editPoints').value);
    if (isNaN(newPoints) || newPoints < 0) {
        alert('Bitte gib eine gültige Punktzahl ein!');
        return;
    }
    
    const userIndex = USERS.findIndex(u => u.mcname === selectedUser.mcname);
    if (userIndex !== -1) {
        USERS[userIndex].points = newPoints;
        localStorage.setItem('users', JSON.stringify(USERS));
        updateTeamList();
    }
    
    closePopup();
}

// Popup schließen
function closePopup() {
    const popup = document.getElementById('editPointsPopup');
    const backdrop = document.getElementById('popupBackdrop');
    
    popup.classList.remove('show');
    backdrop.classList.remove('show');
    selectedUser = null;
}

// Kontextmenü schließen
function closeContextMenu() {
    const contextMenu = document.getElementById('contextMenu');
    contextMenu.classList.remove('show');
}

// Vorschläge anzeigen
function updateSuggestionsList() {
    const currentRank = localStorage.getItem('currentRank');
    if (!RANK_DATA[currentRank]?.canDeductPoints) return;
    
    const container = document.getElementById('suggestionsContainer');
    if (!container) return;
    
    container.innerHTML = '<h3>Punkteabzug-Vorschläge</h3>';
    
    if (SUGGESTIONS.length === 0) {
        container.innerHTML += '<p>Keine ausstehenden Vorschläge</p>';
        return;
    }
    
    const suggestionsList = document.createElement('div');
    suggestionsList.className = 'suggestions-list';
    
    SUGGESTIONS.forEach((suggestion, index) => {
        const date = new Date(suggestion.date);
        const suggestionItem = document.createElement('div');
        suggestionItem.className = 'suggestion-item';
        suggestionItem.innerHTML = `
            <div class="suggestion-header">
                <strong>${suggestion.fromRank}</strong>
                <span class="suggestion-date">${date.toLocaleString()}</span>
            </div>
            <p>Möchte ${suggestion.points} Punkte von <strong>${suggestion.mcname}</strong> abziehen</p>
            <p>Grund: ${suggestion.reason}</p>
            <div class="suggestion-actions">
                <button onclick="handleSuggestion(${index}, true)">Akzeptieren</button>
                <button onclick="handleSuggestion(${index}, false)" class="reject">Ablehnen</button>
            </div>
        `;
        suggestionsList.appendChild(suggestionItem);
    });
    
    container.appendChild(suggestionsList);
}

// Event Listener für Dokument
document.addEventListener('click', function(event) {
    if (!event.target.closest('.context-menu')) {
        closeContextMenu();
    }
});

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

    // Initialisiere Kontextmenü
    contextMenu = document.getElementById('contextMenu');
};

// Event Listener für das Login-Formular
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

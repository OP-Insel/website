// Rang-Anmeldedaten
const RANK_DATA = {
    owner: {
        password: "OwnerSecure123!",
        isAdmin: true,
        canAddOwner: true,
        canDeductPoints: true
    },
    coowner: {
        password: "CoOwnerSecure123!",
        isAdmin: true,
        canAddOwner: false,
        canDeductPoints: true
    },
    admin: {
        password: "AdminSecure123!",
        isAdmin: false,
        canAddOwner: false,
        canDeductPoints: false
    },
    jradmin: {
        password: "JrAdminSecure123!",
        isAdmin: false,
        canAddOwner: false,
        canDeductPoints: false
    },
    moderator: {
        password: "ModSecure123!",
        isAdmin: false,
        canAddOwner: false,
        canDeductPoints: false
    },
    jrmoderator: {
        password: "JrModSecure123!",
        isAdmin: false,
        canAddOwner: false,
        canDeductPoints: false
    },
    supporter: {
        password: "SupporterSecure123!",
        isAdmin: false,
        canAddOwner: false,
        canDeductPoints: false
    },
    jrsupporter: {
        password: "JrSupporterSecure123!",
        isAdmin: false,
        canAddOwner: false,
        canDeductPoints: false
    },
    builder: {
        password: "BuilderSecure123!",
        isAdmin: false,
        canAddOwner: false,
        canDeductPoints: false
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
    teamList.innerHTML = '';

    USERS.forEach(user => {
        const memberCard = document.createElement('div');
        memberCard.className = 'member-card';
        
        memberCard.innerHTML = `
            <img src="https://mc-heads.net/avatar/${user.mcname}" alt="${user.mcname}" class="mc-head">
            <div class="member-info">
                <h3>${user.rank}</h3>
                <p>${user.mcname}</p>
                <p class="points">Punkte: ${user.points === Infinity ? '∞' : user.points}</p>
            </div>
        `;
        
        teamList.appendChild(memberCard);
    });

    if (USERS.length === 0) {
        teamList.innerHTML = '<p class="no-users">Noch keine Teammitglieder hinzugefügt</p>';
    }

    // Vorschläge anzeigen für Owner und Co-Owner
    const currentRank = localStorage.getItem('currentRank');
    if (RANK_DATA[currentRank]?.canDeductPoints) {
        updateSuggestionsList();
    }
}

// Vorschlagsliste aktualisieren
function updateSuggestionsList() {
    const suggestionsContainer = document.getElementById('suggestionsContainer');
    if (!suggestionsContainer) return;

    suggestionsContainer.innerHTML = '<h3>Punkteabzug-Vorschläge</h3>';
    
    if (SUGGESTIONS.length === 0) {
        suggestionsContainer.innerHTML += '<p>Keine ausstehenden Vorschläge</p>';
        return;
    }

    SUGGESTIONS.forEach((suggestion, index) => {
        const suggestionElement = document.createElement('div');
        suggestionElement.className = 'suggestion-item';
        suggestionElement.innerHTML = `
            <p><strong>${suggestion.fromRank}</strong> schlägt vor, ${suggestion.points} Punkte von 
               <strong>${suggestion.mcname}</strong> abzuziehen.</p>
            <p>Grund: ${suggestion.reason}</p>
            <div class="suggestion-actions">
                <button onclick="handleSuggestion(${index}, true)">Akzeptieren</button>
                <button onclick="handleSuggestion(${index}, false)" class="reject">Ablehnen</button>
            </div>
        `;
        suggestionsContainer.appendChild(suggestionElement);
    });
}

// Vorschlag behandeln
function handleSuggestion(index, accept) {
    const suggestion = SUGGESTIONS[index];
    if (accept) {
        const userIndex = USERS.findIndex(user => user.mcname === suggestion.mcname);
        if (userIndex !== -1) {
            USERS[userIndex].points -= suggestion.points;
            if (USERS[userIndex].points <= 0) {
                alert(`${USERS[userIndex].mcname} wurde aus dem Team entfernt (0 oder weniger Punkte)!`);
                USERS.splice(userIndex, 1);
            }
            localStorage.setItem('users', JSON.stringify(USERS));
        }
    }
    
    SUGGESTIONS.splice(index, 1);
    localStorage.setItem('suggestions', JSON.stringify(SUGGESTIONS));
    updateTeamList();
}

// Punkteabzug Handler
function handlePoints(event) {
    event.preventDefault();
    const currentRank = localStorage.getItem('currentRank');
    const mcname = document.getElementById('member').value;
    const points = parseInt(document.getElementById('reason').value);
    const reasonText = document.getElementById('reason').options[document.getElementById('reason').selectedIndex].text;

    if (RANK_DATA[currentRank].canDeductPoints) {
        // Direkter Punkteabzug für Owner und Co-Owner
        const userIndex = USERS.findIndex(user => user.mcname === mcname);
        if (userIndex !== -1) {
            if (USERS[userIndex].points === Infinity) {
                alert('Von einem Owner können keine Punkte abgezogen werden!');
                return false;
            }

            USERS[userIndex].points -= points;
            if (USERS[userIndex].points <= 0) {
                alert(`${USERS[userIndex].mcname} wurde aus dem Team entfernt (0 oder weniger Punkte)!`);
                USERS.splice(userIndex, 1);
            }

            localStorage.setItem('users', JSON.stringify(USERS));
            updateTeamList();
            alert(`${points} Punkte von ${mcname} abgezogen! Neue Punktzahl: ${USERS[userIndex]?.points || 0}`);
        }
    } else {
        // Vorschlag erstellen für andere Ränge
        SUGGESTIONS.push({
            mcname: mcname,
            points: points,
            reason: reasonText,
            fromRank: currentRank
        });
        localStorage.setItem('suggestions', JSON.stringify(SUGGESTIONS));
        alert('Dein Vorschlag für einen Punkteabzug wurde an die Team-Leitung gesendet!');
    }
    
    document.getElementById('pointsForm').reset();
    return false;
}

// Rest des Codes bleibt gleich...
// (handleLogin, handleAddUser, setupAdminArea, handleLogout, window.onload)

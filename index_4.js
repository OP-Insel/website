// Anmeldedaten und Berechtigungen
const TEAM_CREDENTIALS = {
    owner: {
        username: "owner_minecraft",
        password: "OwnerSecure123!",
        points: Infinity,
        canDeductPoints: true
    },
    coowner: {
        username: "coowner_minecraft",
        password: "CoOwnerSecure123!",
        points: 750,
        canDeductPoints: true
    },
    developer: {
        username: "dev_minecraft",
        password: "DevSecure123!",
        points: 250,
        canDeductPoints: false
    },
    admin: {
        username: "admin_minecraft",
        password: "AdminSecure123!",
        points: 500,
        canDeductPoints: false
    },
    jradmin: {
        username: "jradmin_minecraft",
        password: "JrAdminSecure123!",
        points: 400,
        canDeductPoints: false
    },
    moderator: {
        username: "mod_minecraft",
        password: "ModSecure123!",
        points: 300,
        canDeductPoints: false
    },
    jrmoderator: {
        username: "jrmod_minecraft",
        password: "JrModSecure123!",
        points: 250,
        canDeductPoints: false
    },
    srbuilder: {
        username: "srbuilder_minecraft",
        password: "SrBuilderSecure123!",
        points: 300,
        canDeductPoints: false
    },
    builder: {
        username: "builder_minecraft",
        password: "BuilderSecure123!",
        points: 200,
        canDeductPoints: false
    },
    supporter: {
        username: "supporter_minecraft",
        password: "SupporterSecure123!",
        points: 200,
        canDeductPoints: false
    },
    jrsupporter: {
        username: "jrsupporter_minecraft",
        password: "JrSupporterSecure123!",
        points: 150,
        canDeductPoints: false
    }
};

// Punktabzüge für Regelverstöße
const VIOLATIONS = {
    ban: 5,
    unfair: 10,
    abuse: 20,
    insult: 15,
    inactive: 10,
    repeat: 30,
    spam: 5,
    severe: 20
};

// Speichert die aktuelle Session
let currentUser = null;
let teamPoints = {};
let suggestions = [];

// Login Handler
function handleLogin(event) {
    event.preventDefault();
    
    const rank = document.getElementById('rank').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (TEAM_CREDENTIALS[rank] && 
        TEAM_CREDENTIALS[rank].username === username && 
        TEAM_CREDENTIALS[rank].password === password) {
        
        currentUser = {
            rank: rank,
            username: username,
            canDeductPoints: TEAM_CREDENTIALS[rank].canDeductPoints
        };

        // Speichern der Session im localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        // Weiterleitung zum entsprechenden Dashboard
        if (currentUser.canDeductPoints) {
            window.location.href = 'admin-panel.html';
        } else {
            window.location.href = 'team-view.html';
        }
    } else {
        alert('Falsche Anmeldedaten!');
    }
}

// Initialisierung des Team Views
function initializeTeamView() {
    currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('welcomeMessage').textContent = 
        `Willkommen zurück, ${currentUser.username}!`;

    // Team-Mitglieder in Select laden
    const memberSelect = document.getElementById('member');
    for (const [rank, data] of Object.entries(TEAM_CREDENTIALS)) {
        if (rank !== currentUser.rank) {
            const option = document.createElement('option');
            option.value = rank;
            option.textContent = `${rank} (${data.username})`;
            memberSelect.appendChild(option);
        }
    }

    updateTeamStats();
}

// Initialisierung des Admin Panels
function initializeAdminPanel() {
    currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || !currentUser.canDeductPoints) {
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('adminWelcome').textContent = 
        `Willkommen im Admin-Bereich, ${currentUser.username}!`;

    // Team-Mitglieder in Select laden
    const memberSelect = document.getElementById('memberSelect');
    for (const [rank, data] of Object.entries(TEAM_CREDENTIALS)) {
        if (rank !== 'owner' && rank !== currentUser.rank) {
            const option = document.createElement('option');
            option.value = rank;
            option.textContent = `${rank} (${data.username})`;
            memberSelect.appendChild(option);
        }
    }

    updateAdminView();
}

// Punkteabzug Handler
function handlePointDeduction(event) {
    event.preventDefault();

    const member = document.getElementById('memberSelect').value;
    const violation = document.getElementById('violationType').value;
    const notes = document.getElementById('notes').value;

    if (!member || !violation) {
        alert('Bitte alle Felder ausfüllen!');
        return false;
    }

    const points = VIOLATIONS[violation];
    teamPoints[member] = (teamPoints[member] || TEAM_CREDENTIALS[member].points) - points;

    // Speichern der Punktestände
    localStorage.setItem('teamPoints', JSON.stringify(teamPoints));

    alert(`${points} Punkte von ${member} abgezogen!`);
    updateAdminView();
    return false;
}

// Vorschlag Handler
function handlePointSuggestion(event) {
    event.preventDefault();

    const member = document.getElementById('member').value;
    const reason = document.getElementById('reason').value;
    const description = document.getElementById('description').value;

    if (!member || !reason || !description) {
        alert('Bitte alle Felder ausfüllen!');
        return false;
    }

    const suggestion = {
        from: currentUser.username,
        member: member,
        reason: reason,
        description: description,
        points: VIOLATIONS[reason],
        date: new Date().toLocaleString()
    };

    suggestions.push(suggestion);
    localStorage.setItem('suggestions', JSON.stringify(suggestions));

    alert('Vorschlag wurde eingereicht!');
    document.getElementById('suggestPointsForm').reset();
    return false;
}

// Update Funktionen
function updatePointsPreview() {
    const reason = document.getElementById('reason').value;
    const points = VIOLATIONS[reason] || 0;
    document.getElementById('pointsPreview').textContent = `Punkteabzug: ${points}`;
}

function updateDeductionPreview() {
    const violation = document.getElementById('violationType').value;
    const points = VIOLATIONS[violation] || 0;
    document.getElementById('deductionPreview').textContent = `Punkteabzug: ${points}`;
}

function updateTeamStats() {
    const statsDiv = document.getElementById('teamStats');
    const storedPoints = JSON.parse(localStorage.getItem('teamPoints')) || {};

    let html = '<table><tr><th>Rang</th><th>Punkte</th><th>Status</th></tr>';
    
    for (const [rank, data] of Object.entries(TEAM_CREDENTIALS)) {
        const currentPoints = storedPoints[rank] || data.points;
        const status = currentPoints <= 0 ? 'Entfernt' : 'Aktiv';
        html += `
            <tr>
                <td>${rank}</td>
                <td>${currentPoints}</td>
                <td>${status}</td>
            </tr>
        `;
    }
    
    html += '</table>';
    statsDiv.innerHTML = html;
}

function updateAdminView() {
    updateTeamStats();
    
    // Vorschläge anzeigen
    const suggestionsList = document.getElementById('suggestionsList');
    const storedSuggestions = JSON.parse(localStorage.getItem('suggestions')) || [];
    
    let html = '<div class="suggestions-list">';
    for (const suggestion of storedSuggestions) {
        html += `
            <div class="suggestion-card">
                <h3>Vorschlag von ${suggestion.from}</h3>
                <p>Gegen: ${suggestion.member}</p>
                <p>Grund: ${suggestion.reason} (-${suggestion.points} Punkte)</p>
                <p>Beschreibung: ${suggestion.description}</p>
                <p class="suggestion-date">Eingereicht: ${suggestion.date}</p>
            </div>
        `;
    }
    html += '</div>';
    suggestionsList.innerHTML = html;
}

// Logout Handler
function handleLogout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Event Listener für Formular-Updates
document.addEventListener('DOMContentLoaded', function() {
    const reasonSelect = document.getElementById('reason');
    if (reasonSelect) {
        reasonSelect.addEventListener('change', updatePointsPreview);
    }

    const violationSelect = document.getElementById('violationType');
    if (violationSelect) {
        violationSelect.addEventListener('change', updateDeductionPreview);
    }
});

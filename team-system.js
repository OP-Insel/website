// Anmeldedaten und Punktestände
let TEAM_DATA = {
    owner: {
        username: "owner_minecraft",
        password: "OwnerSecure123!",
        isAdmin: true,
        points: Infinity,
        mcname: "owner_minecraft"
    },
    coowner: {
        username: "coowner_minecraft",
        password: "CoOwnerSecure123!",
        isAdmin: true,
        points: 750,
        mcname: "coowner_minecraft"
    },
    admin: {
        username: "admin_minecraft",
        password: "AdminSecure123!",
        isAdmin: false,
        points: 500,
        mcname: "admin_minecraft"
    },
    jradmin: {
        username: "jradmin_minecraft",
        password: "JrAdminSecure123!",
        isAdmin: false,
        points: 400,
        mcname: "jradmin_minecraft"
    },
    moderator: {
        username: "mod_minecraft",
        password: "ModSecure123!",
        isAdmin: false,
        points: 300,
        mcname: "mod_minecraft"
    },
    jrmoderator: {
        username: "jrmod_minecraft",
        password: "JrModSecure123!",
        isAdmin: false,
        points: 250,
        mcname: "jrmod_minecraft"
    },
    supporter: {
        username: "supporter_minecraft",
        password: "SupporterSecure123!",
        isAdmin: false,
        points: 200,
        mcname: "supporter_minecraft"
    },
    jrsupporter: {
        username: "jrsupporter_minecraft",
        password: "JrSupporterSecure123!",
        isAdmin: false,
        points: 150,
        mcname: "jrsupporter_minecraft"
    }
};

// Speichere TEAM_DATA im localStorage
if (!localStorage.getItem('teamData')) {
    localStorage.setItem('teamData', JSON.stringify(TEAM_DATA));
} else {
    TEAM_DATA = JSON.parse(localStorage.getItem('teamData'));
}

// Team Übersicht aktualisieren
function updateTeamList() {
    const teamList = document.getElementById('teamList');
    teamList.innerHTML = '';

    for (const [rank, data] of Object.entries(TEAM_DATA)) {
        const memberCard = document.createElement('div');
        memberCard.className = 'member-card';
        
        memberCard.innerHTML = `
            <img src="https://mc-heads.net/avatar/${data.mcname}" alt="${data.username}" class="mc-head">
            <div class="member-info">
                <h3>${rank}</h3>
                <p>${data.username}</p>
                <p class="points">Punkte: ${data.points === Infinity ? '∞' : data.points}</p>
            </div>
        `;
        
        teamList.appendChild(memberCard);
    }
}

// Login Handler
function handleLogin(event) {
    event.preventDefault();
    
    const rank = document.getElementById('rank').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (TEAM_DATA[rank] && 
        TEAM_DATA[rank].username === username && 
        TEAM_DATA[rank].password === password) {
        
        document.getElementById('loginArea').style.display = 'none';
        
        if (TEAM_DATA[rank].isAdmin) {
            document.getElementById('adminArea').style.display = 'block';
            // Zeige "Benutzer hinzufügen" nur für Owner
            document.getElementById('addUserArea').style.display = 
                rank === 'owner' ? 'block' : 'none';
            setupAdminArea(rank);
        } else {
            document.getElementById('teamArea').style.display = 'block';
            setupTeamArea(rank);
        }
        
        localStorage.setItem('currentUser', rank);
    } else {
        alert('Falsche Anmeldedaten!');
    }
}

// Benutzer hinzufügen Handler
function handleAddUser(event) {
    event.preventDefault();
    
    const username = document.getElementById('newUsername').value;
    const rank = document.getElementById('newRank').value;
    const password = document.getElementById('newPassword').value;

    TEAM_DATA[rank] = {
        username: username,
        password: password,
        isAdmin: rank === 'coowner',
        points: getInitialPoints(rank),
        mcname: username
    };

    localStorage.setItem('teamData', JSON.stringify(TEAM_DATA));
    updateTeamList();
    document.getElementById('addUserForm').reset();
    alert('Benutzer erfolgreich hinzugefügt!');
    return false;
}

// Initiale Punkte für neue Benutzer
function getInitialPoints(rank) {
    const points = {
        coowner: 750,
        admin: 500,
        jradmin: 400,
        moderator: 300,
        jrmoderator: 250,
        supporter: 200,
        jrsupporter: 150
    };
    return points[rank] || 150;
}

// Setup Funktionen
function setupAdminArea(currentRank) {
    const memberSelect = document.getElementById('member');
    memberSelect.innerHTML = '';
    
    for (const rank in TEAM_DATA) {
        if (rank !== currentRank && rank !== 'owner') {
            const option = document.createElement('option');
            option.value = rank;
            option.textContent = `${rank} (${TEAM_DATA[rank].username})`;
            memberSelect.appendChild(option);
        }
    }
    updateTeamList();
}

function setupTeamArea(currentRank) {
    const memberSelect = document.getElementById('suggestMember');
    memberSelect.innerHTML = '';
    
    for (const rank in TEAM_DATA) {
        if (rank !== currentRank) {
            const option = document.createElement('option');
            option.value = rank;
            option.textContent = `${rank} (${TEAM_DATA[rank].username})`;
            memberSelect.appendChild(option);
        }
    }
    updateTeamList();
}

// Punkteabzug Handler
function handlePoints(event) {
    event.preventDefault();
    const member = document.getElementById('member').value;
    const points = parseInt(document.getElementById('reason').value);
    
    if (TEAM_DATA[member]) {
        if (TEAM_DATA[member].points !== Infinity) {
            TEAM_DATA[member].points -= points;
            localStorage.setItem('teamData', JSON.stringify(TEAM_DATA));
            updateTeamList();
            alert(`${points} Punkte von ${member} abgezogen!`);
        } else {
            alert('Von diesem Rang können keine Punkte abgezogen werden!');
        }
    }
    return false;
}

// Vorschlag Handler
function handleSuggestion(event) {
    event.preventDefault();
    const member = document.getElementById('suggestMember').value;
    const points = document.getElementById('suggestReason').value;
    const description = document.getElementById('description').value;
    
    alert(`Vorschlag für Punkteabzug (${points} Punkte) von ${member} wurde eingereicht!`);
    document.getElementById('suggestionForm').reset();
    return false;
}

// Logout Handler
function handleLogout() {
    localStorage.removeItem('currentUser');
    document.getElementById('adminArea').style.display = 'none';
    document.getElementById('teamArea').style.display = 'none';
    document.getElementById('loginArea').style.display = 'block';
}

// Beim Laden der Seite
window.onload = function() {
    updateTeamList();
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        if (TEAM_DATA[currentUser].isAdmin) {
            document.getElementById('loginArea').style.display = 'none';
            document.getElementById('adminArea').style.display = 'block';
            document.getElementById('addUserArea').style.display = 
                currentUser === 'owner' ? 'block' : 'none';
            setupAdminArea(currentUser);
        } else {
            document.getElementById('loginArea').style.display = 'none';
            document.getElementById('teamArea').style.display = 'block';
            setupTeamArea(currentUser);
        }
    }
};

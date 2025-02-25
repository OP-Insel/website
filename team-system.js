// Anmeldedaten
const TEAM_DATA = {
    owner: {
        username: "owner_minecraft",
        password: "OwnerSecure123!",
        isAdmin: true
    },
    coowner: {
        username: "coowner_minecraft",
        password: "CoOwnerSecure123!",
        isAdmin: true
    },
    admin: {
        username: "admin_minecraft",
        password: "AdminSecure123!",
        isAdmin: false
    },
    jradmin: {
        username: "jradmin_minecraft",
        password: "JrAdminSecure123!",
        isAdmin: false
    },
    moderator: {
        username: "mod_minecraft",
        password: "ModSecure123!",
        isAdmin: false
    },
    jrmoderator: {
        username: "jrmod_minecraft",
        password: "JrModSecure123!",
        isAdmin: false
    },
    supporter: {
        username: "supporter_minecraft",
        password: "SupporterSecure123!",
        isAdmin: false
    },
    jrsupporter: {
        username: "jrsupporter_minecraft",
        password: "JrSupporterSecure123!",
        isAdmin: false
    }
};

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
}

// Punkteabzug Handler
function handlePoints(event) {
    event.preventDefault();
    const member = document.getElementById('member').value;
    const points = document.getElementById('reason').value;
    
    alert(`${points} Punkte von ${member} abgezogen!`);
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
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        if (TEAM_DATA[currentUser].isAdmin) {
            document.getElementById('loginArea').style.display = 'none';
            document.getElementById('adminArea').style.display = 'block';
            setupAdminArea(currentUser);
        } else {
            document.getElementById('loginArea').style.display = 'none';
            document.getElementById('teamArea').style.display = 'block';
            setupTeamArea(currentUser);
        }
    }
};

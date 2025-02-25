// Rang-Anmeldedaten
const RANK_DATA = {
    owner: {
        password: "OwnerSecure123!",
        isAdmin: true
    },
    coowner: {
        password: "CoOwnerSecure123!",
        isAdmin: true
    },
    admin: {
        password: "AdminSecure123!",
        isAdmin: false
    },
    jradmin: {
        password: "JrAdminSecure123!",
        isAdmin: false
    },
    moderator: {
        password: "ModSecure123!",
        isAdmin: false
    },
    jrmoderator: {
        password: "JrModSecure123!",
        isAdmin: false
    },
    supporter: {
        password: "SupporterSecure123!",
        isAdmin: false
    },
    jrsupporter: {
        password: "JrSupporterSecure123!",
        isAdmin: false
    }
};

// Benutzer-Daten aus localStorage laden oder initialisieren
let USERS = JSON.parse(localStorage.getItem('users')) || [];

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
                <p class="points">Punkte: ${user.points}</p>
            </div>
        `;
        
        teamList.appendChild(memberCard);
    });
}

// Login Handler
function handleLogin(event) {
    event.preventDefault();
    
    const rank = document.getElementById('rank').value;
    const password = document.getElementById('password').value;

    if (RANK_DATA[rank] && RANK_DATA[rank].password === password) {
        document.getElementById('loginArea').style.display = 'none';
        
        if (RANK_DATA[rank].isAdmin) {
            document.getElementById('adminArea').style.display = 'block';
            setupAdminArea();
        }
        
        localStorage.setItem('currentRank', rank);
    } else {
        alert('Falsches Passwort!');
    }
}

// Benutzer hinzufügen Handler
function handleAddUser(event) {
    event.preventDefault();
    
    const mcname = document.getElementById('mcname').value;
    const rank = document.getElementById('userRank').value;
    const points = parseInt(document.getElementById('points').value);

    // Prüfen ob Benutzer bereits existiert
    if (USERS.some(user => user.mcname === mcname)) {
        alert('Dieser Minecraft Username existiert bereits!');
        return false;
    }

    // Neuen Benutzer hinzufügen
    USERS.push({
        mcname: mcname,
        rank: rank,
        points: points
    });

    // Speichern und aktualisieren
    localStorage.setItem('users', JSON.stringify(USERS));
    updateTeamList();
    setupAdminArea();
    
    document.getElementById('addUserForm').reset();
    alert('Benutzer erfolgreich hinzugefügt!');
    return false;
}

// Admin Bereich einrichten
function setupAdminArea() {
    const memberSelect = document.getElementById('member');
    memberSelect.innerHTML = '<option value="">Wähle ein Teammitglied</option>';
    
    USERS.forEach(user => {
        const option = document.createElement('option');
        option.value = user.mcname;
        option.textContent = `${user.mcname} (${user.rank}) - ${user.points} Punkte`;
        memberSelect.appendChild(option);
    });
}

// Punkteabzug Handler
function handlePoints(event) {
    event.preventDefault();
    const mcname = document.getElementById('member').value;
    const points = parseInt(document.getElementById('reason').value);
    
    const userIndex = USERS.findIndex(user => user.mcname === mcname);
    if (userIndex !== -1) {
        USERS[userIndex].points -= points;
        localStorage.setItem('users', JSON.stringify(USERS));
        updateTeamList();
        setupAdminArea();
        alert(`${points} Punkte von ${mcname} abgezogen!`);
    }
    return false;
}

// Logout Handler
function handleLogout() {
    localStorage.removeItem('currentRank');
    document.getElementById('adminArea').style.display = 'none';
    document.getElementById('loginArea').style.display = 'block';
}

// Beim Laden der Seite
window.onload = function() {
    updateTeamList();
    const currentRank = localStorage.getItem('currentRank');
    if (currentRank && RANK_DATA[currentRank].isAdmin) {
        document.getElementById('loginArea').style.display = 'none';
        document.getElementById('adminArea').style.display = 'block';
        setupAdminArea();
    }
};

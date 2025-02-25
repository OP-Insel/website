// Rang-Anmeldedaten
const RANK_DATA = {
    owner: {
        password: "OwnerSecure123!",
        isAdmin: true,
        canAddOwner: true
    },
    coowner: {
        password: "CoOwnerSecure123!",
        isAdmin: true,
        canAddOwner: false
    },
    admin: {
        password: "AdminSecure123!",
        isAdmin: false,
        canAddOwner: false
    },
    jradmin: {
        password: "JrAdminSecure123!",
        isAdmin: false,
        canAddOwner: false
    },
    moderator: {
        password: "ModSecure123!",
        isAdmin: false,
        canAddOwner: false
    },
    jrmoderator: {
        password: "JrModSecure123!",
        isAdmin: false,
        canAddOwner: false
    },
    supporter: {
        password: "SupporterSecure123!",
        isAdmin: false,
        canAddOwner: false
    },
    jrsupporter: {
        password: "JrSupporterSecure123!",
        isAdmin: false,
        canAddOwner: false
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
    jrsupporter: 150
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
                <p class="points">Punkte: ${user.points === Infinity ? '∞' : user.points}</p>
            </div>
        `;
        
        teamList.appendChild(memberCard);
    });

    // Wenn keine Benutzer vorhanden sind, zeige eine Nachricht
    if (USERS.length === 0) {
        teamList.innerHTML = '<p class="no-users">Noch keine Teammitglieder hinzugefügt</p>';
    }
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
            setupAdminArea(rank);
        }
        
        localStorage.setItem('currentRank', rank);
        updateTeamList();
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
    const currentRank = localStorage.getItem('currentRank');

    // Prüfen ob der aktuelle Benutzer Owner ist, wenn ein Owner/Co-Owner hinzugefügt werden soll
    if ((rank === 'owner' || rank === 'coowner') && !RANK_DATA[currentRank].canAddOwner) {
        alert('Nur der Owner kann weitere Owner oder Co-Owner hinzufügen!');
        return false;
    }

    // Prüfen ob Benutzer bereits existiert
    if (USERS.some(user => user.mcname.toLowerCase() === mcname.toLowerCase())) {
        alert('Dieser Minecraft Username existiert bereits!');
        return false;
    }

    // Neuen Benutzer hinzufügen
    USERS.push({
        mcname: mcname,
        rank: rank,
        points: rank === 'owner' ? Infinity : points
    });

    // Speichern und aktualisieren
    localStorage.setItem('users', JSON.stringify(USERS));
    updateTeamList();
    setupAdminArea(currentRank);
    
    document.getElementById('addUserForm').reset();
    alert('Benutzer erfolgreich hinzugefügt!');
    return false;
}

// Admin Bereich einrichten
function setupAdminArea(currentRank) {
    const memberSelect = document.getElementById('member');
    memberSelect.innerHTML = '<option value="">Wähle ein Teammitglied</option>';
    
    USERS.forEach(user => {
        // Owner können nicht von Punkten abgezogen werden
        if (user.rank !== 'owner') {
            const option = document.createElement('option');
            option.value = user.mcname;
            option.textContent = `${user.mcname} (${user.rank}) - ${user.points} Punkte`;
            memberSelect.appendChild(option);
        }
    });

    // Rang-Auswahl anpassen basierend auf Berechtigungen
    const userRankSelect = document.getElementById('userRank');
    if (userRankSelect) {
        const options = userRankSelect.options;
        for (let i = 0; i < options.length; i++) {
            if ((options[i].value === 'owner' || options[i].value === 'coowner') && 
                !RANK_DATA[currentRank].canAddOwner) {
                options[i].disabled = true;
            }
        }
    }
}

// Punkteabzug Handler
function handlePoints(event) {
    event.preventDefault();
    const mcname = document.getElementById('member').value;
    const points = parseInt(document.getElementById('reason').value);
    
    const userIndex = USERS.findIndex(user => user.mcname === mcname);
    if (userIndex !== -1) {
        // Verhindere Punkteabzug bei Owner
        if (USERS[userIndex].points === Infinity) {
            alert('Von einem Owner können keine Punkte abgezogen werden!');
            return false;
        }

        USERS[userIndex].points -= points;

        // Prüfe ob Benutzer unter 0 Punkte fällt
        if (USERS[userIndex].points <= 0) {
            alert(`${USERS[userIndex].mcname} wurde aus dem Team entfernt (0 oder weniger Punkte)!`);
            USERS.splice(userIndex, 1);
        }

        localStorage.setItem('users', JSON.stringify(USERS));
        updateTeamList();
        setupAdminArea(localStorage.getItem('currentRank'));
        
        if (USERS[userIndex]) {
            alert(`${points} Punkte von ${mcname} abgezogen! Neue Punktzahl: ${USERS[userIndex].points}`);
        }
    }
    return false;
}

// Logout Handler
function handleLogout() {
    localStorage.removeItem('currentRank');
    document.getElementById('adminArea').style.display = 'none';
    document.getElementById('loginArea').style.display = 'block';

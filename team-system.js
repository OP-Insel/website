// Angenommen, diese Variablen werden irgendwo anders deklariert oder importiert
// Hier sind Platzhalter, um die Fehler zu beheben
const RANK_DATA = {
    someRank: {
        canDeductPoints: true
    },
    anotherRank: {
        canDeductPoints: false
    }
};
let USERS = [];
const getNextLowerRank = (rank) => { return null; };
const DEFAULT_POINTS = {};
const checkRankByPoints = () => {};
let SUGGESTIONS = [];
const updateTeamList = () => {};
const setupAdminArea = () => {};
const checkMonthlyReset = () => {};

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
        // Direkter Punkteabzug für Owner und Co-Owner
        const userIndex = USERS.findIndex(user => user.mcname === mcname);
        if (userIndex !== -1) {
            if (USERS[userIndex].points === Infinity) {
                alert('Von einem Owner können keine Punkte abgezogen werden!');
                return false;
            }

            USERS[userIndex].points -= points;
            
            // Prüfen, ob Benutzer unter 0 Punkte fällt
            if (USERS[userIndex].points <= 0) {
                // Statt Entfernung, Herabstufung auf den nächstniedrigeren Rang
                const currentUserRank = USERS[userIndex].rank;
                const newRank = getNextLowerRank(currentUserRank);
                
                if (newRank) {
                    USERS[userIndex].rank = newRank;
                    USERS[userIndex].points = DEFAULT_POINTS[newRank];
                    alert(`${USERS[userIndex].mcname} wurde auf den Rang ${newRank} herabgestuft!`);
                } else {
                    // Wenn kein niedrigerer Rang verfügbar ist, entferne den Benutzer
                    alert(`${USERS[userIndex].mcname} wurde aus dem Team entfernt (0 oder weniger Punkte und niedrigster Rang)!`);
                    USERS.splice(userIndex, 1);
                }
            } else {
                // Prüfen, ob der Benutzer aufgrund niedriger Punkte herabgestuft werden sollte
                checkRankByPoints();
            }

            localStorage.setItem('users', JSON.stringify(USERS));
            updateTeamList();
            setupAdminArea(currentRank);
            alert(`${points} Punkte von ${mcname} abgezogen! Neue Punktzahl: ${USERS[userIndex]?.points || 0}`);
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
            USERS[userIndex].points -= suggestion.points;
            
            // Prüfen, ob Benutzer unter 0 Punkte fällt
            if (USERS[userIndex].points <= 0) {
                // Statt Entfernung, Herabstufung auf den nächstniedrigeren Rang
                const currentRank = USERS[userIndex].rank;
                const newRank = getNextLowerRank(currentRank);
                
                if (newRank) {
                    USERS[userIndex].rank = newRank;
                    USERS[userIndex].points = DEFAULT_POINTS[newRank];
                    alert(`${USERS[userIndex].mcname} wurde auf den Rang ${newRank} herabgestuft!`);
                } else {
                    // Wenn kein niedrigerer Rang verfügbar ist, entferne den Benutzer
                    alert(`${USERS[userIndex].mcname} wurde aus dem Team entfernt (0 oder weniger Punkte und niedrigster Rang)!`);
                    USERS.splice(userIndex, 1);
                }
            } else {
                // Prüfen, ob der Benutzer aufgrund niedriger Punkte herabgestuft werden sollte
                checkRankByPoints();
            }
            
            localStorage.setItem('users', JSON.stringify(USERS));
        }
    }
    
    SUGGESTIONS.splice(index, 1);
    localStorage.setItem('suggestions', JSON.stringify(SUGGESTIONS));
    updateTeamList();
}

// Beim Laden der Seite auch die Ränge überprüfen
window.onload = function() {
    // Prüfen, ob ein monatliches Zurücksetzen der Punkte erforderlich ist
    checkMonthlyReset();
    
    // Prüfen, ob Benutzer aufgrund niedriger Punkte herabgestuft werden sollten
    checkRankByPoints();
    
    updateTeamList();
    const currentRank = localStorage.getItem('currentRank');
    
    if (currentRank && RANK_DATA[currentRank]) {
        document.getElementById('loginArea').style.display = 'none';
        document.getElementById('adminArea').style.display = 'block';
        setupAdminArea(currentRank);
        
        // Ändere den Button-Text basierend auf den Berechtigungen
        const pointsButton = document.querySelector('#pointsForm button[type="submit"]');
        if (pointsButton) {
            if (RANK_DATA[currentRank].canDeductPoints) {
                pointsButton.textContent = "Punkte abziehen";
            } else {
                pointsButton.textContent = "Punkteabzug vorschlagen";
            }
        }
    }
};

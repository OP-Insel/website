// Beispiel-Datenbank (Benutzer und Punkte)
const users = [
    { username: "owner", password: "owner123", role: "Owner", points: 1000 },
    { username: "admin", password: "admin123", role: "Admin", points: 500 },
    { username: "user1", password: "user123", role: "User", points: 200 }
];

let currentUser = null;

document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        currentUser = user;
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('dashboard-container').style.display = 'block';
        document.getElementById('login-error').style.display = 'none';
        loadUserList();
    } else {
        document.getElementById('login-error').style.display = 'block';
    }
});

document.getElementById('logout-button').addEventListener('click', function() {
    currentUser = null;
    document.getElementById('login-container').style.display = 'block';
    document.getElementById('dashboard-container').style.display = 'none';
});

document.getElementById('discord-button').addEventListener('click', function() {
    window.open('https://discord.gg/dein-discord-link', '_blank');
});

function loadUserList() {
    const userList = document.getElementById('user-list');
    userList.innerHTML = '';
    users.forEach(user => {
        const userDiv = document.createElement('div');
        userDiv.textContent = `${user.username}: ${user.points} Punkte`;
        if (currentUser && currentUser.role === 'Owner') {
            const addButton = document.createElement('button');
            addButton.textContent = '+';
            addButton.addEventListener('click', () => updatePoints(user.username, 10));
            userDiv.appendChild(addButton);

            const subtractButton = document.createElement('button');
            subtractButton.textContent = '-';
            subtractButton.addEventListener('click', () => updatePoints(user.username, -10));
            userDiv.appendChild(subtractButton);
        }
        userList.appendChild(userDiv);
    });
}

function updatePoints(username, points) {
    const user = users.find(u => u.username === username);
    if (user) {
        user.points += points;
        loadUserList();
    }
}

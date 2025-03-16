async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });
    const data = await response.json();

    if (data.success) {
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        loadPoints();
    } else {
        alert('Login fehlgeschlagen!');
    }
}

async function loadPoints() {
    const response = await fetch('/get-points');
    const points = await response.json();
    document.getElementById('points-display').innerText = `Punkte: ${points}`;
}

async function addPoints() {
    const response = await fetch('/add-points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ points: 10 }), 
    });
    loadPoints();
}

async function deductPoints() {
    const response = await fetch('/deduct-points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ points: 5 }), 
    });
    loadPoints();
}

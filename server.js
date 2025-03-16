const express = require('express');
const axios = require('axios');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());

// GitHub API URL für das Repository und die JSON-Datei
const repoOwner = 'DEIN_GITHUB_USERNAME';
const repoName = 'minecraft-punkte-system';
const filePath = 'users.json';  // Der Pfad zur JSON-Datei im Repository
const token = 'DEIN_GITHUB_TOKEN';  // Dein GitHub Token

// Funktion zum Abrufen der JSON-Datei von GitHub
async function getUsersData() {
    try {
        const response = await axios.get(
            `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        const fileContent = Buffer.from(response.data.content, 'base64').toString('utf8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error('Fehler beim Abrufen der Benutzerdaten:', error);
        return { users: [] };
    }
}

// Funktion zum Speichern der JSON-Datei auf GitHub
async function saveUsersData(usersData) {
    try {
        const response = await axios.get(
            `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        const sha = response.data.sha;  // Hole die aktuelle SHA der Datei

        const updatedContent = Buffer.from(JSON.stringify(usersData, null, 2)).toString('base64');
        
        await axios.put(
            `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`,
            {
                message: 'Update User Data',
                committer: { name: 'Minecraft Bot', email: 'bot@minecraft.com' },
                content: updatedContent,
                sha: sha
            },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('Benutzerdaten gespeichert!');
    } catch (error) {
        console.error('Fehler beim Speichern der Benutzerdaten:', error);
    }
}

// Route zum Abrufen der Benutzerdaten (Punkte anzeigen)
app.get('/get-points', async (req, res) => {
    const usersData = await getUsersData();
    res.json(usersData);
});

// Route zum Hinzufügen von Punkten
app.post('/add-points', async (req, res) => {
    const { username, points } = req.body;

    const usersData = await getUsersData();
    const user = usersData.users.find(u => u.username === username);
    if (user) {
        user.points += points;
        await saveUsersData(usersData);
        res.json({ success: true });
    } else {
        res.status(400).json({ success: false, message: 'Benutzer nicht gefunden' });
    }
});

// Route zum Abziehen von Punkten
app.post('/deduct-points', async (req, res) => {
    const { username, points } = req.body;

    const usersData = await getUsersData();
    const user = usersData.users.find(u => u.username === username);
    if (user) {
        user.points -= points;
        await saveUsersData(usersData);
        res.json({ success: true });
    } else {
        res.status(400).json({ success: false, message: 'Benutzer nicht gefunden' });
    }
});

// Startet den Server
app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});

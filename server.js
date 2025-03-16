const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

app.use(express.json());

const repoOwner = 'DEIN_GITHUB_USERNAME'; // Ersetze mit deinem GitHub-Benutzernamen
const repoName = 'minecraft-punkte-system'; // Dein Repository-Name
const filePath = 'users.json';  // Der Pfad zur JSON-Datei im Repository
const token = 'DEIN_GITHUB_TOKEN';  // Dein GitHub Token

async function getUsersData() {
    try {
        const response = await axios.get(
            `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        const fileContent = Buffer.from(response.data.content, 'base64').toString('utf8');
        return JSON.parse(fileContent);
    } catch (error) {
        return { users: [] };
    }
}

async function saveUsersData(usersData) {
    try {
        const response = await axios.get(
            `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        const sha = response.data.sha;

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

app.get('/get-points', async (req, res) => {
    const { username } = req.query;
    const usersData = await getUsersData();
    const user = usersData.users.find(u => u.username === username);
    if (user) {
        res.json({ success: true, points: user.points });
    } else {
        res.json({ success: false });
    }
});

app.post('/add-points', async (req, res) => {
    const { username, points } = req.body;
    const usersData = await getUsersData();
    const user = usersData.users.find(u => u.username === username);
    if (user) {
        user.points += points;
        await saveUsersData(usersData);
        res.json({ success: true });
    } else {
        res.status(400).json({ success: false });
    }
});

app.post('/deduct-points', async (req, res) => {
    const { username, points } = req.body;
    const usersData = await getUsersData();
    const user = usersData.users.find(u => u.username === username);
    if (user) {
        user.points -= points;
        await saveUsersData(usersData);
        res.json({ success: true });
    } else {
        res.status(400).json({ success: false });
    }
});

app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});

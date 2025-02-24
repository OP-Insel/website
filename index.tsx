<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Minecraft Staff Manager</title>
    <style>
        :root {
            --primary: #2563eb;
            --background: #1a1a1a;
            --text: #ffffff;
            --card: #262626;
            --border: #404040;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        body {
            background-color: var(--background);
            color: var(--text);
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
        }

        h1 {
            font-size: 2rem;
            margin-bottom: 0.5rem;
        }

        .subtitle {
            color: #888;
            margin-bottom: 2rem;
        }

        .card {
            background-color: var(--card);
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
        }

        .card h2 {
            margin-bottom: 1rem;
        }

        .form-group {
            margin-bottom: 1rem;
        }

        label {
            display: block;
            margin-bottom: 0.5rem;
        }

        select, input, button {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid var(--border);
            border-radius: 4px;
            background-color: var(--background);
            color: var(--text);
            margin-bottom: 1rem;
        }

        button {
            background-color: var(--primary);
            border: none;
            cursor: pointer;
            font-weight: bold;
        }

        button:hover {
            opacity: 0.9;
        }

        button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 1rem;
        }

        th, td {
            text-align: left;
            padding: 12px;
            border-bottom: 1px solid var(--border);
        }

        th {
            font-weight: bold;
            color: #888;
        }

        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
        }

        .modal-content {
            background-color: var(--card);
            margin: 15% auto;
            padding: 20px;
            border: 1px solid var(--border);
            border-radius: 8px;
            width: 80%;
            max-width: 500px;
        }

        .close {
            float: right;
            cursor: pointer;
            font-size: 1.5rem;
        }

        @media (max-width: 768px) {
            .container {
                padding: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Minecraft Staff Manager</h1>
        <p class="subtitle">Verwalte Teammitglieder und Punktesystem</p>

        <button onclick="openAddStaffModal()">+ Teammitglied hinzufügen</button>

        <div class="card">
            <h2>Punkteabzug</h2>
            <div class="form-group">
                <label for="staffSelect">Teammitglied</label>
                <select id="staffSelect">
                    <option value="">Wähle ein Teammitglied</option>
                </select>
            </div>
            <div class="form-group">
                <label for="violationSelect">Regelverstoß</label>
                <select id="violationSelect">
                    <option value="">Wähle einen Regelverstoß</option>
                    <option value="5">Ban ohne Begründung (-5 Punkte)</option>
                    <option value="10">Unfaire Strafe gegen Spieler (-10 Punkte)</option>
                    <option value="20">Missbrauch der Admin-Rechte (-20 Punkte)</option>
                    <option value="15">Beleidigung oder schlechtes Verhalten (-15 Punkte)</option>
                    <option value="10">Inaktiv ohne Abmeldung (-10 Punkte)</option>
                    <option value="30">Wiederholtes Fehlverhalten (-30 Punkte)</option>
                    <option value="5">Spamming (-5 Punkte)</option>
                    <option value="20">Schwere Regelverstöße (-20 Punkte)</option>
                </select>
            </div>
            <button onclick="deductPoints()">Punkte abziehen</button>
        </div>

        <div class="card">
            <h2>Teammitglieder</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Rang</th>
                        <th>Punkte</th>
                    </tr>
                </thead>
                <tbody id="staffTable">
                </tbody>
            </table>
        </div>
    </div>

    <!-- Modal für neues Teammitglied -->
    <div id="addStaffModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeAddStaffModal()">&times;</span>
            <h2>Neues Teammitglied</h2>
            <div class="form-group">
                <label for="newStaffName">Name</label>
                <input type="text" id="newStaffName" placeholder="Minecraft Username">
            </div>
            <div class="form-group">
                <label for="newStaffRank">Startrang</label>
                <select id="newStaffRank">
                    <option value="500">Co-Owner (500 Punkte)</option>
                    <option value="400">Admin (400 Punkte)</option>
                    <option value="300">Jr. Admin (300 Punkte)</option>
                    <option value="250">Moderator (250 Punkte)</option>
                    <option value="200">Jr. Moderator (200 Punkte)</option>
                    <option value="150">Supporter (150 Punkte)</option>
                    <option value="0">Jr. Supporter (0 Punkte)</option>
                </select>
            </div>
            <button onclick="addStaffMember()">Hinzufügen</button>
        </div>
    </div>

    <script>
        // Teammitglieder-Daten
        let staffMembers = [
            { id: 1, name: "Alex", points: 450, rank: "Admin" },
            { id: 2, name: "Maria", points: 280, rank: "Moderator" },
            { id: 3, name: "Tom", points: 180, rank: "Supporter" }
        ];

        // Rang-Schwellenwerte
        const rankThresholds = [
            { rank: "Co-Owner", points: 500 },
            { rank: "Admin", points: 400 },
            { rank: "Jr. Admin", points: 300 },
            { rank: "Moderator", points: 250 },
            { rank: "Jr. Moderator", points: 200 },
            { rank: "Supporter", points: 150 },
            { rank: "Jr. Supporter", points: 0 }
        ];

        // Initialisierung
        document.addEventListener('DOMContentLoaded', function() {
            updateStaffTable();
            updateStaffSelect();
        });

        // Rang basierend auf Punkten berechnen
        function calculateRank(points) {
            for (let threshold of rankThresholds) {
                if (points >= threshold.points) {
                    return threshold.rank;
                }
            }
            return "Entfernt aus dem Team";
        }

        // Teammitglieder-Tabelle aktualisieren
        function updateStaffTable() {
            const table = document.getElementById('staffTable');
            table.innerHTML = '';
            
            staffMembers.forEach(member => {
                const row = table.insertRow();
                row.insertCell(0).textContent = member.name;
                row.insertCell(1).textContent = member.rank;
                row.insertCell(2).textContent = member.points;
            });
        }

        // Teammitglieder-Dropdown aktualisieren
        function updateStaffSelect() {
            const select = document.getElementById('staffSelect');
            select.innerHTML = '<option value="">Wähle ein Teammitglied</option>';
            
            staffMembers.forEach(member => {
                const option = document.createElement('option');
                option.value = member.id;
                option.textContent = member.name;
                select.appendChild(option);
            });
        }

        // Punkte abziehen
        function deductPoints() {
            const staffId = document.getElementById('staffSelect').value;
            const violationPoints = document.getElementById('violationSelect').value;

            if (!staffId || !violationPoints) {
                alert('Bitte wähle ein Teammitglied und einen Regelverstoß aus.');
                return;
            }

            const member = staffMembers.find(m => m.id == staffId);
            if (member) {
                member.points = Math.max(0, member.points - parseInt(violationPoints));
                member.rank = calculateRank(member.points);
                updateStaffTable();
                
                document.getElementById('staffSelect').value = '';
                document.getElementById('violationSelect').value = '';
            }
        }

        // Modal öffnen
        function openAddStaffModal() {
            document.getElementById('addStaffModal').style.display = 'block';
        }

        // Modal schließen
        function closeAddStaffModal() {
            document.getElementById('addStaffModal').style.display = 'none';
        }

        // Neues Teammitglied hinzufügen
        function addStaffMember() {
            const name = document.getElementById('newStaffName').value;
            const points = parseInt(document.getElementById('newStaffRank').value);

            if (!name) {
                alert('Bitte gib einen Namen ein.');
                return;
            }

            const newMember = {
                id: staffMembers.length + 1,
                name: name,
                points: points,
                rank: calculateRank(points)
            };

            staffMembers.push(newMember);
            updateStaffTable();
            updateStaffSelect();
            closeAddStaffModal();

            // Formular zurücksetzen
            document.getElementById('newStaffName').value = '';
            document.getElementById('newStaffRank').value = '0';
        }

        // Modal schließen wenn außerhalb geklickt wird
        window.onclick = function(event) {
            const modal = document.getElementById('addStaffModal');
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    </script>
</body>
</html>

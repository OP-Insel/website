// Import the Firebase SDK
import { initializeApp } from "firebase/app";

// Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);

// Role configuration
const ROLES = {
    OWNER: {
        name: "Owner",
        level: 8,
        pointThreshold: Infinity
    },
    CO_OWNER: {
        name: "Co-Owner",
        level: 7,
        pointThreshold: 500
    },
    ADMIN: {
        name: "Admin",
        level: 6,
        pointThreshold: 400
    },
    JR_ADMIN: {
        name: "Jr. Admin",
        level: 5,
        pointThreshold: 300
    },
    MODERATOR: {
        name: "Moderator",
        level: 4,
        pointThreshold: 250
    },
    JR_MODERATOR: {
        name: "Jr. Moderator",
        level: 3,
        pointThreshold: 200
    },
    SUPPORTER: {
        name: "Supporter",
        level: 2,
        pointThreshold: 150
    },
    JR_SUPPORTER: {
        name: "Jr. Supporter",
        level: 1,
        pointThreshold: 0
    }
};

// Infraction types
const INFRACTIONS = {
    BAN: {
        name: "Ban without reason",
        points: -5
    },
    UNFAIR: {
        name: "Unfair punishment",
        points: -10
    },
    ABUSE: {
        name: "Admin rights abuse",
        points: -20
    },
    INSULT: {
        name: "Insults",
        points: -15
    },
    INACTIVE: {
        name: "Inactivity",
        points: -10
    },
    REPEAT: {
        name: "Repeated misconduct",
        points: -30
    },
    SPAM: {
        name: "Spamming",
        points: -5
    },
    SEVERE: {
        name: "Severe violation",
        points: -20
    }
};

// Task types
const TASK_TYPES = {
    MAIN: "Main Quest",
    SIDE: "Side Quest",
    REGULAR: "Regular Task"
};

// Task statuses
const TASK_STATUSES = {
    NOT_STARTED: "Not Started",
    IN_PROGRESS: "In Progress",
    COMPLETED: "Completed"
};


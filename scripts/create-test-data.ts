/**
 * Dieses Skript erstellt Testdaten für die Entwicklung
 * Es sollte nur in der Entwicklungsumgebung verwendet werden
 */

import { createUser, createContent, addActivityLogEntry } from "../lib/store"
import type { User, Content } from "../lib/types"

// Erstelle Testbenutzer
function createTestUsers() {
  const testUsers: Partial<User>[] = [
    {
      id: "test1",
      username: "testuser1",
      password: "password123",
      role: "moderator",
      points: 300,
      createdAt: new Date().toISOString(),
      lastPointReset: new Date().toISOString(),
      permissions: ["create_content"],
      banned: false,
      approved: true,
      pointsHistory: [
        {
          amount: 300,
          reason: "Initial points",
          timestamp: new Date().toISOString(),
          awardedBy: "system",
        },
      ],
      interactionHistory: [],
      roleExpirations: [],
    },
    {
      id: "test2",
      username: "testuser2",
      password: "password123",
      role: "user",
      points: 50,
      createdAt: new Date().toISOString(),
      lastPointReset: new Date().toISOString(),
      permissions: [],
      banned: false,
      approved: true,
      pointsHistory: [
        {
          amount: 50,
          reason: "Initial points",
          timestamp: new Date().toISOString(),
          awardedBy: "system",
        },
      ],
      interactionHistory: [],
      roleExpirations: [],
    },
    {
      id: "test3",
      username: "testuser3",
      password: "password123",
      role: "admin",
      points: 500,
      createdAt: new Date().toISOString(),
      lastPointReset: new Date().toISOString(),
      permissions: ["manage_users", "create_content"],
      banned: false,
      approved: true,
      pointsHistory: [
        {
          amount: 500,
          reason: "Initial points",
          timestamp: new Date().toISOString(),
          awardedBy: "system",
        },
      ],
      interactionHistory: [],
      roleExpirations: [],
    },
  ]

  testUsers.forEach((user) => {
    createUser(user as User)
    console.log(`Testbenutzer erstellt: ${user.username}`)
  })
}

// Erstelle Testinhalte
function createTestContent() {
  const testContent: Partial<Content>[] = [
    {
      id: "content1",
      title: "Willkommen bei OP-Insel",
      body: "<p>Willkommen auf unserem Minecraft-Server! Hier sind einige Regeln, die du beachten solltest...</p>",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "test1",
      type: "post",
      permissions: {
        view: ["user", "moderator", "admin", "co-owner", "owner"],
        edit: ["moderator", "admin", "co-owner", "owner"],
        delete: ["admin", "co-owner", "owner"],
      },
    },
    {
      id: "content2",
      title: "Neue Funktionen auf dem Server",
      body: "<p>Wir haben einige neue Funktionen hinzugefügt...</p>",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "test3",
      type: "post",
      permissions: {
        view: ["user", "moderator", "admin", "co-owner", "owner"],
        edit: ["admin", "co-owner", "owner"],
        delete: ["admin", "co-owner", "owner"],
      },
    },
  ]

  testContent.forEach((content) => {
    createContent(content as Content)
    console.log(`Testinhalt erstellt: ${content.title}`)
  })
}

// Erstelle Testaktivitäten
function createTestActivities() {
  const testActivities = [
    {
      type: "user_login",
      userId: "test1",
      username: "testuser1",
      timestamp: new Date().toISOString(),
      details: "User logged in",
    },
    {
      type: "content_created",
      userId: "test1",
      username: "testuser1",
      timestamp: new Date().toISOString(),
      details: "Created post: Willkommen bei OP-Insel",
    },
    {
      type: "user_login",
      userId: "test3",
      username: "testuser3",
      timestamp: new Date().toISOString(),
      details: "User logged in",
    },
    {
      type: "content_created",
      userId: "test3",
      username: "testuser3",
      timestamp: new Date().toISOString(),
      details: "Created post: Neue Funktionen auf dem Server",
    },
  ]

  testActivities.forEach((activity) => {
    addActivityLogEntry({
      id: Date.now().toString(),
      ...activity,
    })
    console.log(`Testaktivität erstellt: ${activity.type}`)
  })
}

// Führe alle Testdaten-Funktionen aus
createTestUsers()
createTestContent()
createTestActivities()

console.log("Alle Testdaten wurden erfolgreich erstellt!")


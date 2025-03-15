export function initializeApp() {
  // Initialize default roles if they don't exist
  if (!localStorage.getItem("roles")) {
    const defaultRoles = [
      {
        id: "owner",
        name: "Owner",
        description: "Full access to all features",
        pointThreshold: Number.POSITIVE_INFINITY,
        permissions: [
          "manage_users",
          "manage_roles",
          "manage_points",
          "create_tasks",
          "delete_tasks",
          "assign_tasks",
          "create_content",
          "delete_content",
          "edit_content",
          "ban_users",
          "view_admin",
          "assign_roles",
          "manage_stories",
        ],
      },
      {
        id: "co-owner",
        name: "Co-Owner",
        description: "Almost full access, reports to Owner",
        pointThreshold: 1000,
        permissions: [
          "manage_users",
          "manage_points",
          "create_tasks",
          "delete_tasks",
          "assign_tasks",
          "create_content",
          "delete_content",
          "edit_content",
          "ban_users",
          "view_admin",
          "manage_stories",
        ],
      },
      {
        id: "admin",
        name: "Admin",
        description: "Administrative access",
        pointThreshold: 500,
        permissions: [
          "manage_users",
          "create_tasks",
          "assign_tasks",
          "create_content",
          "delete_content",
          "ban_users",
          "view_admin",
        ],
      },
      {
        id: "moderator",
        name: "Moderator",
        description: "Content moderation",
        pointThreshold: 250,
        permissions: ["create_content", "delete_content", "ban_users"],
      },
      {
        id: "user",
        name: "User",
        description: "Regular user with limited access",
        pointThreshold: 0,
        permissions: [],
      },
    ]
    localStorage.setItem("roles", JSON.stringify(defaultRoles))
  }

  // Initialize violations if they don't exist
  if (!localStorage.getItem("violations")) {
    const defaultViolations = [
      {
        id: "spam",
        name: "Spamming",
        pointsDeduction: 50,
      },
      {
        id: "harassment",
        name: "Harassment",
        pointsDeduction: 100,
      },
      {
        id: "inappropriate_content",
        name: "Inappropriate Content",
        pointsDeduction: 75,
      },
      {
        id: "rule_breaking",
        name: "Breaking Server Rules",
        pointsDeduction: 60,
      },
    ]
    localStorage.setItem("violations", JSON.stringify(defaultViolations))
  }

  // Initialize activity log if it doesn't exist
  if (!localStorage.getItem("activityLog")) {
    localStorage.setItem("activityLog", JSON.stringify([]))
  }

  // Initialize users if they don't exist
  if (!localStorage.getItem("users")) {
    localStorage.setItem("users", JSON.stringify([]))
  }

  // Initialize stories if they don't exist
  if (!localStorage.getItem("stories")) {
    localStorage.setItem("stories", JSON.stringify([]))
  }

  // Initialize characters if they don't exist
  if (!localStorage.getItem("characters")) {
    localStorage.setItem("characters", JSON.stringify([]))
  }

  // Create owner account if it doesn't exist
  const users = JSON.parse(localStorage.getItem("users") || "[]")
  const ownerExists = users.some((user: any) => user.role === "owner")

  if (!ownerExists && users.length === 0) {
    const ownerAccount = {
      id: Date.now().toString(),
      username: "admin",
      password: "admin123", // In a real app, this should be hashed
      role: "owner",
      points: Number.POSITIVE_INFINITY,
      pointsHistory: [],
      permissions: [
        "manage_users",
        "manage_roles",
        "manage_points",
        "create_tasks",
        "delete_tasks",
        "assign_tasks",
        "create_content",
        "delete_content",
        "edit_content",
        "ban_users",
        "view_admin",
        "assign_roles",
        "manage_stories",
      ],
      createdAt: new Date().toISOString(),
      lastPointReset: new Date().toISOString(),
      tasks: [],
      banned: false,
    }

    users.push(ownerAccount)
    localStorage.setItem("users", JSON.stringify(users))

    // Add to activity log
    const activityLog = JSON.parse(localStorage.getItem("activityLog") || "[]")
    activityLog.unshift({
      id: Date.now().toString(),
      type: "system",
      userId: "system",
      username: "System",
      timestamp: new Date().toISOString(),
      details: "Owner account created automatically",
    })
    localStorage.setItem("activityLog", JSON.stringify(activityLog))
  }
}


// Configuration settings for the application
const CONFIG = {
  // Application name
  appName: "Authentication System",

  // Local storage keys
  storageKeys: {
    users: "auth_system_users",
    currentUser: "auth_system_current_user",
    logs: "auth_system_logs",
    settings: "auth_system_settings",
  },

  // Default settings
  defaultSettings: {
    allowRegistration: true,
    defaultRole: "user",
    sessionTimeout: 30, // minutes
    siteName: "Authentication System",
  },

  // Default admin user (created if no users exist)
  defaultAdmin: {
    username: "admin",
    email: "admin@example.com",
    password: "admin123", // This would be hashed in a real system
    role: "owner",
    status: "active",
    createdAt: new Date().toISOString(),
  },
}


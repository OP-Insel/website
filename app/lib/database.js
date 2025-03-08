// Simulating a database with localStorage for GitHub Pages deployment
// In a real application, this would be replaced with a proper database

const DB_PREFIX = "op_insel_db_"

// Helper to work with localStorage
const storage = {
  getItem: (key) => {
    const value = localStorage.getItem(`${DB_PREFIX}${key}`)
    return value ? JSON.parse(value) : null
  },
  setItem: (key, value) => {
    localStorage.setItem(`${DB_PREFIX}${key}`, JSON.stringify(value))
  },
}

// Initial data for the database
const initialData = {
  users: [
    {
      id: "1",
      username: "Owner",
      password: "password", // In a real app, use proper password hashing
      minecraftUsername: "OwnerMC",
      rank: "Owner",
      points: 1000,
      notes: "Server owner and administrator",
      history: [
        {
          date: "2023-05-15T12:00:00Z",
          action: "User created",
          pointsChange: 0,
        },
      ],
      shifts: [
        {
          title: "Server Maintenance",
          date: "2023-06-15",
          time: "18:00-20:00",
        },
      ],
    },
    {
      id: "2",
      username: "CoOwner",
      password: "password",
      minecraftUsername: "CoOwnerMC",
      rank: "Co-Owner",
      points: 800,
      notes: "Co-owner with administrative privileges",
      history: [
        {
          date: "2023-05-16T12:00:00Z",
          action: "User created",
          pointsChange: 0,
        },
      ],
    },
  ],

  stories: [
    {
      id: "1",
      title: "The Beginning",
      description: "The start of the OP-Insel adventure",
      content: "It was a dark and stormy night when our heroes first set foot on the island...",
      status: "published",
      chapter: 1,
      createdAt: "2023-05-10T12:00:00Z",
      createdBy: "1",
    },
  ],

  tasks: [
    {
      id: "1",
      title: "Welcome new players",
      description: "Greet new players and show them around the server",
      type: "task",
      priority: "medium",
      status: "pending",
      assignedTo: "all",
      createdAt: "2023-06-01T10:00:00Z",
      createdBy: "1",
    },
  ],

  rankConfig: [
    ["Co-Owner", "Admin", 500],
    ["Admin", "Jr. Admin", 400],
    ["Jr. Admin", "Moderator", 300],
    ["Moderator", "Jr. Moderator", 250],
    ["Jr. Moderator", "Supporter", 200],
    ["Supporter", "Jr. Supporter", 150],
    ["Jr. Supporter", "Removed", 0],
  ],

  messages: [],
}

// Initialize the database with initial data if it doesn't exist
const initDb = () => {
  for (const [key, value] of Object.entries(initialData)) {
    if (!localStorage.getItem(`${DB_PREFIX}${key}`)) {
      storage.setItem(key, value)
    }
  }
}

// Database operations
export const db = {
  // Generic CRUD operations for each collection
  users: {
    getAll: async () => {
      initDb()
      return storage.getItem("users") || []
    },
    get: async (id) => {
      const users = await db.users.getAll()
      return users.find((user) => user.id === id) || null
    },
    add: async (user) => {
      const users = await db.users.getAll()
      storage.setItem("users", [...users, user])
      return user
    },
    update: async (id, updatedUser) => {
      const users = await db.users.getAll()
      const updatedUsers = users.map((user) => (user.id === id ? { ...user, ...updatedUser } : user))
      storage.setItem("users", updatedUsers)
      return updatedUser
    },
    remove: async (id) => {
      const users = await db.users.getAll()
      const updatedUsers = users.filter((user) => user.id !== id)
      storage.setItem("users", updatedUsers)
    },
  },

  stories: {
    getAll: async () => {
      initDb()
      return storage.getItem("stories") || []
    },
    get: async (id) => {
      const stories = await db.stories.getAll()
      return stories.find((story) => story.id === id) || null
    },
    add: async (story) => {
      const stories = await db.stories.getAll()
      storage.setItem("stories", [...stories, story])
      return story
    },
    update: async (id, updatedStory) => {
      const stories = await db.stories.getAll()
      const updatedStories = stories.map((story) => (story.id === id ? { ...story, ...updatedStory } : story))
      storage.setItem("stories", updatedStories)
      return updatedStory
    },
    remove: async (id) => {
      const stories = await db.stories.getAll()
      const updatedStories = stories.filter((story) => story.id !== id)
      storage.setItem("stories", updatedStories)
    },
  },

  tasks: {
    getAll: async () => {
      initDb()
      return storage.getItem("tasks") || []
    },
    get: async (id) => {
      const tasks = await db.tasks.getAll()
      return tasks.find((task) => task.id === id) || null
    },
    add: async (task) => {
      const tasks = await db.tasks.getAll()
      storage.setItem("tasks", [...tasks, task])
      return task
    },
    update: async (id, updatedTask) => {
      const tasks = await db.tasks.getAll()
      const updatedTasks = tasks.map((task) => (task.id === id ? { ...task, ...updatedTask } : task))
      storage.setItem("tasks", updatedTasks)
      return updatedTask
    },
    remove: async (id) => {
      const tasks = await db.tasks.getAll()
      const updatedTasks = tasks.filter((task) => task.id !== id)
      storage.setItem("tasks", updatedTasks)
    },
  },

  messages: {
    getAll: async () => {
      initDb()
      return storage.getItem("messages") || []
    },
    add: async (message) => {
      const messages = await db.messages.getAll()
      const newMessages = [...messages, message]
      // Only keep the last 100 messages
      if (newMessages.length > 100) {
        newMessages.shift()
      }
      storage.setItem("messages", newMessages)
      return message
    },
  },

  rankConfig: {
    getAll: async () => {
      initDb()
      return storage.getItem("rankConfig") || []
    },
  },

  // Clear all data (for testing)
  clear: async () => {
    for (const key of Object.keys(initialData)) {
      localStorage.removeItem(`${DB_PREFIX}${key}`)
    }
    initDb()
  },
}


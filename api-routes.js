const express = require("express")
const router = express.Router()
const db = require("./database")

// Get all users
router.get("/users", (req, res) => {
  const users = db.getUsers()
  res.json(users)
})

// Get user by ID
router.get("/users/:id", (req, res) => {
  const user = db.getUserById(req.params.id)
  if (user) {
    res.json(user)
  } else {
    res.status(404).json({ error: "User not found" })
  }
})

// Get user by username
router.get("/users/by-username/:username", (req, res) => {
  const user = db.getUserByUsername(req.params.username)
  if (user) {
    res.json(user)
  } else {
    res.status(404).json({ error: "User not found" })
  }
})

// Add a new user
router.post("/users", (req, res) => {
  const userData = req.body
  if (!userData.username || !userData.rank) {
    return res.status(400).json({ error: "Username and rank are required" })
  }

  const newUser = db.addUser(userData)
  res.status(201).json(newUser)
})

// Update a user
router.put("/users/:id", (req, res) => {
  const userData = req.body
  const updatedUser = db.updateUser(req.params.id, userData)

  if (updatedUser) {
    res.json(updatedUser)
  } else {
    res.status(404).json({ error: "User not found" })
  }
})

// Delete a user
router.delete("/users/:id", (req, res) => {
  const success = db.deleteUser(req.params.id)

  if (success) {
    res.status(204).send()
  } else {
    res.status(404).json({ error: "User not found" })
  }
})

// Get all rules
router.get("/rules", (req, res) => {
  const rules = db.getRules()
  res.json(rules)
})

// Add a new rule
router.post("/rules", (req, res) => {
  const { text } = req.body
  if (!text) {
    return res.status(400).json({ error: "Rule text is required" })
  }

  const newRule = db.addRule(text)
  res.status(201).json(newRule)
})

// Update a rule
router.put("/rules/:id", (req, res) => {
  const { text } = req.body
  if (!text) {
    return res.status(400).json({ error: "Rule text is required" })
  }

  const updatedRule = db.updateRule(req.params.id, text)

  if (updatedRule) {
    res.json(updatedRule)
  } else {
    res.status(404).json({ error: "Rule not found" })
  }
})

// Delete a rule
router.delete("/rules/:id", (req, res) => {
  const success = db.deleteRule(req.params.id)

  if (success) {
    res.status(204).send()
  } else {
    res.status(404).json({ error: "Rule not found" })
  }
})

// Get all schedule events
router.get("/schedule", (req, res) => {
  const schedule = db.getSchedule()
  res.json(schedule)
})

// Add a new schedule event
router.post("/schedule", (req, res) => {
  const eventData = req.body
  if (!eventData.title || !eventData.date || !eventData.createdBy) {
    return res.status(400).json({ error: "Title, date, and createdBy are required" })
  }

  const newEvent = db.addEvent(eventData)
  res.status(201).json(newEvent)
})

// Delete a schedule event
router.delete("/schedule/:id", (req, res) => {
  const success = db.deleteEvent(req.params.id)

  if (success) {
    res.status(204).send()
  } else {
    res.status(404).json({ error: "Event not found" })
  }
})

module.exports = router


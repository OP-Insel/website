const express = require("express")
const cors = require("cors")
const apiRoutes = require("./api-routes")
const db = require("./database")

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// API Routes
app.use("/api", apiRoutes)

// Run point degradation every day
const ONE_DAY = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
setInterval(db.degradeInactiveUsers, ONE_DAY)

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


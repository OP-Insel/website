"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export function WelcomeMessage() {
  const [username, setUsername] = useState("Gast")
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    // Simulate fetching user data
    setTimeout(() => {
      setUsername("Spieler1")
      setLoaded(true)
    }, 500)
  }, [])

  return (
    <div className="mb-8">
      {loaded ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl font-bold tracking-tight">
            Hallo, <span className="text-primary">{username}</span>!
          </h1>
          <p className="text-muted-foreground mt-2">Willkommen zurück beim OP-Insel Team. Hier ist deine Übersicht.</p>
        </motion.div>
      ) : (
        <div className="h-16 flex items-center">
          <div className="h-8 w-64 bg-muted rounded animate-pulse" />
        </div>
      )}
    </div>
  )
}


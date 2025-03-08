"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { db } from "../lib/database"
import { useToast } from "@/components/ui/use-toast"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if there's a stored user session
        const session = localStorage.getItem("auth_session")

        if (session) {
          const userData = JSON.parse(session)

          // Verify the user exists in the database
          const validUser = await db.users.get(userData.id)

          if (validUser) {
            setUser(userData)
          } else {
            // Invalid session, clear it
            localStorage.removeItem("auth_session")
          }
        }
      } catch (error) {
        console.error("Auth check error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (username, password) => {
    try {
      // Find user by username
      const users = await db.users.getAll()
      const user = users.find((u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password)

      if (!user) {
        throw new Error("Invalid username or password")
      }

      // Store user session
      const session = {
        id: user.id,
        username: user.username,
        minecraftUsername: user.minecraftUsername,
        rank: user.rank,
      }

      localStorage.setItem("auth_session", JSON.stringify(session))

      setUser(session)
      return user
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const register = async (username, password) => {
    try {
      // Check if username already exists
      const users = await db.users.getAll()
      const existingUser = users.find((u) => u.username.toLowerCase() === username.toLowerCase())

      if (existingUser) {
        throw new Error("Username already exists")
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        username,
        password,
        minecraftUsername: username, // Default to same as username
        rank: "Jr. Supporter", // Default rank for new users
        points: 150,
        history: [
          {
            date: new Date().toISOString(),
            action: "User registered",
            pointsChange: 0,
          },
        ],
      }

      await db.users.add(newUser)

      return newUser
    } catch (error) {
      console.error("Register error:", error)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("auth_session")
    setUser(null)
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    })
  }

  return <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}


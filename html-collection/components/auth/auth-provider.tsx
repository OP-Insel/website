"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

type User = {
  id: string
  username: string
  email: string
  role: "Owner" | "Co-Owner" | "Admin" | "Moderator" | "Helper" | "Member"
  permissions: string[]
  avatar: string
  points: number
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
  hasPermission: (permission: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Default owner account
const DEFAULT_OWNER: User = {
  id: "1",
  username: "Owner",
  email: "owner@example.com",
  role: "Owner",
  permissions: [
    "manage_users",
    "manage_permissions",
    "manage_server",
    "view_dashboard",
    "manage_tasks",
    "manage_events",
  ],
  avatar: "https://mc-heads.net/avatar/MHF_Steve",
  points: 1000,
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Initialize data storage
  useEffect(() => {
    const initializeStorage = () => {
      // Check if users exist in localStorage
      const users = localStorage.getItem("mc_users")
      if (!users) {
        // Create default owner account
        localStorage.setItem("mc_users", JSON.stringify([DEFAULT_OWNER]))
      }

      // Initialize empty collections if they don't exist
      if (!localStorage.getItem("mc_tasks")) {
        localStorage.setItem("mc_tasks", JSON.stringify([]))
      }
      if (!localStorage.getItem("mc_events")) {
        localStorage.setItem("mc_events", JSON.stringify([]))
      }
      if (!localStorage.getItem("mc_settings")) {
        localStorage.setItem(
          "mc_settings",
          JSON.stringify({
            server: {
              serverName: "Minecraft Server",
              serverDescription: "A Minecraft server",
              maxPlayers: 20,
              difficulty: "normal",
              gamemode: "survival",
              pvp: true,
              whitelist: false,
              motd: "Welcome to the server!",
            },
            website: {
              darkMode: true,
              notificationsEnabled: true,
              emailNotifications: false,
              activityWarningDays: 7,
              showOfflineUsers: true,
            },
          }),
        )
      }
    }

    initializeStorage()
  }, [])

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // In a real app, you would verify the token with your backend
        const storedUser = localStorage.getItem("mc_user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error("Authentication error:", error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Redirect unauthenticated users away from protected routes
  useEffect(() => {
    if (!isLoading) {
      const isAuthRoute = pathname?.startsWith("/(auth)") || pathname === "/login" || pathname === "/register"

      if (!user && !isAuthRoute && pathname !== "/") {
        router.push("/login")
      } else if (user && isAuthRoute) {
        router.push("/dashboard")
      }
    }
  }, [user, isLoading, pathname, router])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Get users from localStorage
      const usersJson = localStorage.getItem("mc_users")
      const users = usersJson ? JSON.parse(usersJson) : []

      // Find user with matching email
      const foundUser = users.find((u: User) => u.email === email)

      // In a real app, you would check the password hash
      // For this demo, we'll just check if the email matches the owner account
      if (foundUser && (email === "owner@example.com" || password === "password")) {
        setUser(foundUser)
        localStorage.setItem("mc_user", JSON.stringify(foundUser))
        return
      }

      throw new Error("Invalid email or password")
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      // Get existing users
      const usersJson = localStorage.getItem("mc_users")
      const users = usersJson ? JSON.parse(usersJson) : []

      // Check if email already exists
      if (users.some((u: User) => u.email === email)) {
        throw new Error("Email already in use")
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        username,
        email,
        role: "Member", // Default role for new users
        permissions: ["view_dashboard"], // Default permissions
        avatar: `https://mc-heads.net/avatar/${username}`,
        points: 0,
      }

      // Add to users array
      users.push(newUser)
      localStorage.setItem("mc_users", JSON.stringify(users))

      // Log in the new user
      setUser(newUser)
      localStorage.setItem("mc_user", JSON.stringify(newUser))
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("mc_user")
    router.push("/login")
  }

  const hasPermission = (permission: string) => {
    if (!user) return false
    return user.permissions.includes(permission)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}


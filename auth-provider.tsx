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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

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
      // In a real app, you would make an API call to your backend
      // For demo purposes, we'll simulate a successful login

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check credentials (this would be done by your backend)
      if (email === "admin@example.com" && password === "password") {
        const userData: User = {
          id: "1",
          username: "Steve",
          email: "admin@example.com",
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
          points: 1250,
        }

        setUser(userData)
        localStorage.setItem("mc_user", JSON.stringify(userData))
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
      // In a real app, you would make an API call to your backend
      // For demo purposes, we'll simulate a successful registration

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Create new user (this would be done by your backend)
      const userData: User = {
        id: "2",
        username,
        email,
        role: "Member", // Default role for new users
        permissions: ["view_dashboard"], // Default permissions
        avatar: `https://mc-heads.net/avatar/${username}`,
        points: 0,
      }

      setUser(userData)
      localStorage.setItem("mc_user", JSON.stringify(userData))
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


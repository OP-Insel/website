"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { getUsers, saveCurrentUser, initializeStorage } from "@/lib/storage"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    // Initialize storage with default data
    initializeStorage()
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // For demo purposes, find a user with matching username
    // In a real app, you would validate credentials against a backend
    const users = getUsers()
    const user = users.find((u) => u.minecraftUsername.toLowerCase() === username.toLowerCase())

    if (user) {
      // In a real app, you would verify the password here
      // For demo, we'll just accept any password
      saveCurrentUser(user)

      setTimeout(() => {
        router.push("/dashboard")
        setIsLoading(false)
      }, 1000)
    } else {
      setError("Invalid username or password")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black dark:from-black dark:to-gray-900 p-4">
      <div className="absolute top-4 right-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-full bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-colors"
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>

      <Card className="w-full max-w-md border-gray-800 dark:border-gray-700 bg-white/5 dark:bg-black/50 backdrop-blur-md shadow-2xl border-white/10 text-white animate-fade-in">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4 animate-slide-down">
            <div className="relative w-24 h-24 bg-white/10 rounded-full p-1 backdrop-blur-sm">
              <Image
                src="/placeholder.svg?height=96&width=96"
                alt="Minecraft Server Logo"
                fill
                className="object-contain rounded-full"
              />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white">Minecraft Team Portal</CardTitle>
          <CardDescription className="text-gray-300">
            Enter your credentials to access the team management system
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2 animate-slide-up" style={{ animationDelay: "100ms" }}>
              <Label htmlFor="username" className="text-gray-200">
                Minecraft Username
              </Label>
              <Input
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-white/30 transition-colors"
              />
            </div>
            <div className="space-y-2 animate-slide-up" style={{ animationDelay: "200ms" }}>
              <Label htmlFor="password" className="text-gray-200">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-white/30 transition-colors"
              />
            </div>
            {error && (
              <div className="text-sm text-red-300 bg-red-900/20 p-2 rounded-md border border-red-800/30 animate-fade-in">
                {error}
              </div>
            )}
            <div
              className="text-xs text-gray-300 bg-white/5 p-3 rounded-md animate-slide-up"
              style={{ animationDelay: "300ms" }}
            >
              <p className="font-semibold mb-1">Demo Login Information:</p>
              <p>Use any of these usernames: MaxMC, JaneDoeMC, AlexMC, SamBuilds, ChrisSupport, EmilyDev</p>
              <p>Password: any password will work for the demo</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full bg-white text-black hover:bg-gray-200 font-bold transition-colors animate-slide-up"
              style={{ animationDelay: "400ms" }}
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}


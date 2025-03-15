"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, LogIn, UserPlus, ArrowRight } from "lucide-react"
import { initializeStore } from "@/lib/store"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Initialize default data if not exists
    initializeStore()

    // Check if user is already logged in
    const user = localStorage.getItem("currentUser")
    if (user) {
      router.push("/dashboard")
    }
  }, [router])

  const validateForm = () => {
    if (!username.trim()) {
      setFormError("Benutzername ist erforderlich")
      return false
    }
    if (!password.trim()) {
      setFormError("Passwort ist erforderlich")
      return false
    }
    if (isRegistering && password.length < 6) {
      setFormError("Passwort muss mindestens 6 Zeichen lang sein")
      return false
    }
    setFormError(null)
    return true
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    setFormError(null)

    try {
      if (isRegistering) {
        // Registration logic
        const users = JSON.parse(localStorage.getItem("users") || "[]")
        const userExists = users.some((user: any) => user.username.toLowerCase() === username.toLowerCase())

        if (userExists) {
          throw new Error("Benutzername existiert bereits")
        }

        const newUser = {
          id: Date.now().toString(),
          username,
          password, // In a real app, this should be hashed
          role: "user", // Default role
          points: 0,
          pointsHistory: [],
          permissions: [],
          createdAt: new Date().toISOString(),
          lastPointReset: new Date().toISOString(),
          tasks: [],
          interactionHistory: [],
          roleExpirations: [],
          approved: false, // New users need approval
        }

        users.push(newUser)
        localStorage.setItem("users", JSON.stringify(users))

        // Store user without password in currentUser
        const { password: _password, ...userWithoutPassword } = newUser
        localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword))

        // Add to activity log
        const activityLog = JSON.parse(localStorage.getItem("activityLog") || "[]")
        activityLog.unshift({
          id: Date.now().toString(),
          type: "user_registered",
          userId: newUser.id,
          username: newUser.username,
          timestamp: new Date().toISOString(),
          details: "User registered",
        })
        localStorage.setItem("activityLog", JSON.stringify(activityLog))

        toast({
          title: "Erfolg",
          description: "Dein Konto wurde erstellt. Willkommen!",
        })
      } else {
        // Login logic
        const users = JSON.parse(localStorage.getItem("users") || "[]")
        const user = users.find(
          (user: any) => user.username.toLowerCase() === username.toLowerCase() && user.password === password,
        )

        if (!user) {
          throw new Error("Ungültige Anmeldedaten")
        }

        if (user.banned) {
          throw new Error("Dein Konto wurde gesperrt. Bitte kontaktiere einen Administrator.")
        }

        if (!user.approved && user.role !== "owner" && user.role !== "co-owner") {
          throw new Error(
            "Dein Konto wurde noch nicht freigegeben. Bitte warte auf die Freigabe durch einen Administrator.",
          )
        }

        // Store user without password in currentUser
        const { password: _password, ...userWithoutPassword } = user
        localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword))

        // Add to activity log
        const activityLog = JSON.parse(localStorage.getItem("activityLog") || "[]")
        activityLog.unshift({
          id: Date.now().toString(),
          type: "user_login",
          userId: user.id,
          username: user.username,
          timestamp: new Date().toISOString(),
          details: "User logged in",
        })
        localStorage.setItem("activityLog", JSON.stringify(activityLog))

        toast({
          title: "Erfolg",
          description: `Willkommen zurück, ${username}!`,
        })
      }

      // Simulate network delay for animation
      setTimeout(() => {
        router.push("/dashboard")
      }, 500)
    } catch (error: any) {
      setFormError(error.message)
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-secondary/20 p-4">
      <div className="w-full max-w-md">
        <Card className="border-2 shadow-lg">
          <CardHeader className="space-y-1">
            <div>
              <CardTitle className="text-2xl font-bold text-center">
                {isRegistering ? "Registrieren" : "Anmelden"}
              </CardTitle>
              <CardDescription className="text-center">
                {isRegistering ? "Erstelle ein neues Konto für OP-Insel" : "Melde dich bei deinem OP-Insel Konto an"}
              </CardDescription>
            </div>
          </CardHeader>
          <form onSubmit={handleAuth}>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="username" className="text-sm">
                    Benutzername
                  </Label>
                  <Input
                    id="username"
                    placeholder="Gib deinen Benutzernamen ein"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password" className="text-sm">
                    Passwort
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Gib dein Passwort ein"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                  />
                </div>
                {formError && (
                  <div className="bg-destructive/10 text-destructive text-sm p-2 rounded-md">{formError}</div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="w-full">
                <Button type="submit" className="w-full font-semibold" disabled={loading} size="lg">
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : isRegistering ? (
                    <UserPlus className="mr-2 h-4 w-4" />
                  ) : (
                    <LogIn className="mr-2 h-4 w-4" />
                  )}
                  {isRegistering ? "Registrieren" : "Anmelden"}
                  {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </div>
              <div>
                <Button
                  type="button"
                  variant="link"
                  className="w-full"
                  onClick={() => setIsRegistering(!isRegistering)}
                  disabled={loading}
                >
                  {isRegistering ? "Du hast bereits ein Konto? Anmelden" : "Noch kein Konto? Registrieren"}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}


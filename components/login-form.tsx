"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

export function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [registerUsername, setRegisterUsername] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem("currentUser")
    if (user) {
      router.push("/dashboard")
    }

    // Initialize users if not exists
    if (!localStorage.getItem("users")) {
      const initialUsers = [
        {
          username: "owner",
          password: "password123",
          role: "owner",
          points: 100,
          permissions: ["manage_permissions", "manage_points", "manage_tasks", "manage_users", "access_admin"],
        },
        {
          username: "co-owner",
          password: "password123",
          role: "co-owner",
          points: 75,
          permissions: ["manage_permissions", "manage_points", "manage_tasks", "manage_users", "access_admin"],
        },
        {
          username: "admin",
          password: "password123",
          role: "admin",
          points: 50,
          permissions: ["manage_points", "manage_tasks", "manage_users", "access_admin"],
        },
        {
          username: "user",
          password: "password123",
          role: "user",
          points: 10,
          permissions: [],
        },
      ]
      localStorage.setItem("users", JSON.stringify(initialUsers))
    }
  }, [router])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const user = users.find((u: any) => u.username === username && u.password === password)

    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user))
      toast({
        title: "Erfolgreich eingeloggt",
        description: `Willkommen zurück, ${username}!`,
      })
      router.push("/dashboard")
    } else {
      toast({
        title: "Login fehlgeschlagen",
        description: "Benutzername oder Passwort ist falsch.",
        variant: "destructive",
      })
    }
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()

    if (registerPassword !== confirmPassword) {
      toast({
        title: "Registrierung fehlgeschlagen",
        description: "Passwörter stimmen nicht überein.",
        variant: "destructive",
      })
      return
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]")

    if (users.some((u: any) => u.username === registerUsername)) {
      toast({
        title: "Registrierung fehlgeschlagen",
        description: "Benutzername bereits vergeben.",
        variant: "destructive",
      })
      return
    }

    const newUser = {
      username: registerUsername,
      password: registerPassword,
      role: "pending",
      points: 0,
      permissions: [],
    }

    users.push(newUser)
    localStorage.setItem("users", JSON.stringify(users))

    toast({
      title: "Registrierung erfolgreich",
      description: "Bitte warte auf die Freischaltung durch einen Administrator.",
    })

    setRegisterUsername("")
    setRegisterPassword("")
    setConfirmPassword("")
  }

  return (
    <Card className="w-full">
      <Tabs defaultValue="login">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Registrieren</TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <form onSubmit={handleLogin}>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Melde dich mit deinem Benutzernamen und Passwort an.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Benutzername</Label>
                <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Passwort</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">
                Anmelden
              </Button>
            </CardFooter>
          </form>
        </TabsContent>

        <TabsContent value="register">
          <form onSubmit={handleRegister}>
            <CardHeader>
              <CardTitle>Registrieren</CardTitle>
              <CardDescription>Erstelle einen neuen Account für das OP-Insel Team.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-username">Benutzername</Label>
                <Input
                  id="register-username"
                  value={registerUsername}
                  onChange={(e) => setRegisterUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-password">Passwort</Label>
                <Input
                  id="register-password"
                  type="password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Passwort bestätigen</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">
                Registrieren
              </Button>
            </CardFooter>
          </form>
        </TabsContent>
      </Tabs>
    </Card>
  )
}


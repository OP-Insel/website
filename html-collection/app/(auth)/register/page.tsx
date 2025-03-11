"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isValidatingUsername, setIsValidatingUsername] = useState(false)
  const [usernameValid, setUsernameValid] = useState<boolean | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Reset username validation when username changes
    if (name === "username") {
      setUsernameValid(null)
    }
  }

  const validateMinecraftUsername = async (username: string) => {
    if (!username) return false

    setIsValidatingUsername(true)
    try {
      // In a real app, you would call an API to validate the Minecraft username
      // For demo purposes, we'll simulate an API call
      const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`)
      const isValid = response.ok
      setUsernameValid(isValid)
      return isValid
    } catch (error) {
      setUsernameValid(false)
      return false
    } finally {
      setIsValidatingUsername(false)
    }
  }

  const handleBlurUsername = () => {
    if (formData.username) {
      validateMinecraftUsername(formData.username)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Validate inputs
      if (!formData.username || !formData.email || !formData.password) {
        throw new Error("Bitte fülle alle erforderlichen Felder aus")
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwörter stimmen nicht überein")
      }

      // Validate Minecraft username
      const isUsernameValid = await validateMinecraftUsername(formData.username)
      if (!isUsernameValid) {
        throw new Error("Ungültiger Minecraft-Benutzername. Bitte gib einen gültigen Benutzernamen ein.")
      }

      // Register user
      await register(formData.username, formData.email, formData.password)
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registrierung fehlgeschlagen")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Konto erstellen</CardTitle>
          <CardDescription>
            Registriere dich, um auf das Minecraft-Server-Management-Dashboard zuzugreifen
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="username">Minecraft-Benutzername</Label>
              <div className="relative">
                <Input
                  id="username"
                  name="username"
                  placeholder="Dein Minecraft-Benutzername"
                  value={formData.username}
                  onChange={handleChange}
                  onBlur={handleBlurUsername}
                  className={
                    usernameValid === true
                      ? "border-green-500 pr-10"
                      : usernameValid === false
                        ? "border-red-500 pr-10"
                        : ""
                  }
                  required
                />
                {isValidatingUsername && (
                  <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                )}
                {usernameValid === true && !isValidatingUsername && (
                  <div className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-green-500" />
                )}
                {usernameValid === false && !isValidatingUsername && (
                  <div className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-red-500" />
                )}
              </div>
              {usernameValid === false && <p className="text-sm text-red-500">Ungültiger Minecraft-Benutzername</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="deine.email@beispiel.de"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Passwort</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Passwort bestätigen</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-sm text-red-500">Passwörter stimmen nicht überein</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Konto wird erstellt..." : "Registrieren"}
            </Button>
            <div className="text-center text-sm">
              Hast du bereits ein Konto?{" "}
              <Link href="/login" className="text-primary underline-offset-4 hover:underline">
                Anmelden
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}


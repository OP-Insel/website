"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Bitte fülle alle Felder aus.")
      return
    }

    setIsLoading(true)

    try {
      // Simulate login - in a real app, this would be an API call
      setTimeout(() => {
        // Mock user data - in a real app, this would come from the server
        const userData = {
          name: "TestUser",
          minecraftName: "TestPlayer",
          email: formData.email,
          rank: "Admin", // For testing admin features
          points: 450,
        }

        // Store user in localStorage
        localStorage.setItem("user", JSON.stringify(userData))

        setIsLoading(false)
        // Redirect to dashboard
        router.push("/")
      }, 1500)
    } catch (err) {
      setError("Ungültige Anmeldedaten. Bitte versuche es erneut.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Anmelden</CardTitle>
          <CardDescription className="text-center">Melde dich bei deinem OP-INSEL Team Dashboard an</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="deine.email@beispiel.de"
                value={formData.email}
                onChange={handleChange}
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
              />
            </div>
            <div className="text-right text-sm">
              <Link href="/forgot-password" className="text-muted-foreground hover:text-primary">
                Passwort vergessen?
              </Link>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Anmelden..." : "Anmelden"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-center text-sm">
            Noch kein Konto?{" "}
            <Link href="/register" className="underline underline-offset-4 hover:text-primary">
              Registrieren
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}


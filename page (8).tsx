"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Get form data
    const formData = new FormData(e.target as HTMLFormElement)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    // Check if owner credentials
    if (email === "admin@opinsel.de" && password === "OPInsel2025!") {
      // Set owner cookie with higher privileges
      document.cookie = "auth-token=owner-token; path=/; max-age=86400"
      document.cookie = "user-role=owner; path=/; max-age=86400"

      toast({
        title: "Besitzer-Login erfolgreich",
        description: "Willkommen zurück, Admin!",
      })
    } else {
      // Set regular user cookie
      document.cookie = "auth-token=user-token; path=/; max-age=86400"
      document.cookie = "user-role=user; path=/; max-age=86400"

      toast({
        title: "Login erfolgreich",
        description: "Willkommen zurück bei OP Insel!",
      })
    }

    setIsLoading(false)
    router.push("/dashboard")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">OP Insel Login</CardTitle>
          <CardDescription>Melde dich an, um auf das Dashboard zuzugreifen</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" required />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-sm text-primary underline-offset-4 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input id="password" type="password" required />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Anmeldung..." : "Anmelden"}
            </Button>
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary underline-offset-4 hover:underline">
                Register
              </Link>
            </div>
          </CardFooter>
        </form>
        <div className="text-center text-sm mt-2">
          <p className="text-muted-foreground">Besitzer-Login: admin@opinsel.de / OPInsel2025!</p>
        </div>
      </Card>
    </div>
  )
}


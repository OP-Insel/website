"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useStore } from "@/lib/store"

export default function LoginDialog() {
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")
  const { login, isLoading } = useStore()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username.trim()) {
      setError("Bitte gib einen Benutzernamen ein")
      return
    }

    try {
      const success = await login(username)
      if (!success) {
        setError("Benutzer nicht gefunden")
      }
    } catch (err) {
      setError("Fehler beim Anmelden")
      console.error(err)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-md mx-auto space-y-4 bg-card p-6 rounded-xl shadow-lg border">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Minecraft Team Manager</h1>
          <p className="text-muted-foreground">Melde dich mit deinem Benutzernamen an</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Benutzername</Label>
            <Input
              id="username"
              placeholder="Dein Minecraft-Benutzername"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                setError("")
              }}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Wird angemeldet..." : "Anmelden"}
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          <p>Demo-Benutzer: Admin User (Owner)</p>
        </div>
      </div>
    </div>
  )
}


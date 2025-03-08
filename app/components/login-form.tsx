"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { LanguageToggle } from "./language-toggle"
import { useLanguage } from "../hooks/use-language"
import { translations } from "../data/translations"

export function LoginForm({ onLogin }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { language } = useLanguage()
  const t = translations[language]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const success = await onLogin(username, password)
      if (!success) {
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Login error:", error)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
      <div className="absolute top-4 right-4">
        <LanguageToggle />
      </div>

      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-6">
            <img src="/placeholder.svg?height=80&width=80" alt="OP-Insel Logo" className="h-20 w-20" />
          </div>
          <CardTitle className="text-2xl text-center">{t.loginToOpInsel}</CardTitle>
          <CardDescription className="text-center">{t.enterCredentialsToAccess}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username">{t.username}</Label>
                <Input
                  id="username"
                  placeholder={t.enterUsername}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-zinc-800 border-zinc-700"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">{t.password}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t.enterPassword}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-zinc-800 border-zinc-700"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? t.loggingIn : t.login}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="text-sm text-center text-zinc-500 mt-4">
            {t.serverIp}: <span className="font-bold text-zinc-300">OPInsel.de</span>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}


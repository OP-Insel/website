"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useAuth } from "../../hooks/use-auth"
import { useToast } from "@/components/ui/use-toast"
import { Github, Lock, User } from "lucide-react"

export function UserAuthForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isRegisterMode, setIsRegisterMode] = useState(false)
  const { login, register } = useAuth()
  const { toast } = useToast()

  async function onSubmit(event) {
    event.preventDefault()
    setIsLoading(true)

    try {
      if (isRegisterMode) {
        await register(username, password)
        toast({
          title: "Account created!",
          description: "You can now log in with your credentials.",
        })
        setIsRegisterMode(false)
      } else {
        await login(username, password)
        toast({
          title: "Welcome back!",
          description: "You've successfully logged in.",
        })
      }
    } catch (error) {
      toast({
        title: "Authentication error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
      <Card className="border-zinc-800 bg-zinc-950">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2">
            <Github className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl text-center">OP-Insel</CardTitle>
          <CardDescription className="text-center">
            {isRegisterMode ? "Create an account to access the team dashboard" : "Log in to access the team dashboard"}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form onSubmit={onSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    placeholder="Your Minecraft username"
                    type="text"
                    autoCapitalize="none"
                    autoComplete="username"
                    autoCorrect="off"
                    disabled={isLoading}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-8 bg-zinc-900 border-zinc-800"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    placeholder="Your password"
                    type="password"
                    autoCapitalize="none"
                    autoComplete={isRegisterMode ? "new-password" : "current-password"}
                    autoCorrect="off"
                    disabled={isLoading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-8 bg-zinc-900 border-zinc-800"
                  />
                </div>
              </div>
              <Button type="submit" disabled={isLoading || !username || !password}>
                {isLoading ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {isRegisterMode ? "Registering..." : "Logging in..."}
                  </div>
                ) : (
                  <>{isRegisterMode ? "Register" : "Login"}</>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="text-sm text-muted-foreground text-center mb-2">
            <span className="text-zinc-500">Server IP: </span>
            <span className="font-medium">OPInsel.de</span>
          </div>
          <Button
            variant="link"
            className="px-0 text-xs"
            disabled={isLoading}
            onClick={() => setIsRegisterMode(!isRegisterMode)}
          >
            {isRegisterMode ? "Already have an account? Login" : "Don't have an account? Register"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}


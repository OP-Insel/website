"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function LoginPage() {
  const [rank, setRank] = useState("")

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white p-4">
      <div className="container mx-auto max-w-md pt-8">
        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-white">Team Login</CardTitle>
            <CardDescription className="text-zinc-400">Melde dich mit deinen Zugangsdaten an</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rank">Rang</Label>
                <Select value={rank} onValueChange={setRank}>
                  <SelectTrigger id="rank">
                    <SelectValue placeholder="Wähle deinen Rang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="owner">Owner</SelectItem>
                    <SelectItem value="coowner">Co-Owner</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="mod">Moderator</SelectItem>
                    <SelectItem value="supporter">Supporter</SelectItem>
                    <SelectItem value="builder">Builder</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Benutzername</Label>
                <Input id="username" type="text" className="bg-zinc-700" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Passwort</Label>
                <Input id="password" type="password" className="bg-zinc-700" />
              </div>

              <Button type="submit" className="w-full">
                Anmelden
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}


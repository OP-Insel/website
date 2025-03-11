"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Server, Calendar, CheckSquare } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [stats, setStats] = useState({
    users: 0,
    uptime: "99.9%",
    events: 0,
    tasks: 0,
  })

  useEffect(() => {
    // Load stats from localStorage
    const loadStats = () => {
      const users = JSON.parse(localStorage.getItem("mc_users") || "[]")
      const events = JSON.parse(localStorage.getItem("mc_events") || "[]")
      const tasks = JSON.parse(localStorage.getItem("mc_tasks") || "[]")

      setStats({
        users: users.length,
        uptime: "99.9%",
        events: events.length,
        tasks: tasks.length,
      })
    }

    loadStats()
  }, [])

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Willkommen zurück, {user?.username || "Benutzer"}!</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => router.push("/tasks")}>
            <CheckSquare className="mr-2 h-4 w-4" /> Aufgaben
          </Button>
          <Button variant="outline" onClick={() => router.push("/calendar")}>
            <Calendar className="mr-2 h-4 w-4" /> Kalender
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Benutzer</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.users}</div>
            <p className="text-xs text-muted-foreground">Registrierte Benutzer</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Server-Uptime</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uptime}</div>
            <p className="text-xs text-muted-foreground">Letzte 30 Tage</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ereignisse</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.events}</div>
            <p className="text-xs text-muted-foreground">Geplante Ereignisse</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aufgaben</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.tasks}</div>
            <p className="text-xs text-muted-foreground">Offene Aufgaben</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Willkommen zum Minecraft Server Manager</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Dieses Dashboard hilft dir, deinen Minecraft-Server zu verwalten. Hier sind einige Funktionen:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Benutzer- und Rechteverwaltung</li>
              <li>Aufgabenverwaltung mit Fortschrittsanzeige</li>
              <li>Ereigniskalender für Serveraktivitäten</li>
              <li>Servereinstellungen und Konfiguration</li>
            </ul>
            <div className="mt-4">
              <Button variant="outline" onClick={() => router.push("/users")}>
                Benutzer verwalten
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Erste Schritte</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Hier sind einige Schritte, um mit dem Minecraft Server Manager zu beginnen:</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Füge Benutzer hinzu und weise ihnen Rollen zu</li>
              <li>Erstelle Aufgaben für dein Serverteam</li>
              <li>Plane Ereignisse im Kalender</li>
              <li>Konfiguriere deine Servereinstellungen</li>
            </ol>
            <div className="mt-4">
              <Button variant="outline" onClick={() => router.push("/settings")}>
                Einstellungen anpassen
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


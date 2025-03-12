"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ServerStatus } from "@/components/server-status"
import { TaskSummary } from "@/components/task-summary"
import { RecentActivity } from "@/components/recent-activity"
import { TeamPoints } from "@/components/team-points"

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (userData) {
      setUser(JSON.parse(userData))
    }

    // Initialize activities if not exists
    if (!localStorage.getItem("activities")) {
      const initialActivities = [
        { id: 1, user: "owner", action: "hat eine neue Aufgabe erstellt", timestamp: Date.now() - 3600000 },
        { id: 2, user: "co-owner", action: "hat 5 Punkte an user vergeben", timestamp: Date.now() - 7200000 },
        { id: 3, user: "user", action: "hat eine Aufgabe abgeschlossen", timestamp: Date.now() - 86400000 },
      ]
      localStorage.setItem("activities", JSON.stringify(initialActivities))
    }
  }, [])

  if (!user) return null

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <ServerStatus />
        <Card className="border-primary/20 bg-card/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Deine Punkte</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.points}</div>
            <p className="text-xs text-muted-foreground">
              Rang: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-primary/20 bg-card/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Offene Aufgaben</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                JSON.parse(localStorage.getItem("tasks") || "[]").filter(
                  (task: any) => !task.completed && (task.assignee === user.username || task.assignee === "all"),
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">Für dich zugewiesen</p>
          </CardContent>
        </Card>
        <Card className="border-primary/20 bg-card/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Abgeschlossene Aufgaben</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                JSON.parse(localStorage.getItem("tasks") || "[]").filter(
                  (task: any) => task.completed && task.assignee === user.username,
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">Von dir erledigt</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <TaskSummary className="md:col-span-2 border-primary/20 bg-card/80" />
        <div className="space-y-6">
          <TeamPoints className="border-primary/20 bg-card/80" />
          <RecentActivity className="border-primary/20 bg-card/80" />
        </div>
      </div>
    </div>
  )
}


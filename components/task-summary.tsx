"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

type Task = {
  id: string
  title: string
  description: string
  assignee: string
  completed: boolean
  priority: "low" | "medium" | "high"
  checklist: { id: string; text: string; completed: boolean }[]
}

export function TaskSummary({ className }: { className?: string }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (userData) {
      setUser(JSON.parse(userData))
    }

    // Initialize tasks if not exists
    if (!localStorage.getItem("tasks")) {
      const initialTasks = [
        {
          id: "1",
          title: "Server-Wartung durchführen",
          description: "Plugins aktualisieren und Server neu starten",
          assignee: "owner",
          completed: false,
          priority: "high",
          checklist: [
            { id: "1-1", text: "Plugins aktualisieren", completed: false },
            { id: "1-2", text: "Backup erstellen", completed: true },
            { id: "1-3", text: "Server neu starten", completed: false },
          ],
        },
        {
          id: "2",
          title: "Neue Spieler willkommen heißen",
          description: "Neue Spieler begrüßen und ihnen die Regeln erklären",
          assignee: "all",
          completed: false,
          priority: "medium",
          checklist: [
            { id: "2-1", text: "Begrüßungsnachricht senden", completed: false },
            { id: "2-2", text: "Regeln erklären", completed: false },
          ],
        },
        {
          id: "3",
          title: "Wöchentliches Event planen",
          description: "Ein Event für das Wochenende planen",
          assignee: "co-owner",
          completed: false,
          priority: "low",
          checklist: [
            { id: "3-1", text: "Event-Typ auswählen", completed: true },
            { id: "3-2", text: "Datum und Uhrzeit festlegen", completed: false },
            { id: "3-3", text: "Ankündigung erstellen", completed: false },
          ],
        },
      ]
      localStorage.setItem("tasks", JSON.stringify(initialTasks))
    }

    const storedTasks = localStorage.getItem("tasks")
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks))
    }
  }, [])

  if (!user) return null

  // Filter tasks for the current user
  const userTasks = tasks.filter(
    (task) => (task.assignee === user.username || task.assignee === "all") && !task.completed,
  )

  return (
    <Card className={cn("col-span-2", className)}>
      <CardHeader>
        <CardTitle>Aufgaben-Übersicht</CardTitle>
        <CardDescription>Deine aktuellen Aufgaben und deren Fortschritt</CardDescription>
      </CardHeader>
      <CardContent>
        {userTasks.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">Keine offenen Aufgaben vorhanden</p>
        ) : (
          <div className="space-y-4">
            {userTasks.map((task) => {
              const completedItems = task.checklist.filter((item) => item.completed).length
              const totalItems = task.checklist.length
              const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0

              return (
                <div key={task.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                    </div>
                    <Badge task={task.priority} />
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={progress} className="h-2" />
                    <span className="text-sm text-muted-foreground w-12">{Math.round(progress)}%</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function Badge({ task }: { task: "low" | "medium" | "high" }) {
  const colors = {
    low: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
    medium: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
    high: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
  }

  const labels = {
    low: "Niedrig",
    medium: "Mittel",
    high: "Hoch",
  }

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[task]}`}>
      {labels[task]}
    </span>
  )
}


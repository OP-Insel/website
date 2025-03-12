import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, CheckCircle2, Clock, AlertCircle } from "lucide-react"
import { TaskItem } from "@/components/task-item"

export default function TasksPage() {
  // Mock data for tasks
  const tasks = {
    open: [
      { id: 1, title: "Server-Neustart planen", progress: 0, priority: "high", assignee: "Spieler1" },
      { id: 2, title: "Neue Spielwelt erstellen", progress: 30, priority: "medium", assignee: "Spieler2" },
      { id: 3, title: "Plugin-Updates durchführen", progress: 10, priority: "low", assignee: null },
    ],
    inProgress: [
      { id: 4, title: "Spawn-Bereich gestalten", progress: 60, priority: "medium", assignee: "Spieler3" },
      { id: 5, title: "Berechtigungen überprüfen", progress: 45, priority: "high", assignee: "Spieler1" },
    ],
    completed: [
      { id: 6, title: "Discord-Server einrichten", progress: 100, priority: "medium", assignee: "Spieler2" },
      { id: 7, title: "Website-Domain registrieren", progress: 100, priority: "high", assignee: "Spieler1" },
    ],
  }

  return (
    <div className="container py-6 space-y-8 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Aufgabenverwaltung</h1>
          <p className="text-muted-foreground mt-2">Verwalte und überwache alle Aufgaben des Teams.</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Neue Aufgabe
        </Button>
      </div>

      <Tabs defaultValue="open" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="open" className="gap-2">
            <AlertCircle className="h-4 w-4" />
            Offen ({tasks.open.length})
          </TabsTrigger>
          <TabsTrigger value="inProgress" className="gap-2">
            <Clock className="h-4 w-4" />
            In Bearbeitung ({tasks.inProgress.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Abgeschlossen ({tasks.completed.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="open" className="space-y-4">
          {tasks.open.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </TabsContent>

        <TabsContent value="inProgress" className="space-y-4">
          {tasks.inProgress.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {tasks.completed.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}


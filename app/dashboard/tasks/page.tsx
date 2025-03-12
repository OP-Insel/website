"use client"

import { useEffect, useState } from "react"
import { Plus, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TaskList } from "@/components/task-list"
import { TaskForm } from "@/components/task-form"
import { useToast } from "@/hooks/use-toast"

type Task = {
  id: string
  title: string
  description: string
  assignee: string
  completed: boolean
  priority: "low" | "medium" | "high"
  checklist: { id: string; text: string; completed: boolean }[]
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [user, setUser] = useState<any>(null)
  const { toast } = useToast()

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (userData) {
      setUser(JSON.parse(userData))
    }

    const storedTasks = localStorage.getItem("tasks")
    if (storedTasks) {
      const parsedTasks = JSON.parse(storedTasks)
      setTasks(parsedTasks)
      setFilteredTasks(parsedTasks)
    }
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredTasks(tasks)
    } else {
      const filtered = tasks.filter(
        (task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredTasks(filtered)
    }
  }, [searchQuery, tasks])

  // Verbesserte handleCreateTask-Funktion mit korrekter Speicherung
  const handleCreateTask = (newTask: Task) => {
    // Ensure task has a unique ID
    if (!newTask.id) {
      newTask.id = Date.now().toString()
    }

    const updatedTasks = [...tasks, newTask]
    setTasks(updatedTasks)
    localStorage.setItem("tasks", JSON.stringify(updatedTasks))

    // Add activity
    const activities = JSON.parse(localStorage.getItem("activities") || "[]")
    const newActivity = {
      id: Date.now(),
      user: user.username,
      action: `hat eine neue Aufgabe erstellt: "${newTask.title}"`,
      timestamp: Date.now(),
    }
    localStorage.setItem("activities", JSON.stringify([newActivity, ...activities]))

    setShowForm(false)
    toast({
      title: "Aufgabe erstellt",
      description: "Die Aufgabe wurde erfolgreich erstellt.",
    })
  }

  const handleUpdateTask = (updatedTask: Task) => {
    const updatedTasks = tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    setTasks(updatedTasks)
    localStorage.setItem("tasks", JSON.stringify(updatedTasks))

    // Add activity
    const activities = JSON.parse(localStorage.getItem("activities") || "[]")
    const newActivity = {
      id: Date.now(),
      user: user.username,
      action: `hat die Aufgabe "${updatedTask.title}" aktualisiert`,
      timestamp: Date.now(),
    }
    localStorage.setItem("activities", JSON.stringify([newActivity, ...activities]))

    toast({
      title: "Aufgabe aktualisiert",
      description: "Die Aufgabe wurde erfolgreich aktualisiert.",
    })
  }

  const canCreateTasks = user?.permissions?.includes("manage_tasks")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Aufgaben</h1>
        {canCreateTasks && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Neue Aufgabe
          </Button>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Aufgaben durchsuchen..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Alle</TabsTrigger>
          <TabsTrigger value="assigned">Mir zugewiesen</TabsTrigger>
          <TabsTrigger value="completed">Abgeschlossen</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <TaskList tasks={filteredTasks} onUpdateTask={handleUpdateTask} filter="all" />
        </TabsContent>
        <TabsContent value="assigned">
          <TaskList tasks={filteredTasks} onUpdateTask={handleUpdateTask} filter="assigned" />
        </TabsContent>
        <TabsContent value="completed">
          <TaskList tasks={filteredTasks} onUpdateTask={handleUpdateTask} filter="completed" />
        </TabsContent>
      </Tabs>

      {showForm && (
        <Card className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <CardContent className="w-full max-w-md p-6">
            <TaskForm onSubmit={handleCreateTask} onCancel={() => setShowForm(false)} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}


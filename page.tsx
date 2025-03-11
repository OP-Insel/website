"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckSquare, Plus, ArrowLeft } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"

type Task = {
  id: number
  title: string
  description: string
  progress: number
  priority: "Low" | "Medium" | "High"
  assignee: string
  status: "Todo" | "In Progress" | "Completed"
  checklistItems: { id: number; text: string; completed: boolean }[]
}

export default function TasksPage() {
  const router = useRouter()
  const { hasPermission, user } = useAuth()
  const canManageTasks = hasPermission("manage_tasks")

  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [newTaskData, setNewTaskData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    assignee: "",
  })
  const [newChecklistItem, setNewChecklistItem] = useState("")
  const [newChecklistItems, setNewChecklistItems] = useState<string[]>([])

  // Load tasks from localStorage
  useEffect(() => {
    const storedTasks = localStorage.getItem("mc_tasks")
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks))
    }
  }, [])

  // Save tasks to localStorage when they change
  useEffect(() => {
    localStorage.setItem("mc_tasks", JSON.stringify(tasks))
  }, [tasks])

  // Filter tasks by status
  const todoTasks = tasks.filter((task) => task.status === "Todo")
  const inProgressTasks = tasks.filter((task) => task.status === "In Progress")
  const completedTasks = tasks.filter((task) => task.status === "Completed")

  // Function to toggle checklist item
  const toggleChecklistItem = (taskId: number, itemId: number) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          const updatedItems = task.checklistItems.map((item) => {
            if (item.id === itemId) {
              return { ...item, completed: !item.completed }
            }
            return item
          })

          // Calculate new progress
          const completedCount = updatedItems.filter((item) => item.completed).length
          const progress = Math.round((completedCount / updatedItems.length) * 100)

          return {
            ...task,
            checklistItems: updatedItems,
            progress,
          }
        }
        return task
      }),
    )
  }

  // Function to add a new checklist item to the form
  const addChecklistItem = () => {
    if (newChecklistItem.trim()) {
      setNewChecklistItems([...newChecklistItems, newChecklistItem])
      setNewChecklistItem("")
    }
  }

  // Function to remove a checklist item from the form
  const removeChecklistItem = (index: number) => {
    setNewChecklistItems(newChecklistItems.filter((_, i) => i !== index))
  }

  // Function to create a new task
  const createTask = () => {
    if (!newTaskData.title) return

    const newTask: Task = {
      id: tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1,
      title: newTaskData.title,
      description: newTaskData.description,
      priority: newTaskData.priority as "Low" | "Medium" | "High",
      assignee: newTaskData.assignee || user?.username || "Unassigned",
      status: "Todo",
      progress: 0,
      checklistItems: newChecklistItems.map((text, index) => ({
        id: index + 1,
        text,
        completed: false,
      })),
    }

    setTasks([...tasks, newTask])

    // Reset form
    setNewTaskData({
      title: "",
      description: "",
      priority: "Medium",
      assignee: "",
    })
    setNewChecklistItems([])
  }

  // Function to update task status
  const updateTaskStatus = (taskId: number, status: "Todo" | "In Progress" | "Completed") => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          return { ...task, status }
        }
        return task
      }),
    )
  }

  // Render task card
  const renderTaskCard = (task: Task) => (
    <Card key={task.id} className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{task.title}</CardTitle>
          <Badge
            variant={task.priority === "High" ? "destructive" : task.priority === "Medium" ? "default" : "secondary"}
          >
            {task.priority}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">Zugewiesen an: {task.assignee}</p>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-4">{task.description}</p>

        <div className="space-y-1 mb-4">
          <div className="flex justify-between text-xs">
            <span>Fortschritt</span>
            <span>{task.progress}%</span>
          </div>
          <Progress value={task.progress} className="h-2" />
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={() => setSelectedTask(task)}>
            Details
          </Button>
          {task.status !== "Completed" && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => updateTaskStatus(task.id, "Completed")}
            >
              Abschließen
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Aufgabenverwaltung</h1>
        </div>
        {canManageTasks && (
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Neue Aufgabe
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Neue Aufgabe erstellen</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="task-title">Aufgabentitel</Label>
                  <Input
                    id="task-title"
                    placeholder="Titel eingeben"
                    value={newTaskData.title}
                    onChange={(e) => setNewTaskData({ ...newTaskData, title: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="task-description">Beschreibung</Label>
                  <Textarea
                    id="task-description"
                    placeholder="Beschreibung eingeben"
                    value={newTaskData.description}
                    onChange={(e) => setNewTaskData({ ...newTaskData, description: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="task-priority">Priorität</Label>
                  <Select
                    value={newTaskData.priority}
                    onValueChange={(value) => setNewTaskData({ ...newTaskData, priority: value })}
                  >
                    <SelectTrigger id="task-priority">
                      <SelectValue placeholder="Priorität auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Niedrig</SelectItem>
                      <SelectItem value="Medium">Mittel</SelectItem>
                      <SelectItem value="High">Hoch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="task-assignee">Zugewiesen an</Label>
                  <Input
                    id="task-assignee"
                    placeholder="Benutzername eingeben"
                    value={newTaskData.assignee}
                    onChange={(e) => setNewTaskData({ ...newTaskData, assignee: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Checklisten-Elemente</Label>
                  <div className="space-y-2">
                    {newChecklistItems.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input value={item} readOnly />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => removeChecklistItem(index)}
                          className="h-8 w-8"
                        >
                          &times;
                        </Button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Checklisten-Element hinzufügen"
                        value={newChecklistItem}
                        onChange={(e) => setNewChecklistItem(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            addChecklistItem()
                          }
                        }}
                      />
                      <Button variant="outline" size="sm" onClick={addChecklistItem}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <Button type="button" onClick={createTask} disabled={!newTaskData.title}>
                  Aufgabe erstellen
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Tabs defaultValue="todo" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="todo">
            <CheckSquare className="mr-2 h-4 w-4" /> Offen ({todoTasks.length})
          </TabsTrigger>
          <TabsTrigger value="in-progress">In Bearbeitung ({inProgressTasks.length})</TabsTrigger>
          <TabsTrigger value="completed">Abgeschlossen ({completedTasks.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="todo" className="mt-6">
          {todoTasks.length > 0 ? (
            todoTasks.map(renderTaskCard)
          ) : (
            <p className="text-center text-muted-foreground py-8">Keine offenen Aufgaben.</p>
          )}
        </TabsContent>
        <TabsContent value="in-progress" className="mt-6">
          {inProgressTasks.length > 0 ? (
            inProgressTasks.map(renderTaskCard)
          ) : (
            <p className="text-center text-muted-foreground py-8">Keine Aufgaben in Bearbeitung.</p>
          )}
        </TabsContent>
        <TabsContent value="completed" className="mt-6">
          {completedTasks.length > 0 ? (
            completedTasks.map(renderTaskCard)
          ) : (
            <p className="text-center text-muted-foreground py-8">Keine abgeschlossenen Aufgaben.</p>
          )}
        </TabsContent>
      </Tabs>

      {selectedTask && (
        <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedTask.title}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <h3 className="font-medium mb-2">Beschreibung</h3>
                <p className="text-sm">{selectedTask.description}</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Zugewiesen an</p>
                    <p>{selectedTask.assignee}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Priorität</p>
                    <Badge
                      variant={
                        selectedTask.priority === "High"
                          ? "destructive"
                          : selectedTask.priority === "Medium"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {selectedTask.priority}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <p>{selectedTask.status}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Fortschritt</p>
                    <p>{selectedTask.progress}%</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Checkliste</h3>
                <div className="space-y-2">
                  {selectedTask.checklistItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => toggleChecklistItem(selectedTask.id, item.id)}
                        className="h-4 w-4"
                      />
                      <span className={item.completed ? "line-through text-muted-foreground" : ""}>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setSelectedTask(null)}>
                  Schließen
                </Button>
                <div className="flex gap-2">
                  {selectedTask.status === "Todo" && (
                    <Button
                      onClick={() => {
                        updateTaskStatus(selectedTask.id, "In Progress")
                        setSelectedTask(null)
                      }}
                    >
                      In Bearbeitung setzen
                    </Button>
                  )}
                  {selectedTask.status !== "Completed" && (
                    <Button
                      onClick={() => {
                        updateTaskStatus(selectedTask.id, "Completed")
                        setSelectedTask(null)
                      }}
                    >
                      Als abgeschlossen markieren
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}


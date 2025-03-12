"use client"

import { useState, useEffect } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Edit } from "lucide-react"
import { TaskForm } from "@/components/task-form"

type Task = {
  id: string
  title: string
  description: string
  assignee: string
  completed: boolean
  priority: "low" | "medium" | "high"
  checklist: { id: string; text: string; completed: boolean }[]
}

type TaskListProps = {
  tasks: Task[]
  onUpdateTask: (task: Task) => void
  filter: "all" | "assigned" | "completed"
}

export function TaskList({ tasks, onUpdateTask, filter }: TaskListProps) {
  const [user, setUser] = useState<any>(null)
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  useEffect(() => {
    if (!user) return

    let filtered = [...tasks]

    if (filter === "assigned") {
      filtered = tasks.filter((task) => (task.assignee === user.username || task.assignee === "all") && !task.completed)
    } else if (filter === "completed") {
      filtered = tasks.filter((task) => task.completed)
    }

    setFilteredTasks(filtered)
  }, [tasks, filter, user])

  const handleChecklistItemToggle = (taskId: string, itemId: string) => {
    const task = tasks.find((t) => t.id === taskId)
    if (!task) return

    const updatedTask = {
      ...task,
      checklist: task.checklist.map((item) => (item.id === itemId ? { ...item, completed: !item.completed } : item)),
    }

    // Check if all checklist items are completed
    const allCompleted = updatedTask.checklist.every((item) => item.completed)
    updatedTask.completed = allCompleted

    onUpdateTask(updatedTask)
  }

  const handleTaskUpdate = (updatedTask: Task) => {
    onUpdateTask(updatedTask)
    setEditingTask(null)
  }

  if (!user) return null

  const canEditTasks = user?.permissions?.includes("manage_tasks")

  return (
    <div className="space-y-4 mt-4">
      {filteredTasks.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">Keine Aufgaben gefunden</p>
      ) : (
        filteredTasks.map((task) => {
          const completedItems = task.checklist.filter((item) => item.completed).length
          const totalItems = task.checklist.length
          const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0

          return (
            <Card key={task.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-medium">{task.title}</h3>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                    <p className="text-xs text-muted-foreground">
                      Zugewiesen an: {task.assignee === "all" ? "Alle" : task.assignee}
                    </p>
                  </div>
                  {canEditTasks && (
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => setEditingTask(task)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Progress value={progress} className="h-2" />
                    <span className="text-sm text-muted-foreground w-12">{Math.round(progress)}%</span>
                  </div>

                  <div className="space-y-2 mt-4">
                    {task.checklist.map((item) => (
                      <div key={item.id} className="flex items-start gap-2">
                        <Checkbox
                          id={`item-${item.id}`}
                          checked={item.completed}
                          onCheckedChange={() => handleChecklistItemToggle(task.id, item.id)}
                        />
                        <label
                          htmlFor={`item-${item.id}`}
                          className={`text-sm ${item.completed ? "line-through text-muted-foreground" : ""}`}
                        >
                          {item.text}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })
      )}

      {editingTask && (
        <Card className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <CardContent className="w-full max-w-md p-6">
            <TaskForm task={editingTask} onSubmit={handleTaskUpdate} onCancel={() => setEditingTask(null)} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}


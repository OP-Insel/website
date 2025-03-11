"use client"

import { useState } from "react"
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
import { CheckSquare, Plus, AlertTriangle } from "lucide-react"

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
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "Update server plugins",
      description: "Check for updates to all plugins and update them to the latest versions",
      progress: 75,
      priority: "High",
      assignee: "Steve",
      status: "In Progress",
      checklistItems: [
        { id: 1, text: "Backup server", completed: true },
        { id: 2, text: "Check for plugin updates", completed: true },
        { id: 3, text: "Update plugins", completed: true },
        { id: 4, text: "Test server functionality", completed: false },
      ],
    },
    {
      id: 2,
      title: "Create new spawn area",
      description: "Design and build a new spawn area for the server",
      progress: 30,
      priority: "Medium",
      assignee: "Alex",
      status: "In Progress",
      checklistItems: [
        { id: 1, text: "Create design mockup", completed: true },
        { id: 2, text: "Clear area", completed: true },
        { id: 3, text: "Build main structures", completed: false },
        { id: 4, text: "Add decorations", completed: false },
        { id: 5, text: "Set spawn point", completed: false },
      ],
    },
    {
      id: 3,
      title: "Fix permissions system",
      description: "Resolve issues with the permissions plugin",
      progress: 10,
      priority: "High",
      assignee: "Unassigned",
      status: "Todo",
      checklistItems: [
        { id: 1, text: "Identify permission issues", completed: true },
        { id: 2, text: "Research solutions", completed: false },
        { id: 3, text: "Implement fixes", completed: false },
        { id: 4, text: "Test permissions", completed: false },
      ],
    },
    {
      id: 4,
      title: "Update server rules",
      description: "Review and update the server rules",
      progress: 100,
      priority: "Low",
      assignee: "Steve",
      status: "Completed",
      checklistItems: [
        { id: 1, text: "Review current rules", completed: true },
        { id: 2, text: "Draft new rules", completed: true },
        { id: 3, text: "Get feedback from staff", completed: true },
        { id: 4, text: "Publish new rules", completed: true },
      ],
    },
  ])

  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

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
        <p className="text-sm text-muted-foreground">Assigned to: {task.assignee}</p>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-4">{task.description}</p>

        <div className="space-y-1 mb-4">
          <div className="flex justify-between text-xs">
            <span>Progress</span>
            <span>{task.progress}%</span>
          </div>
          <Progress value={task.progress} className="h-2" />
        </div>

        <Button variant="outline" size="sm" className="w-full" onClick={() => setSelectedTask(task)}>
          View Details
        </Button>
      </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Task Management</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> New Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="task-title">Task Title</Label>
                <Input id="task-title" placeholder="Enter task title" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="task-description">Description</Label>
                <Textarea id="task-description" placeholder="Enter task details" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="task-priority">Priority</Label>
                <Select>
                  <SelectTrigger id="task-priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="task-assignee">Assignee</Label>
                <Input id="task-assignee" placeholder="Enter assignee name" />
              </div>
              <div className="grid gap-2">
                <Label>Checklist Items</Label>
                <div className="space-y-2">
                  <Input placeholder="Add checklist item" />
                  <Button variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" /> Add Item
                  </Button>
                </div>
              </div>
              <Button type="submit">Create Task</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="todo" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="todo">
            <CheckSquare className="mr-2 h-4 w-4" /> Todo ({todoTasks.length})
          </TabsTrigger>
          <TabsTrigger value="in-progress">In Progress ({inProgressTasks.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedTasks.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="todo" className="mt-6">
          {todoTasks.length > 0 ? (
            todoTasks.map(renderTaskCard)
          ) : (
            <p className="text-center text-muted-foreground py-8">No tasks in todo.</p>
          )}
        </TabsContent>
        <TabsContent value="in-progress" className="mt-6">
          {inProgressTasks.length > 0 ? (
            inProgressTasks.map(renderTaskCard)
          ) : (
            <p className="text-center text-muted-foreground py-8">No tasks in progress.</p>
          )}
        </TabsContent>
        <TabsContent value="completed" className="mt-6">
          {completedTasks.length > 0 ? (
            completedTasks.map(renderTaskCard)
          ) : (
            <p className="text-center text-muted-foreground py-8">No completed tasks.</p>
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
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-sm">{selectedTask.description}</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Assignee</p>
                    <p>{selectedTask.assignee}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Priority</p>
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
                    <p className="text-muted-foreground">Progress</p>
                    <p>{selectedTask.progress}%</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Checklist</h3>
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
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Inactive Users Warning */}
      <Card className="mt-8 border-amber-500">
        <CardHeader className="pb-2">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
            <CardTitle className="text-lg">Activity Warnings</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-4">The following users have been inactive for more than 7 days:</p>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 bg-muted rounded-md">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-amber-500 flex items-center justify-center text-white">C</div>
                <span>Creeper (Moderator)</span>
              </div>
              <Badge variant="outline">Inactive for 8 days</Badge>
            </div>
            <div className="flex justify-between items-center p-2 bg-muted rounded-md">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-amber-500 flex items-center justify-center text-white">Z</div>
                <span>Zombie (Helper)</span>
              </div>
              <Badge variant="outline">Inactive for 12 days</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


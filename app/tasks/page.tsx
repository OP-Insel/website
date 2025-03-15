"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle2, Clock, Plus, Trash2, User } from "lucide-react"

interface Task {
  id: string
  title: string
  description: string
  priority: "low" | "medium" | "high"
  deadline: string
  completed: boolean
  checklist: { id: string; text: string; completed: boolean }[]
  assignedTo?: string // User ID
  createdBy: string // User ID
  createdAt: string
}

export default function TasksPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [allUsers, setAllUsers] = useState<any[]>([])
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: "",
    description: "",
    priority: "medium",
    deadline: new Date().toISOString().split("T")[0],
    completed: false,
    checklist: [],
    assignedTo: "",
  })
  const [newChecklistItem, setNewChecklistItem] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [canCreateTasks, setCanCreateTasks] = useState(false)
  const [canAssignTasks, setCanAssignTasks] = useState(false)
  const [viewMode, setViewMode] = useState<"my" | "all">("my")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      router.push("/")
      return
    }

    try {
      const userData = JSON.parse(currentUser)
      setUser(userData)

      // Get all users for task assignment
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      setAllUsers(users)

      // Check if user has permission to create tasks
      const hasCreatePermission =
        userData &&
        (userData.role === "owner" ||
          userData.role === "co-owner" ||
          (userData.permissions && userData.permissions.includes("create_tasks")))
      setCanCreateTasks(hasCreatePermission)

      // Check if user has permission to assign tasks
      const hasAssignPermission =
        userData &&
        (userData.role === "owner" ||
          userData.role === "co-owner" ||
          (userData.permissions && userData.permissions.includes("assign_tasks")))
      setCanAssignTasks(hasAssignPermission)

      // Get tasks from localStorage
      if (userData) {
        loadTasks(userData, viewMode)
      }
      // Set loading to false when done
      setIsLoading(false)
    } catch (error) {
      console.error("Error parsing user data:", error)
      router.push("/")
    }
  }, [router, viewMode])

  const loadTasks = (userData: any, mode: "my" | "all") => {
    if (!userData) return

    const users = JSON.parse(localStorage.getItem("users") || "[]")
    let loadedTasks: Task[] = []

    if (mode === "my") {
      // Get tasks assigned to current user
      const currentUserData = users.find((u: any) => u.id === userData.id)
      if (currentUserData && currentUserData.tasks) {
        loadedTasks = currentUserData.tasks
      }
    } else {
      // Get all tasks from all users if user is owner or co-owner
      if (userData.role === "owner" || userData.role === "co-owner") {
        users.forEach((u: any) => {
          if (u.tasks && Array.isArray(u.tasks)) {
            loadedTasks = [...loadedTasks, ...u.tasks]
          }
        })
        // Remove duplicates (in case a task is assigned to multiple users)
        loadedTasks = Array.from(new Map(loadedTasks.map((task) => [task.id, task])).values())
      } else {
        // For regular users, just show their own tasks
        const currentUserData = users.find((u: any) => u.id === userData.id)
        if (currentUserData && currentUserData.tasks) {
          loadedTasks = currentUserData.tasks
        }
      }
    }

    setTasks(loadedTasks)
  }

  const handleAddChecklistItem = () => {
    if (!newChecklistItem.trim()) return

    setNewTask({
      ...newTask,
      checklist: [
        ...(newTask.checklist || []),
        {
          id: Date.now().toString(),
          text: newChecklistItem,
          completed: false,
        },
      ],
    })

    setNewChecklistItem("")
  }

  const handleRemoveChecklistItem = (id: string) => {
    setNewTask({
      ...newTask,
      checklist: (newTask.checklist || []).filter((item) => item.id !== id),
    })
  }

  const handleCreateTask = () => {
    if (!newTask.title || !newTask.deadline) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title || "",
      description: newTask.description || "",
      priority: (newTask.priority as "low" | "medium" | "high") || "medium",
      deadline: newTask.deadline || new Date().toISOString().split("T")[0],
      completed: false,
      checklist: newTask.checklist || [],
      assignedTo: newTask.assignedTo || user.id, // Default to current user if not specified
      createdBy: user.id,
      createdAt: new Date().toISOString(),
    }

    // Update tasks in localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]")

    // Find the user to assign the task to
    const targetUserId = task.assignedTo || user.id

    const updatedUsers = users.map((u: any) => {
      if (u.id === targetUserId) {
        const userTasks = u.tasks || []
        return { ...u, tasks: [...userTasks, task] }
      }
      return u
    })

    localStorage.setItem("users", JSON.stringify(updatedUsers))

    // Update current user if the task is assigned to them
    if (targetUserId === user.id) {
      const updatedUser = { ...user, tasks: [...(user.tasks || []), task] }
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))
      setUser(updatedUser)
    }

    // Add to activity log
    const activityLog = JSON.parse(localStorage.getItem("activityLog") || "[]")
    activityLog.unshift({
      id: Date.now().toString(),
      type: "task_created",
      userId: user.id,
      username: user.username,
      timestamp: new Date().toISOString(),
      details: `Created task "${task.title}" ${targetUserId !== user.id ? `and assigned to ${users.find((u: any) => u.id === targetUserId)?.username}` : ""}`,
    })
    localStorage.setItem("activityLog", JSON.stringify(activityLog))

    // Reload tasks
    loadTasks(user, viewMode)

    // Reset form and close dialog
    setNewTask({
      title: "",
      description: "",
      priority: "medium",
      deadline: new Date().toISOString().split("T")[0],
      completed: false,
      checklist: [],
      assignedTo: "",
    })
    setDialogOpen(false)

    toast({
      title: "Success",
      description: "Task has been created.",
    })
  }

  const toggleTaskCompletion = (taskId: string) => {
    const taskToToggle = tasks.find((t) => t.id === taskId)
    if (!taskToToggle) return

    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        return { ...task, completed: !task.completed }
      }
      return task
    })

    // Update tasks in localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]")

    const updatedUsers = users.map((u: any) => {
      if (u.id === (taskToToggle.assignedTo || user.id)) {
        return {
          ...u,
          tasks: (u.tasks || []).map((t: any) => (t.id === taskId ? { ...t, completed: !taskToToggle.completed } : t)),
        }
      }
      return u
    })

    localStorage.setItem("users", JSON.stringify(updatedUsers))

    // Update current user if needed
    if (taskToToggle.assignedTo === user.id || (!taskToToggle.assignedTo && user.id === taskToToggle.createdBy)) {
      const updatedUser = {
        ...user,
        tasks: (user.tasks || []).map((t: any) => (t.id === taskId ? { ...t, completed: !taskToToggle.completed } : t)),
      }
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))
      setUser(updatedUser)
    }

    // Add to activity log
    const activityLog = JSON.parse(localStorage.getItem("activityLog") || "[]")
    activityLog.unshift({
      id: Date.now().toString(),
      type: taskToToggle.completed ? "task_reopened" : "task_completed",
      userId: user.id,
      username: user.username,
      timestamp: new Date().toISOString(),
      details: `${taskToToggle.completed ? "Reopened" : "Completed"} task "${taskToToggle.title}"`,
    })
    localStorage.setItem("activityLog", JSON.stringify(activityLog))

    // Reload tasks
    loadTasks(user, viewMode)

    toast({
      title: "Success",
      description: `Task "${taskToToggle.title}" ${taskToToggle.completed ? "reopened" : "completed"}.`,
    })
  }

  const toggleChecklistItem = (taskId: string, itemId: string) => {
    const taskToUpdate = tasks.find((t) => t.id === taskId)
    if (!taskToUpdate) return

    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        const updatedChecklist = task.checklist.map((item) => {
          if (item.id === itemId) {
            return { ...item, completed: !item.completed }
          }
          return item
        })
        return { ...task, checklist: updatedChecklist }
      }
      return task
    })

    // Update tasks in localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]")

    const updatedUsers = users.map((u: any) => {
      if (u.id === (taskToUpdate.assignedTo || user.id)) {
        return {
          ...u,
          tasks: (u.tasks || []).map((t: any) =>
            t.id === taskId
              ? {
                  ...t,
                  checklist: t.checklist.map((item: any) =>
                    item.id === itemId ? { ...item, completed: !item.completed } : item,
                  ),
                }
              : t,
          ),
        }
      }
      return u
    })

    localStorage.setItem("users", JSON.stringify(updatedUsers))

    // Update current user if needed
    if (taskToUpdate.assignedTo === user.id || (!taskToUpdate.assignedTo && user.id === taskToUpdate.createdBy)) {
      const updatedUser = {
        ...user,
        tasks: (user.tasks || []).map((t: any) =>
          t.id === taskId
            ? {
                ...t,
                checklist: t.checklist.map((item: any) =>
                  item.id === itemId ? { ...item, completed: !item.completed } : item,
                ),
              }
            : t,
        ),
      }
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))
      setUser(updatedUser)
    }

    // Reload tasks
    loadTasks(user, viewMode)
  }

  const deleteTask = (taskId: string) => {
    const taskToDelete = tasks.find((t) => t.id === taskId)
    if (!taskToDelete) return

    // Update tasks in localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]")

    const updatedUsers = users.map((u: any) => {
      return {
        ...u,
        tasks: (u.tasks || []).filter((t: any) => t.id !== taskId),
      }
    })

    localStorage.setItem("users", JSON.stringify(updatedUsers))

    // Update current user
    const updatedUser = {
      ...user,
      tasks: (user.tasks || []).filter((t: any) => t.id !== taskId),
    }
    localStorage.setItem("currentUser", JSON.stringify(updatedUser))
    setUser(updatedUser)

    // Add to activity log
    const activityLog = JSON.parse(localStorage.getItem("activityLog") || "[]")
    activityLog.unshift({
      id: Date.now().toString(),
      type: "task_deleted",
      userId: user.id,
      username: user.username,
      timestamp: new Date().toISOString(),
      details: `Deleted task "${taskToDelete.title}"`,
    })
    localStorage.setItem("activityLog", JSON.stringify(activityLog))

    // Reload tasks
    loadTasks(user, viewMode)

    toast({
      title: "Success",
      description: "Task has been deleted.",
    })
  }

  const calculateProgress = (task: Task) => {
    if (task.checklist.length === 0) return task.completed ? 100 : 0
    const completedItems = task.checklist.filter((item) => item.completed).length
    return Math.round((completedItems / task.checklist.length) * 100)
  }

  const getAssignedUsername = (userId: string) => {
    const assignedUser = allUsers.find((u) => u.id === userId)
    return assignedUser ? assignedUser.username : "Unknown User"
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading tasks...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Tasks</h2>
          <div className="flex space-x-2">
            {user && (user.role === "owner" || user.role === "co-owner") && (
              <Select value={viewMode} onValueChange={(value) => setViewMode(value as "my" | "all")}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="View mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="my">My Tasks</SelectItem>
                  <SelectItem value="all">All Tasks</SelectItem>
                </SelectContent>
              </Select>
            )}

            {canCreateTasks && (
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Task
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                    <DialogDescription>Create a new task with checklist and deadline.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        placeholder="Task title"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        placeholder="Task description"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select
                          value={newTask.priority}
                          onValueChange={(value) => setNewTask({ ...newTask, priority: value as any })}
                        >
                          <SelectTrigger>
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
                        <Label htmlFor="deadline">Deadline</Label>
                        <Input
                          id="deadline"
                          type="date"
                          value={newTask.deadline}
                          onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                        />
                      </div>
                    </div>

                    {canAssignTasks && (
                      <div className="grid gap-2">
                        <Label htmlFor="assignedTo">Assign To</Label>
                        <Select
                          value={newTask.assignedTo}
                          onValueChange={(value) => setNewTask({ ...newTask, assignedTo: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select user" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={user.id}>Me ({user.username})</SelectItem>
                            {allUsers
                              .filter((u) => u.id !== user.id && !u.banned)
                              .map((u) => (
                                <SelectItem key={u.id} value={u.id}>
                                  {u.username} ({u.role})
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="grid gap-2">
                      <Label>Checklist</Label>
                      <div className="flex space-x-2">
                        <Input
                          value={newChecklistItem}
                          onChange={(e) => setNewChecklistItem(e.target.value)}
                          placeholder="New checklist item"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              handleAddChecklistItem()
                            }
                          }}
                        />
                        <Button type="button" onClick={handleAddChecklistItem}>
                          Add
                        </Button>
                      </div>
                      <div className="space-y-2 mt-2">
                        {newTask.checklist?.map((item) => (
                          <div key={item.id} className="flex items-center justify-between">
                            <span>{item.text}</span>
                            <Button variant="ghost" size="sm" onClick={() => handleRemoveChecklistItem(item.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleCreateTask}>Create Task</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <Card key={task.id} className={task.completed ? "opacity-75" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center">
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={() => toggleTaskCompletion(task.id)}
                          className="mr-2"
                        />
                        <span className={task.completed ? "line-through" : ""}>{task.title}</span>
                      </CardTitle>
                      <CardDescription>{task.description}</CardDescription>
                    </div>
                    <Badge
                      variant={
                        task.priority === "high" ? "destructive" : task.priority === "medium" ? "default" : "secondary"
                      }
                    >
                      {task.priority === "high" ? "High" : task.priority === "medium" ? "Medium" : "Low"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center space-x-2 text-sm mb-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Due: {new Date(task.deadline).toLocaleDateString()}</span>
                  </div>

                  {task.assignedTo && task.assignedTo !== user.id && (
                    <div className="flex items-center space-x-2 text-sm mb-4">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Assigned to: {getAssignedUsername(task.assignedTo)}</span>
                    </div>
                  )}

                  {task.checklist.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm text-muted-foreground">{calculateProgress(task)}%</span>
                      </div>
                      <Progress value={calculateProgress(task)} className="h-2" />

                      <div className="space-y-1 mt-4">
                        {task.checklist.map((item) => (
                          <div key={item.id} className="flex items-center space-x-2">
                            <Checkbox
                              checked={item.completed}
                              onCheckedChange={() => toggleChecklistItem(task.id, item.id)}
                              disabled={task.completed}
                            />
                            <span className={item.completed ? "line-through text-muted-foreground" : ""}>
                              {item.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => deleteTask(task.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <CheckCircle2 className="mx-auto h-10 w-10 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No Tasks</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                You currently have no tasks.{" "}
                {canCreateTasks ? "Create a new task to get started." : "An administrator can assign tasks to you."}
              </p>
              {canCreateTasks && (
                <Button onClick={() => setDialogOpen(true)} className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  New Task
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


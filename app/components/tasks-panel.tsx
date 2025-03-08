"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  MessageSquare,
  Plus,
  ThumbsDown,
  ThumbsUp,
  X,
} from "lucide-react"

export function TasksPanel({
  tasks,
  users,
  isAdmin,
  isOperator,
  currentUser,
  onAddTask,
  onUpdateTask,
  onApproveDeduction,
  onRejectDeduction,
}) {
  const [activeTab, setActiveTab] = useState("all")
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    type: "task",
    priority: "medium",
    assignedTo: "",
  })

  const handleNewTaskChange = (e) => {
    const { name, value } = e.target
    setNewTask((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddTask = () => {
    onAddTask(newTask)
    setNewTask({
      title: "",
      description: "",
      type: "task",
      priority: "medium",
      assignedTo: "",
    })
  }

  const handleUpdateTaskStatus = (taskId, newStatus) => {
    const task = tasks.find((t) => t.id === taskId)
    if (task) {
      onUpdateTask({
        ...task,
        status: newStatus,
        completedAt: newStatus === "completed" ? new Date().toISOString() : null,
        completedBy: newStatus === "completed" ? currentUser?.id : null,
      })
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getFilteredTasks = () => {
    switch (activeTab) {
      case "pending":
        return tasks.filter((task) => task.status === "pending")
      case "completed":
        return tasks.filter((task) => task.status === "completed")
      case "deductions":
        return tasks.filter((task) => task.type === "point_deduction")
      default:
        return tasks
    }
  }

  const filteredTasks = getFilteredTasks()

  const getTaskTypeIcon = (type) => {
    switch (type) {
      case "point_deduction":
        return <AlertTriangle className="h-4 w-4" />
      case "chat":
        return <MessageSquare className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getTaskPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-600"
      case "medium":
        return "bg-yellow-600"
      case "low":
        return "bg-blue-600"
      default:
        return "bg-zinc-600"
    }
  }

  const getUserById = (userId) => {
    return users.find((user) => user.id === userId) || null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Tasks & Assignments</h2>
        {isAdmin && (
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <DialogDescription>Assign tasks to team members</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Task Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={newTask.title}
                    onChange={handleNewTaskChange}
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="type">Task Type</Label>
                    <Select
                      value={newTask.type}
                      onValueChange={(value) => setNewTask((prev) => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger className="bg-zinc-800 border-zinc-700">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="task">General Task</SelectItem>
                        <SelectItem value="build">Build Task</SelectItem>
                        <SelectItem value="chat">Chat Announcement</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={newTask.priority}
                      onValueChange={(value) => setNewTask((prev) => ({ ...prev, priority: value }))}
                    >
                      <SelectTrigger className="bg-zinc-800 border-zinc-700">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="assignedTo">Assign To</Label>
                  <Select
                    value={newTask.assignedTo}
                    onValueChange={(value) => setNewTask((prev) => ({ ...prev, assignedTo: value }))}
                  >
                    <SelectTrigger className="bg-zinc-800 border-zinc-700">
                      <SelectValue placeholder="Select team member" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Team Members</SelectItem>
                      {users
                        .filter((user) => user.rank !== "Removed")
                        .map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.username} ({user.rank})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={newTask.description}
                    onChange={handleNewTaskChange}
                    className="min-h-[100px] bg-zinc-800 border-zinc-700"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleAddTask}>Create Task</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="pb-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="all">All Tasks</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="deductions">Deduction Requests</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="pt-6">
          {filteredTasks.length > 0 ? (
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <div key={task.id} className="p-4 rounded-lg bg-zinc-800 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-700">
                      {getTaskTypeIcon(task.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{task.title}</h3>
                        <Badge className={getTaskPriorityColor(task.priority)}>{task.priority}</Badge>
                        <Badge
                          className={
                            task.status === "pending"
                              ? "bg-yellow-600"
                              : task.status === "completed"
                                ? "bg-green-600"
                                : "bg-red-600"
                          }
                        >
                          {task.status}
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-zinc-400">
                        <Clock className="mr-1 h-3 w-3" />
                        Created: {formatDate(task.createdAt)}
                        {task.completedAt && ` • Completed: ${formatDate(task.completedAt)}`}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm">{task.description}</p>

                  {task.assignedTo && (
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <span>Assigned to:</span>
                      {task.assignedTo === "all" ? (
                        <span>All Team Members</span>
                      ) : task.assignedTo === "operators" ? (
                        <span>Operators (Owner & Co-Owner)</span>
                      ) : (
                        <div className="flex items-center gap-1">
                          <Avatar className="w-5 h-5">
                            <AvatarImage
                              src={`https://mc-heads.net/avatar/${getUserById(task.assignedTo)?.minecraftUsername}`}
                            />
                            <AvatarFallback>
                              {getUserById(task.assignedTo)?.username.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span>{getUserById(task.assignedTo)?.username}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {task.type === "point_deduction" && task.status === "pending" && isOperator && (
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="w-full" onClick={() => onRejectDeduction(task.id)}>
                        <ThumbsDown className="mr-1 h-3 w-3" />
                        Reject
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        className="w-full"
                        onClick={() => onApproveDeduction(task.id)}
                      >
                        <ThumbsUp className="mr-1 h-3 w-3" />
                        Approve
                      </Button>
                    </div>
                  )}

                  {task.type !== "point_deduction" && (
                    <div className="flex gap-2 pt-2">
                      {task.status === "pending" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => handleUpdateTaskStatus(task.id, "completed")}
                          disabled={!isAdmin && task.assignedTo !== currentUser?.id && task.assignedTo !== "all"}
                        >
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Mark Complete
                        </Button>
                      )}

                      {task.status === "completed" && isAdmin && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => handleUpdateTaskStatus(task.id, "pending")}
                        >
                          <X className="mr-1 h-3 w-3" />
                          Reopen
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-zinc-500 flex flex-col items-center">
              <CheckCircle2 className="h-8 w-8 mb-2" />
              No tasks found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


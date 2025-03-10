import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Clock, Users, MessageSquare } from "lucide-react"
import Link from "next/link"

export default function TaskDetailPage({ params }: { params: { id: string } }) {
  // In a real app, you would fetch the task data based on the ID
  const taskId = params.id

  // Mock data for the example
  const task = {
    id: taskId,
    title: "Build new spawn area",
    description:
      "Create a new spawn area with modern design that welcomes players to the server. The area should include information boards, teleport options to different server areas, and a visually appealing design.",
    progress: 75,
    status: "in-progress",
    assignees: ["Owner", "Builder"],
    dueDate: "2023-12-15",
    createdBy: "Owner",
    createdAt: "2023-11-30",
    checklist: [
      { id: "1", text: "Design spawn layout", completed: true },
      { id: "2", text: "Build main structure", completed: true },
      { id: "3", text: "Add information boards", completed: true },
      { id: "4", text: "Create teleport system", completed: false },
      { id: "5", text: "Add decorations and details", completed: false },
      { id: "6", text: "Test functionality", completed: false },
      { id: "7", text: "Get feedback from team", completed: false },
      { id: "8", text: "Make final adjustments", completed: false },
    ],
    comments: [
      { id: "1", user: "Owner", text: "Let's make this spawn area really impressive!", time: "2023-11-30 10:00" },
      {
        id: "2",
        user: "Builder",
        text: "I've started on the main structure. Should be done by tomorrow.",
        time: "2023-12-01 14:30",
      },
      { id: "3", user: "Co-Owner", text: "Looking good so far! Can we add a water feature?", time: "2023-12-02 09:15" },
    ],
  }

  // Calculate completed items percentage
  const completedItems = task.checklist.filter((item) => item.completed).length
  const totalItems = task.checklist.length
  const checklistProgress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0

  return (
    <div className="container py-10">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/tasks">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tasks
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">{task.title}</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{task.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Checklist</CardTitle>
              <CardDescription>
                {completedItems} of {totalItems} tasks completed ({Math.round(checklistProgress)}%)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Progress value={checklistProgress} className="h-2" />
              </div>

              <div className="space-y-4">
                {task.checklist.map((item) => (
                  <div key={item.id} className="flex items-center space-x-2">
                    <Checkbox id={`item-${item.id}`} checked={item.completed} />
                    <label
                      htmlFor={`item-${item.id}`}
                      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                        item.completed ? "line-through text-muted-foreground" : ""
                      }`}
                    >
                      {item.text}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Comments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {task.comments.map((comment) => (
                  <div key={comment.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-medium">{comment.user}</div>
                      <div className="text-xs text-muted-foreground">{comment.time}</div>
                    </div>
                    <p className="text-sm">{comment.text}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <textarea
                  className="w-full min-h-[100px] p-2 border rounded-md bg-background"
                  placeholder="Add a comment..."
                />
                <Button className="mt-2">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Add Comment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Task Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium mb-1">Status</div>
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                    In Progress
                  </Badge>
                </div>

                <div>
                  <div className="text-sm font-medium mb-1">Progress</div>
                  <div className="space-y-2">
                    <Progress value={task.progress} className="h-2" />
                    <div className="text-xs text-right">{task.progress}%</div>
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="text-sm font-medium mb-1">Due Date</div>
                  <div className="flex items-center text-sm">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium mb-1">Created</div>
                  <div className="text-sm text-muted-foreground">
                    By {task.createdBy} on {new Date(task.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="text-sm font-medium mb-1">Assigned To</div>
                  <div className="flex items-center text-sm">
                    <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                    {task.assignees.join(", ")}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full">Update Progress</Button>
              <Button variant="outline" className="w-full">
                Assign Team Member
              </Button>
              <Button variant="destructive" className="w-full">
                Mark as Complete
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


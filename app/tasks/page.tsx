import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckSquare, Plus, Clock } from "lucide-react"
import Link from "next/link"

export default function TasksPage() {
  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <Button asChild>
          <Link href="/tasks/new">
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Tasks</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="my-tasks">My Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <TaskCard
              title="Build new spawn area"
              description="Create a new spawn area with modern design"
              progress={75}
              status="in-progress"
              assignees={["Owner", "Builder"]}
              dueDate="2023-12-15"
            />

            <TaskCard
              title="Create PvP arena"
              description="Design and build a PvP arena with multiple levels"
              progress={30}
              status="in-progress"
              assignees={["Admin", "Builder"]}
              dueDate="2023-12-20"
            />

            <TaskCard
              title="Update server rules"
              description="Review and update the server rules"
              progress={90}
              status="in-progress"
              assignees={["Co-Owner", "Moderator"]}
              dueDate="2023-12-10"
            />

            <TaskCard
              title="Fix Nether portal"
              description="Repair broken Nether portal at spawn"
              progress={100}
              status="completed"
              assignees={["Admin"]}
              dueDate="2023-12-05"
            />

            <TaskCard
              title="Create welcome message"
              description="Design a new welcome message for new players"
              progress={0}
              status="not-started"
              assignees={["Moderator"]}
              dueDate="2023-12-25"
            />

            <TaskCard
              title="Set up economy system"
              description="Implement and configure economy plugin"
              progress={50}
              status="in-progress"
              assignees={["Owner", "Admin"]}
              dueDate="2023-12-30"
            />
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <TaskCard
              title="Build new spawn area"
              description="Create a new spawn area with modern design"
              progress={75}
              status="in-progress"
              assignees={["Owner", "Builder"]}
              dueDate="2023-12-15"
            />

            <TaskCard
              title="Create PvP arena"
              description="Design and build a PvP arena with multiple levels"
              progress={30}
              status="in-progress"
              assignees={["Admin", "Builder"]}
              dueDate="2023-12-20"
            />

            <TaskCard
              title="Update server rules"
              description="Review and update the server rules"
              progress={90}
              status="in-progress"
              assignees={["Co-Owner", "Moderator"]}
              dueDate="2023-12-10"
            />

            <TaskCard
              title="Set up economy system"
              description="Implement and configure economy plugin"
              progress={50}
              status="in-progress"
              assignees={["Owner", "Admin"]}
              dueDate="2023-12-30"
            />
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <TaskCard
              title="Fix Nether portal"
              description="Repair broken Nether portal at spawn"
              progress={100}
              status="completed"
              assignees={["Admin"]}
              dueDate="2023-12-05"
            />
          </div>
        </TabsContent>

        <TabsContent value="my-tasks" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <TaskCard
              title="Build new spawn area"
              description="Create a new spawn area with modern design"
              progress={75}
              status="in-progress"
              assignees={["Owner", "Builder"]}
              dueDate="2023-12-15"
            />

            <TaskCard
              title="Set up economy system"
              description="Implement and configure economy plugin"
              progress={50}
              status="in-progress"
              assignees={["Owner", "Admin"]}
              dueDate="2023-12-30"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface TaskCardProps {
  title: string
  description: string
  progress: number
  status: "not-started" | "in-progress" | "completed"
  assignees: string[]
  dueDate: string
}

function TaskCard({ title, description, progress, status, assignees, dueDate }: TaskCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle>{title}</CardTitle>
          {status === "not-started" && (
            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
              Not Started
            </Badge>
          )}
          {status === "in-progress" && (
            <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
              In Progress
            </Badge>
          )}
          {status === "completed" && (
            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
              Completed
            </Badge>
          )}
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-1 h-4 w-4" />
            <span>Due: {new Date(dueDate).toLocaleDateString()}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {assignees.map((assignee, index) => (
              <Badge key={index} variant="secondary">
                {assignee}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
          <Link href={`/tasks/${encodeURIComponent(title.toLowerCase().replace(/ /g, "-"))}`}>
            <CheckSquare className="mr-2 h-4 w-4" />
            View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}


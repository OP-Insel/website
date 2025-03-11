import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export function RecentTasks() {
  const tasks = [
    {
      id: 1,
      title: "Update server plugins",
      progress: 75,
      priority: "High",
      assignee: "Steve",
    },
    {
      id: 2,
      title: "Create new spawn area",
      progress: 30,
      priority: "Medium",
      assignee: "Alex",
    },
    {
      id: 3,
      title: "Fix permissions system",
      progress: 10,
      priority: "High",
      assignee: "Unassigned",
    },
  ]

  return (
    <Card className="col-span-1 row-span-2">
      <CardHeader>
        <CardTitle>Recent Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="border-b pb-4 last:border-0 last:pb-0">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium">{task.title}</h3>
                  <p className="text-sm text-muted-foreground">Assigned to: {task.assignee}</p>
                </div>
                <Badge variant={task.priority === "High" ? "destructive" : "secondary"}>{task.priority}</Badge>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Progress</span>
                  <span>{task.progress}%</span>
                </div>
                <Progress value={task.progress} className="h-2" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}


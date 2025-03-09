import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

const tasks = [
  {
    id: 1,
    title: "Review new member applications",
    description: "Check applications in the Discord channel and approve/deny based on our guidelines.",
    status: "pending",
    priority: "high",
    due: "Today, 8:00 PM",
    assigned: "2 days ago",
  },
  {
    id: 2,
    title: "Update server rules documentation",
    description: "Add the new PvP rules to the server documentation and publish to the website.",
    status: "completed",
    priority: "medium",
    due: "Yesterday",
    assigned: "3 days ago",
  },
  {
    id: 3,
    title: "Moderate chat during event",
    description: "Be present during the building competition to enforce rules and help participants.",
    status: "pending",
    priority: "high",
    due: "Tomorrow, 7:00 PM",
    assigned: "1 day ago",
  },
  {
    id: 4,
    title: "Investigate grief report",
    description: "Check the reported grief in the survival world at coordinates x:245 y:64 z:-189.",
    status: "pending",
    priority: "medium",
    due: "March 12, 2023",
    assigned: "5 hours ago",
  },
  {
    id: 5,
    title: "Create welcome message template",
    description:
      "Draft a standard welcome message for new members that includes server rules and getting started info.",
    status: "completed",
    priority: "low",
    due: "March 5, 2023",
    assigned: "1 week ago",
  },
]

export default function TasksContent({ user }: { user: any }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tasks</h2>
        <Button>
          <Icons.check className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <Button variant="outline" className="bg-black/20">
          All Tasks
        </Button>
        <Button variant="ghost">Pending</Button>
        <Button variant="ghost">Completed</Button>
      </div>

      <Card className="bg-black/40 backdrop-blur-xl border-gray-800 overflow-hidden">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <div className="flex gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search tasks..."
                className="pl-8 pr-4 py-2 rounded-lg bg-black/20 border border-gray-800 text-sm w-64"
              />
              <Icons.check className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>

            <select className="px-4 py-2 rounded-lg bg-black/20 border border-gray-800 text-sm">
              <option>All Priorities</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>

          <div>
            <Button variant="ghost" size="icon">
              <Icons.check className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="divide-y divide-gray-800">
          {tasks.map((task) => (
            <div key={task.id} className="p-4 hover:bg-black/20 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-1 h-5 w-5 rounded-full flex items-center justify-center ${
                      task.status === "completed"
                        ? "bg-green-500/20 text-green-500"
                        : "bg-yellow-500/20 text-yellow-500"
                    }`}
                  >
                    {task.status === "completed" ? (
                      <Icons.checkCheck className="h-3 w-3" />
                    ) : (
                      <Icons.clock className="h-3 w-3" />
                    )}
                  </div>

                  <div>
                    <h3
                      className={`font-medium ${
                        task.status === "completed" ? "line-through text-muted-foreground" : ""
                      }`}
                    >
                      {task.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          task.priority === "high"
                            ? "bg-red-500/20 text-red-500"
                            : task.priority === "medium"
                              ? "bg-yellow-500/20 text-yellow-500"
                              : "bg-blue-500/20 text-blue-500"
                        }`}
                      >
                        {task.priority}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">Due: {task.due}</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-500/20 text-gray-400">
                        Assigned: {task.assigned}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {task.status !== "completed" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 text-green-500 hover:text-green-400 hover:bg-green-500/10"
                    >
                      <Icons.checkCheck className="h-4 w-4" />
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" className="h-8">
                    <Icons.check className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}


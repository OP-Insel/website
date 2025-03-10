import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface TaskListProps {
  limit?: number
}

export function TaskList({ limit }: TaskListProps) {
  // Beispiel-Aufgaben
  const tasks = [
    {
      id: 1,
      title: "Server-Regeln aktualisieren",
      description: "Die Regeln für den Server überarbeiten und aktualisieren",
      type: "main",
      status: "in-progress",
      assignee: {
        name: "Steve",
        avatar: "https://mc-heads.net/avatar/MHF_Steve",
      },
      dueDate: "2023-06-15",
    },
    {
      id: 2,
      title: "Neue Spieler willkommen heißen",
      description: "Neue Spieler begrüßen und ihnen die Regeln erklären",
      type: "side",
      status: "todo",
      assignee: {
        name: "Steve",
        avatar: "https://mc-heads.net/avatar/MHF_Steve",
      },
      dueDate: "2023-06-18",
    },
    {
      id: 3,
      title: "Spawn-Bereich gestalten",
      description: "Den Spawn-Bereich neu gestalten und dekorieren",
      type: "main",
      status: "todo",
      assignee: {
        name: "Steve",
        avatar: "https://mc-heads.net/avatar/MHF_Steve",
      },
      dueDate: "2023-06-20",
    },
    {
      id: 4,
      title: "Event planen",
      description: "Ein Sommer-Event für den Server planen",
      type: "side",
      status: "todo",
      assignee: {
        name: "Steve",
        avatar: "https://mc-heads.net/avatar/MHF_Steve",
      },
      dueDate: "2023-06-25",
    },
  ]

  const displayTasks = limit ? tasks.slice(0, limit) : tasks

  return (
    <div className="space-y-4">
      {displayTasks.map((task) => (
        <div key={task.id} className="flex items-start gap-4 rounded-lg border border-gray-800 p-4">
          <Checkbox id={`task-${task.id}`} />
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <label
                htmlFor={`task-${task.id}`}
                className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {task.title}
              </label>
              <Badge variant={task.type === "main" ? "default" : "secondary"} className="ml-auto">
                {task.type === "main" ? "Haupt-Quest" : "Neben-Quest"}
              </Badge>
            </div>
            <p className="text-sm text-gray-400">{task.description}</p>
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                  <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-xs text-gray-400">{task.assignee.name}</span>
              </div>
              <span className="text-xs text-gray-400">
                Fällig: {new Date(task.dueDate).toLocaleDateString("de-DE")}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}


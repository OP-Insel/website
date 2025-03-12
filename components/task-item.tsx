"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertCircle, Clock, CheckCircle2, MoreHorizontal, Edit, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Task {
  id: number
  title: string
  progress: number
  priority: "high" | "medium" | "low"
  assignee: string | null
}

interface TaskItemProps {
  task: Task
}

export function TaskItem({ task }: TaskItemProps) {
  const [expanded, setExpanded] = useState(false)

  const priorityColor = {
    high: "text-destructive",
    medium: "text-amber-500",
    low: "text-green-500",
  }

  const priorityIcon = {
    high: <AlertCircle className={`h-4 w-4 ${priorityColor.high}`} />,
    medium: <Clock className={`h-4 w-4 ${priorityColor.medium}`} />,
    low: <CheckCircle2 className={`h-4 w-4 ${priorityColor.low}`} />,
  }

  // Mock checklist items
  const checklistItems = [
    { id: 1, text: "Anforderungen sammeln", checked: true },
    { id: 2, text: "Team informieren", checked: task.progress > 30 },
    { id: 3, text: "Ressourcen vorbereiten", checked: task.progress > 60 },
    { id: 4, text: "Durchführung", checked: task.progress === 100 },
    { id: 5, text: "Abnahme", checked: task.progress === 100 },
  ]

  return (
    <Card className="border border-border hover:border-primary/50 transition-all">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{task.title}</CardTitle>
          <div className="flex items-center gap-2">
            {task.assignee && (
              <Avatar className="h-6 w-6">
                <AvatarImage src={`/placeholder.svg?height=24&width=24`} alt={task.assignee} />
                <AvatarFallback>{task.assignee[0]}</AvatarFallback>
              </Avatar>
            )}
            <Badge variant="outline" className={`flex items-center gap-1 ${priorityColor[task.priority]}`}>
              {priorityIcon[task.priority]}
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Aktionen</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2">
                  <Edit className="h-4 w-4" />
                  <span>Bearbeiten</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 text-destructive">
                  <Trash2 className="h-4 w-4" />
                  <span>Löschen</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Fortschritt</span>
              <span>{task.progress}%</span>
            </div>
            <Progress value={task.progress} className="h-2" />
          </div>

          {expanded && (
            <div className="space-y-2 pt-2 animate-slideIn">
              <h4 className="font-medium text-sm">Checkliste:</h4>
              <div className="space-y-2">
                {checklistItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-2">
                    <Checkbox id={`item-${item.id}`} checked={item.checked} />
                    <label
                      htmlFor={`item-${item.id}`}
                      className={`text-sm ${item.checked ? "line-through text-muted-foreground" : ""}`}
                    >
                      {item.text}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)} className="ml-auto text-xs">
          {expanded ? "Weniger anzeigen" : "Mehr anzeigen"}
        </Button>
      </CardFooter>
    </Card>
  )
}


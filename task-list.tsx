"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from 'lucide-react';

// Mock data for tasks
const mockTasks = [
  {
    id: "task-1",
    title: "Update server plugins",
    assignee: {
      name: "Alex",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "AJ",
    },
    status: "in-progress",
    priority: "high",
    progress: 75,
    dueDate: "2025-03-15",
  },
  {
    id: "task-2",
    title: "Create new spawn area",
    assignee: {
      name: "Sam",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "SL",
    },
    status: "todo",
    priority: "medium",
    progress: 0,
    dueDate: "2025-03-20",
  },
  {
    id: "task-3",
    title: "Fix world border issues",
    assignee: {
      name: "Jordan",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "JK",
    },
    status: "completed",
    priority: "low",
    progress: 100,
    dueDate: "2025-03-12",
  },
  {
    id: "task-4",
    title: "Design new game mode",
    assignee: {
      name: "Taylor",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "TS",
    },
    status: "in-progress",
    priority: "high",
    progress: 40,
    dueDate: "2025-03-25",
  },
  {
    id: "task-5",
    title: "Update server rules",
    assignee: {
      name: "Morgan",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "MP",
    },
    status: "in-review",
    priority: "medium",
    progress: 90,
    dueDate: "2025-03-14",
  },
  {
    id: "task-6",
    title: "Create event announcement",
    assignee: {
      name: "Riley",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "RB",
    },
    status: "todo",
    priority: "high",
    progress: 0,
    dueDate: "2025-03-18",
  },
  {
    id: "task-7",
    title: "Backup server data",
    assignee: {
      name: "Casey",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "CD",
    },
    status: "completed",
    priority: "high",
    progress: 100,
    dueDate: "2025-03-10",
  },
];

const statusColors = {
  "todo": "bg-slate-500",
  "in-progress": "bg-blue-500",
  "in-review": "bg-amber-500",
  "completed": "bg-green-500",
};

const priorityColors = {
  "low": "bg-slate-400",
  "medium": "bg-blue-400",
  "high": "bg-red-500",
};

export function TaskList({ limit }: { limit?: number }) {
  const [tasks, setTasks] = useState(mockTasks);
  const displayTasks = limit ? tasks.slice(0, limit) : tasks;

  const toggleTaskStatus = (taskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const newStatus = task.status === "completed" ? "in-progress" : "completed";
        const newProgress = newStatus === "completed" ? 100 : 75;
        return { ...task, status: newStatus, progress: newProgress };
      }
      return task;
    }));
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <div className="grid grid-cols-12 gap-2 p-4 text-sm font-medium text-muted-foreground md:grid-cols-12">
          <div className="col-span-6 md:col-span-5">Task</div>
          <div className="col-span-2 hidden md:block">Assignee</div>
          <div className="col-span-2 hidden md:block">Status</div>
          <div className="col-span-2 hidden md:block">Priority</div>
          <div className="col-span-5 md:col-span-1">Progress</div>
        </div>
        <div className="divide-y">
          {displayTasks.map((task) => (
            <div
              key={task.id}
              className="grid grid-cols-12 items-center gap-2 p-4 text-sm md:grid-cols-12"
            >
              <div className="col-span-6 flex items-center gap-2 md:col-span-5">
                <Checkbox 
                  id={task.id} 
                  checked={task.status === "completed"}
                  onCheckedChange={() => toggleTaskStatus(task.id)}
                />
                <label
                  htmlFor={task.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {task.title}
                </label>
              </div>
              <div className="col-span-2 hidden md:block">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                    <AvatarFallback>{task.assignee.initials}</AvatarFallback>
                  </Avatar>
                  <span>{task.assignee.name}</span>
                </div>
              </div>
              <div className="col-span-2 hidden md:block">
                <Badge
                  variant="outline"
                  className="flex w-fit items-center gap-1 capitalize"
                >
                  <div className={`h-1.5 w-1.5 rounded-full ${statusColors[task.status as keyof typeof statusColors]}`} />
                  {task.status.replace("-", " ")}
                </Badge>
              </div>
              <div className="col-span-2 hidden md:block">
                <Badge
                  variant="outline"
                  className="flex w-fit items-center gap-1 capitalize"
                >
                  <div className={`h-1.5 w-1.5 rounded-full ${priorityColors[task.priority as keyof typeof priorityColors]}`} />
                  {task.priority}
                </Badge>
              </div>
              <div className="col-span-5 flex items-center gap-2 md:col-span-1">
                <Progress value={task.progress} className="h-2 w-full" />
                <span className="w-9 text-xs">{task.progress}%</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">More options</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Assign</DropdownMenuItem>
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </div>
      {limit && tasks.length > limit && (
        <Button variant="outline" className="w-full">
          View All Tasks
        </Button>
      )}
    </div>
  );
}

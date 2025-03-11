import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export function DashboardHeader() {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back to your Minecraft server management dashboard.</p>
      </div>
      <div className="flex gap-2">
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Task
        </Button>
        <Button variant="outline">
          <Plus className="mr-2 h-4 w-4" /> New Event
        </Button>
      </div>
    </div>
  )
}


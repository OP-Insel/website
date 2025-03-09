"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Icons } from "@/components/icons"

type View = "dashboard" | "profile" | "tasks" | "team" | "admin"

interface SidebarProps {
  user: any
  currentView: View
  onViewChange: (view: View) => void
  onLogout: () => void
}

export default function Sidebar({ user, currentView, onViewChange, onLogout }: SidebarProps) {
  return (
    <Card className="w-64 p-4 bg-black/40 backdrop-blur-xl border-gray-800 flex flex-col">
      <div className="flex items-center space-x-3 p-2 border-b border-gray-800">
        <img
          src={user.avatar || "/placeholder.svg"}
          alt={user.name}
          className="w-10 h-10 rounded-lg border border-primary/20"
        />
        <div>
          <h3 className="font-semibold truncate">{user.name}</h3>
          <span className="text-xs px-2 py-1 bg-primary/20 rounded-full text-primary">{user.role}</span>
        </div>
      </div>

      <nav className="flex-1 py-4 space-y-1">
        <Button
          variant={currentView === "dashboard" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => onViewChange("dashboard")}
        >
          <Icons.home className="mr-2 h-4 w-4" />
          Dashboard
        </Button>

        <Button
          variant={currentView === "profile" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => onViewChange("profile")}
        >
          <Icons.user className="mr-2 h-4 w-4" />
          Profile
        </Button>

        <Button
          variant={currentView === "tasks" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => onViewChange("tasks")}
        >
          <Icons.check className="mr-2 h-4 w-4" />
          Tasks
        </Button>

        <Button
          variant={currentView === "team" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => onViewChange("team")}
        >
          <Icons.users className="mr-2 h-4 w-4" />
          Team
        </Button>

        {user.role === "Admin" && (
          <Button
            variant={currentView === "admin" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => onViewChange("admin")}
          >
            <Icons.shield className="mr-2 h-4 w-4" />
            Admin
          </Button>
        )}
      </nav>

      <div className="pt-4 border-t border-gray-800">
        <div className="px-2 mb-2">
          <div className="flex justify-between text-sm text-muted-foreground mb-1">
            <span>Points</span>
            <span>{user.points}</span>
          </div>
          <div className="h-2 bg-primary/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-purple-500 transition-all duration-500"
              style={{ width: `${Math.min((user.points / 200) * 100, 100)}%` }}
            />
          </div>
        </div>

        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={onLogout}
        >
          <Icons.logOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </Card>
  )
}


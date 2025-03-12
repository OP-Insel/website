"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Home, CheckSquare, Award, BookOpen, LogOut, Server, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type User = {
  username: string
  role: string
  permissions: string[]
}

export function DashboardSidebar() {
  const router = useRouter()
  const { toast } = useToast()
  const [currentPath, setCurrentPath] = useState("")
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    setCurrentPath(window.location.pathname)

    // Get current user
    const userData = localStorage.getItem("currentUser")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    toast({
      title: "Erfolgreich abgemeldet",
      description: "Auf Wiedersehen!",
    })
    router.push("/")
  }

  const hasAdminAccess = user?.permissions?.includes("access_admin")

  return (
    <Sidebar className="border-r border-primary/10 bg-sidebar/95">
      <SidebarHeader className="border-b border-primary/10 p-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
            OP
          </div>
          <div className="font-bold text-lg">OP-Insel</div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={currentPath === "/dashboard"}
              onClick={() => router.push("/dashboard")}
            >
              <button>
                <Home />
                <span>Dashboard</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={currentPath === "/dashboard/tasks"}
              onClick={() => router.push("/dashboard/tasks")}
            >
              <button>
                <CheckSquare />
                <span>Aufgaben</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={currentPath === "/dashboard/points"}
              onClick={() => router.push("/dashboard/points")}
            >
              <button>
                <Award />
                <span>Punktesystem</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={currentPath === "/dashboard/stories"}
              onClick={() => router.push("/dashboard/stories")}
            >
              <button>
                <BookOpen />
                <span>Story-Planer</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={currentPath === "/dashboard/server-status"}
              onClick={() => router.push("/dashboard/server-status")}
            >
              <button>
                <Server />
                <span>Server-Status</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {hasAdminAccess && (
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={currentPath === "/dashboard/admin"}
                onClick={() => router.push("/dashboard/admin")}
              >
                <button>
                  <Shield />
                  <span>Owner-Dashboard</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Abmelden
        </Button>
      </SidebarFooter>
      <SidebarTrigger className="absolute right-4 top-4 md:hidden" />
    </Sidebar>
  )
}


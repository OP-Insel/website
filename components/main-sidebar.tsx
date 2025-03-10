"use client"

import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { LayoutDashboard, CheckSquare, CalendarDays, Users, Shield, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function MainSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-center p-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src="/placeholder.svg" alt="User" />
            <AvatarFallback>OP</AvatarFallback>
          </Avatar>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild active={pathname === "/dashboard"}>
              <a href="/dashboard">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild active={pathname === "/tasks"}>
              <a href="/tasks">
                <CheckSquare className="mr-2 h-4 w-4" />
                <span>Tasks</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild active={pathname === "/calendar"}>
              <a href="/calendar">
                <CalendarDays className="mr-2 h-4 w-4" />
                <span>Calendar</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild active={pathname === "/team"}>
              <a href="/team">
                <Users className="mr-2 h-4 w-4" />
                <span>Team</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild active={pathname === "/points"}>
              <a href="/points">
                <Shield className="mr-2 h-4 w-4" />
                <span>Points</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex flex-col gap-2 p-4">
          <Button variant="ghost" className="w-full justify-start" asChild>
            <a href="/settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </a>
          </Button>
          <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}


"use client"

import { Calendar, CheckSquare, Home, LogOut, Settings, Users } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { UserNav } from "@/components/user-nav"
import { Button } from "@/components/ui/button"

export function AppSidebar() {
  const pathname = usePathname()
  const { logout, hasPermission } = useAuth()

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <h1 className="text-xl font-bold">MC Server Manager</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {hasPermission("view_dashboard") && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/dashboard"}>
                <Link href="/dashboard">
                  <Home className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          {hasPermission("manage_events") && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/calendar"}>
                <Link href="/calendar">
                  <Calendar className="h-5 w-5" />
                  <span>Calendar</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          {hasPermission("manage_tasks") && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/tasks"}>
                <Link href="/tasks">
                  <CheckSquare className="h-5 w-5" />
                  <span>Tasks</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          {hasPermission("manage_users") && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/users"}>
                <Link href="/users">
                  <Users className="h-5 w-5" />
                  <span>Users</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/settings"}>
              <Link href="/settings">
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 space-y-4">
        <UserNav />
        <Button variant="outline" className="w-full flex items-center gap-2" onClick={logout}>
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}


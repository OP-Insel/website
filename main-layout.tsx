"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { Moon, Sun, Users, BookOpen, MessageSquare, LogOut, Bell, Shield, Home, Settings, UserIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { getCurrentUser, saveCurrentUser } from "@/lib/storage"
import { getUserPermissions } from "@/lib/permissions"
import type { User } from "@/lib/types"
import {
  Sidebar,
  SidebarProvider,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarTrigger,
  SidebarRail,
} from "@/components/ui/sidebar"

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [pendingRequests, setPendingRequests] = useState(0)
  const router = useRouter()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setIsMounted(true)

    // Check if user is logged in
    const user = getCurrentUser()
    if (!user) {
      router.push("/")
    } else {
      setCurrentUser(user)

      // For demo purposes, set some pending requests for owners and co-owners
      if (user.rank === "Owner" || user.rank === "Co-Owner") {
        setPendingRequests(3)
      }
    }
  }, [router])

  const handleLogout = () => {
    saveCurrentUser(null)
    router.push("/")
  }

  if (!isMounted || !currentUser) {
    return null
  }

  const userPermissions = getUserPermissions(currentUser.rank)

  return (
    <SidebarProvider>
      <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
        <Sidebar
          variant="inset"
          collapsible="icon"
          className="border-r border-gray-200 dark:border-gray-800 transition-all"
        >
          <SidebarHeader className="flex flex-col items-center justify-center py-6 animate-fade-in">
            <div className="relative w-12 h-12 rounded-full overflow-hidden mb-2 border-2 border-gray-200 dark:border-gray-700 transition-colors">
              <Image
                src={currentUser.avatar || `/placeholder.svg?height=48&width=48`}
                alt="Logo"
                fill
                className="object-cover"
              />
            </div>
            <div className="text-center">
              <h3 className="font-bold">{currentUser.name}</h3>
              <p className="text-xs text-muted-foreground">{currentUser.rank}</p>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-gray-500 dark:text-gray-400 transition-colors">
                Navigation
              </SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem className="transition-transform hover:translate-x-1">
                  <SidebarMenuButton asChild isActive={pathname === "/dashboard"} className="transition-colors">
                    <Link href="/dashboard">
                      <Home className="h-5 w-5" />
                      <span>Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem className="transition-transform hover:translate-x-1">
                  <SidebarMenuButton asChild isActive={pathname === "/dashboard/team"} className="transition-colors">
                    <Link href="/dashboard/team">
                      <Users className="h-5 w-5" />
                      <span>Team Management</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {userPermissions.canApproveDeduction && (
                  <SidebarMenuItem className="transition-transform hover:translate-x-1">
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === "/dashboard/requests"}
                      className="transition-colors"
                    >
                      <Link href="/dashboard/requests">
                        <Shield className="h-5 w-5" />
                        <span>Point Requests</span>
                      </Link>
                    </SidebarMenuButton>
                    {pendingRequests > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute right-2 top-1/2 -translate-y-1/2 animate-pulse-subtle"
                      >
                        {pendingRequests}
                      </Badge>
                    )}
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="text-gray-500 dark:text-gray-400 transition-colors">
                Story System
              </SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem className="transition-transform hover:translate-x-1">
                  <SidebarMenuButton asChild isActive={pathname === "/story"} className="transition-colors">
                    <Link href="/story">
                      <BookOpen className="h-5 w-5" />
                      <span>Story Management</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem className="transition-transform hover:translate-x-1">
                  <SidebarMenuButton asChild isActive={pathname === "/story/chat"} className="transition-colors">
                    <Link href="/story/chat">
                      <MessageSquare className="h-5 w-5" />
                      <span>Story Chat</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-4 border-t border-gray-200 dark:border-gray-800 transition-colors">
            <div className="flex items-center justify-between">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full transition-colors">
                    <UserIcon className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="animate-scale">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="transition-colors">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="transition-colors">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="transition-colors">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full transition-colors"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full relative transition-colors">
                    <Bell className="h-5 w-5" />
                    {pendingRequests > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white animate-pulse-subtle">
                        {pendingRequests}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="animate-scale">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {pendingRequests > 0 ? (
                    <>
                      <DropdownMenuItem className="transition-colors">
                        <div className="flex flex-col">
                          <span className="font-medium">Point Deduction Request</span>
                          <span className="text-xs text-muted-foreground">
                            AlexMC requested to deduct 10 points from SamBuilds
                          </span>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="transition-colors">
                        <div className="flex flex-col">
                          <span className="font-medium">Point Deduction Request</span>
                          <span className="text-xs text-muted-foreground">
                            ChrisSupport requested to deduct 5 points from EmilyDev
                          </span>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="transition-colors">
                        <div className="flex flex-col">
                          <span className="font-medium">New Story Chapter</span>
                          <span className="text-xs text-muted-foreground">
                            A new chapter has been added to the main story
                          </span>
                        </div>
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <div className="px-2 py-4 text-center text-sm text-muted-foreground">No new notifications</div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </SidebarFooter>

          <SidebarRail />
        </Sidebar>

        <main className="flex-1 overflow-y-auto">
          <div className="flex items-center justify-between p-4 md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors">
            <SidebarTrigger />
            <h1 className="text-xl font-bold">MC Team Portal</h1>
            <Avatar className="h-8 w-8 transition-transform hover:scale-110">
              <AvatarImage src={currentUser.avatar || `/placeholder.svg?height=32&width=32`} alt={currentUser.name} />
              <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
            </Avatar>
          </div>

          <div className="animate-fade-in">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  )
}


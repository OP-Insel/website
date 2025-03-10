"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Crown, CalendarDays, CheckSquare, Shield, Users } from "lucide-react"

export function MainNav() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <SidebarTrigger />

        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Crown className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">OP Insel</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/dashboard"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === "/dashboard" ? "text-foreground" : "text-foreground/60",
              )}
            >
              Dashboard
            </Link>
            <Link
              href="/tasks"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname?.startsWith("/tasks") ? "text-foreground" : "text-foreground/60",
              )}
            >
              Tasks
            </Link>
            <Link
              href="/calendar"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname?.startsWith("/calendar") ? "text-foreground" : "text-foreground/60",
              )}
            >
              Calendar
            </Link>
            <Link
              href="/team"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname?.startsWith("/team") ? "text-foreground" : "text-foreground/60",
              )}
            >
              Team
            </Link>
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">{/* Add search here if needed */}</div>
          <nav className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-2" asChild>
              <Link href="/tasks">
                <CheckSquare className="h-5 w-5" />
                <span className="sr-only">Tasks</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="mr-2" asChild>
              <Link href="/calendar">
                <CalendarDays className="h-5 w-5" />
                <span className="sr-only">Calendar</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="mr-2" asChild>
              <Link href="/team">
                <Users className="h-5 w-5" />
                <span className="sr-only">Team</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/points">
                <Shield className="h-5 w-5" />
                <span className="sr-only">Points</span>
              </Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}


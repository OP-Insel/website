"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Settings, LogOut } from "lucide-react"
import { signOut } from "next-auth/react"

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="grid items-start gap-2 p-4">
      <Link href="/dashboard">
        <Button variant={pathname === "/dashboard" ? "default" : "ghost"} className={cn("w-full justify-start")}>
          <LayoutDashboard className="mr-2 h-4 w-4" />
          Dashboard
        </Button>
      </Link>
      <Link href="/dashboard/settings">
        <Button
          variant={pathname === "/dashboard/settings" ? "default" : "ghost"}
          className={cn("w-full justify-start")}
        >
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </Link>
      <Button
        variant="ghost"
        className="w-full justify-start text-red-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
        onClick={() => signOut({ callbackUrl: "/" })}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Button>
    </nav>
  )
}


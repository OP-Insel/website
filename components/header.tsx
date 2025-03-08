"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useStore } from "@/lib/store"
import { formatDistanceToNow } from "date-fns"
import { de } from "date-fns/locale"

export default function Header() {
  const { currentUser, logout, updateLastActive } = useStore()
  const [showTooltip, setShowTooltip] = useState(false)

  const handleLogout = () => {
    logout()
  }

  const handleAvatarClick = () => {
    updateLastActive(currentUser!.id)
    setShowTooltip(true)
    setTimeout(() => setShowTooltip(false), 2000)
  }

  const lastActiveText = currentUser
    ? formatDistanceToNow(new Date(currentUser.lastActive), { addSuffix: true, locale: de })
    : ""

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 bg-contain bg-no-repeat"
            style={{ backgroundImage: "url(/placeholder.svg?height=32&width=32)" }}
          />
          <h1 className="text-xl font-bold">Minecraft Team Manager</h1>
        </div>

        {currentUser && (
          <div className="relative flex items-center gap-4">
            <span className="hidden md:inline text-sm text-muted-foreground">
              Eingeloggt als <span className="font-medium text-foreground">{currentUser.username}</span>
            </span>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <div
                    className="h-8 w-8 rounded-full bg-contain bg-center bg-no-repeat cursor-pointer"
                    style={{ backgroundImage: `url(https://mc-heads.net/avatar/${currentUser.username})` }}
                    onClick={handleAvatarClick}
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Mein Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex justify-between">
                  <span>Rang</span>
                  <span className="font-medium">{currentUser.rank}</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex justify-between">
                  <span>Punkte</span>
                  <span className="font-medium">{currentUser.points}</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex justify-between">
                  <span>Letzte Aktivität</span>
                  <span className="font-medium">{lastActiveText}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Abmelden</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {showTooltip && (
              <div className="absolute right-0 top-10 z-50 bg-primary text-primary-foreground text-sm rounded-md px-3 py-1.5 shadow-md">
                Aktivität aktualisiert!
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}


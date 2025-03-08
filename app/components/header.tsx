"use client"

import { Button } from "@/components/ui/button"
import { ModeToggle } from "./mode-toggle"
import { LanguageToggle } from "./language-toggle"
import { LogOut, Server, User } from "lucide-react"
import { useLanguage } from "../hooks/use-language"
import { translations } from "../data/translations"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header({ serverName, serverIp, currentUser, onLogout }) {
  const { language } = useLanguage()
  const t = translations[language]

  return (
    <header className="sticky top-0 z-10 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Server className="h-6 w-6 text-primary" />
          <div>
            <span className="text-xl font-bold">{serverName}</span>
            <p className="text-xs text-zinc-400">{serverIp}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <LanguageToggle />
          <ModeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <User className="h-4 w-4" />
                {currentUser?.username}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>{t.userProfile}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>{currentUser?.username}</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Server className="mr-2 h-4 w-4" />
                <span>{currentUser?.rank}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>{t.logout}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}


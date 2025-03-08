"use client"

import { Button } from "@/components/ui/button"
import { ModeToggle } from "../mode-toggle"
import { LanguageToggle } from "../language-toggle"
import { Github, LogOut } from "lucide-react"
import { useTranslation } from "../../hooks/use-translation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Header({ serverName = "Minecraft Team Manager", serverIp = "", currentUser, onLogout }) {
  const { t } = useTranslation()

  return (
    <header className="sticky top-0 z-10 w-full border-b border-zinc-800 bg-black/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Github className="h-6 w-6" />
          <span className="text-xl font-bold">{serverName}</span>
          {serverIp && <span className="hidden md:block text-sm bg-zinc-800 px-2 py-1 rounded ml-2">{serverIp}</span>}
        </div>

        <div className="flex items-center gap-2">
          {currentUser && (
            <div className="flex items-center mr-2">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={`https://mc-heads.net/avatar/${currentUser.minecraftUsername}`} />
                <AvatarFallback>{currentUser.username.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="font-medium text-sm hidden md:inline-block">{currentUser.username}</span>
            </div>
          )}
          <LanguageToggle />
          <ModeToggle />
          <Button variant="outline" size="sm" className="hidden md:flex">
            {t("header.documentation")}
          </Button>
          {onLogout && (
            <Button size="sm" variant="ghost" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              {t("header.logout")}
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}


"use client"

import { Button } from "@/components/ui/button"
import { ModeToggle } from "./mode-toggle"
import { Github } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-10 w-full border-b border-zinc-800 bg-black/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Github className="h-6 w-6" />
          <span className="text-xl font-bold">Minecraft Team Manager</span>
        </div>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button variant="outline" size="sm">
            Documentation
          </Button>
          <Button size="sm">Login</Button>
        </div>
      </div>
    </header>
  )
}


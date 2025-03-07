"use client"

import { Button } from "@/components/ui/button"
import { useUserStore } from "@/lib/store"
import { LogIn, LogOut, User } from 'lucide-react'
import { LoginDialog } from "@/components/login-dialog"
import { useState } from "react"

export function Header() {
  const { currentUser, logout } = useUserStore()
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  
  return (
    <header className="flex items-center justify-between py-4 border-b border-zinc-800">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">MC Team Manager</h1>
      </div>
      
      <div className="flex items-center gap-4">
        {currentUser ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded overflow-hidden">
                <div 
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(https://mc-heads.net/avatar/${currentUser.minecraftName}/64)` }}
                />
              </div>
              <div>
                <p className="font-medium">{currentUser.name}</p>
                <p className="text-xs text-zinc-400">{currentUser.rank}</p>
              </div>
            </div>
            <Button variant="destructive" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        ) : (
          <Button variant="outline" onClick={() => setShowLoginDialog(true)}>
            <LogIn className="w-4 h-4 mr-2" />
            Login
          </Button>
        )}
      </div>
      
      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
    </header>
  )
}

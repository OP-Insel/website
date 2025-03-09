"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Icons } from "@/components/icons"

export default function LoginView({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <Card className="w-full max-w-md p-8 bg-black/40 backdrop-blur-xl border-gray-800">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <img
              src="/minecraft-avatar.png"
              alt="OP-Insel Logo"
              className="w-24 h-24 mx-auto rounded-lg border-2 border-primary/20 shadow-xl hover:scale-105 transition-transform duration-200"
            />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              OP-Insel Management
            </h1>
            <p className="text-muted-foreground">Minecraft Server Team Management System</p>
          </div>

          <Button onClick={onLogin} className="w-full bg-[#5865F2] hover:bg-[#4752C4] transition-colors duration-200">
            <Icons.discord className="mr-2 h-5 w-5" />
            Login with Discord
          </Button>

          <p className="text-sm text-muted-foreground">You must connect your Discord account to access the system</p>
        </div>
      </Card>
    </div>
  )
}


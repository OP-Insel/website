"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

type User = {
  username: string
  role: string
  points: number
}

export function TeamPoints({ className }: { className?: string }) {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    const storedUsers = localStorage.getItem("users")
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers))
    }
  }, [])

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Team-Punkte</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users
            .filter((user) => user.role !== "pending")
            .sort((a, b) => b.points - a.points)
            .slice(0, 5)
            .map((user) => (
              <div key={user.username} className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`https://mc-heads.net/avatar/${user.username}`} alt={user.username} />
                  <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{user.username}</p>
                    <p className="text-sm font-medium">{user.points}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  )
}


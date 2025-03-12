"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type User = {
  username: string
  role: string
  points: number
}

export function UserGreeting() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  if (!user) return null

  return (
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarImage src={`https://mc-heads.net/avatar/${user.username}`} alt={user.username} />
        <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div>
        <p className="font-medium">Hallo, {user.username}!</p>
        <p className="text-sm text-muted-foreground">
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)} • {user.points} Punkte
        </p>
      </div>
    </div>
  )
}


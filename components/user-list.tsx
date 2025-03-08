"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { useStore } from "@/lib/store"
import UserCard from "./user-card"

export default function UserList() {
  const { users } = useStore()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredUsers = users.filter((user) => user.username.toLowerCase().includes(searchQuery.toLowerCase()))

  // Sort users by rank and then by points
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const rankOrder = {
      Owner: 6,
      "Co-Owner": 5,
      Admin: 4,
      Moderator: 3,
      Trusted: 2,
      Mitglied: 1,
    }

    const rankDiff =
      (rankOrder[b.rank as keyof typeof rankOrder] || 0) - (rankOrder[a.rank as keyof typeof rankOrder] || 0)

    if (rankDiff !== 0) return rankDiff
    return b.points - a.points
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Team Mitglieder</h2>
        <div className="w-full max-w-xs">
          <Input
            placeholder="Suche nach Benutzern..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {sortedUsers.length === 0 ? (
        <p className="text-muted-foreground italic">Keine Benutzer gefunden</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedUsers.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      )}
    </div>
  )
}


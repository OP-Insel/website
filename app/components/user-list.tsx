"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"

export function UserList({ users, onUserSelect }) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.rank.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getRankColor = (rank) => {
    switch (rank) {
      case "Owner":
        return "bg-red-500 hover:bg-red-600"
      case "Co-Owner":
        return "bg-orange-500 hover:bg-orange-600"
      case "Admin":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "Jr. Admin":
        return "bg-lime-500 hover:bg-lime-600"
      case "Moderator":
        return "bg-green-500 hover:bg-green-600"
      case "Jr. Moderator":
        return "bg-teal-500 hover:bg-teal-600"
      case "Supporter":
        return "bg-blue-500 hover:bg-blue-600"
      case "Jr. Supporter":
        return "bg-indigo-500 hover:bg-indigo-600"
      case "Removed":
        return "bg-gray-500 hover:bg-gray-600"
      default:
        return "bg-purple-500 hover:bg-purple-600"
    }
  }

  const getPointsEmoji = (points, rank) => {
    if (rank === "Removed") return "❌"

    // Get threshold for current rank
    let threshold = 0
    switch (rank) {
      case "Co-Owner":
        threshold = 500
        break
      case "Admin":
        threshold = 400
        break
      case "Jr. Admin":
        threshold = 300
        break
      case "Moderator":
        threshold = 250
        break
      case "Jr. Moderator":
        threshold = 200
        break
      case "Supporter":
        threshold = 150
        break
      case "Jr. Supporter":
        threshold = 0
        break
      default:
        threshold = 0
    }

    // Calculate how close to demotion
    const pointsAboveThreshold = points - threshold

    if (pointsAboveThreshold <= 10) return "😱" // Very close to demotion
    if (pointsAboveThreshold <= 30) return "😰" // Close to demotion
    if (pointsAboveThreshold <= 50) return "😟" // Getting close
    if (pointsAboveThreshold <= 100) return "😐" // Neutral
    return "😄" // Far from demotion
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-zinc-500" />
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8 bg-zinc-800 border-zinc-700"
        />
      </div>

      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-zinc-800 transition-colors"
              onClick={() => onUserSelect(user)}
            >
              <Avatar>
                <AvatarImage src={`https://mc-heads.net/avatar/${user.minecraftUsername}`} />
                <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium truncate">{user.username}</p>
                  <span title="Points status">{getPointsEmoji(user.points, user.rank)}</span>
                </div>
                <p className="text-sm text-zinc-400 truncate">
                  {user.minecraftUsername} • {user.points} pts
                </p>
              </div>
              <Badge className={`${getRankColor(user.rank)} ml-auto`}>{user.rank}</Badge>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-zinc-500">No users found</div>
        )}
      </div>
    </div>
  )
}


"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { getPointsEmoji, getRankColor } from "@/lib/utils"
import { User } from "@/lib/types"

interface UserCardProps {
  user: User
  onClick: () => void
}

export function UserCard({ user, onClick }: UserCardProps) {
  const rankColor = getRankColor(user.rank)
  const emoji = getPointsEmoji(user.points, user.rank)
  
  // Calculate progress to next rank or degradation
  const degradationThreshold = getDegradationThreshold(user.rank)
  const progress = degradationThreshold ? (user.points / degradationThreshold) * 100 : 100
  
  return (
    <Card 
      className="overflow-hidden bg-zinc-800 border-zinc-700 hover:border  * 100 : 100
  
  return (
    <Card 
      className="overflow-hidden bg-zinc-800 border-zinc-700 hover:border-zinc-600 cursor-pointer transition-all"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="flex items-center gap-4 p-4">
          <div className="w-16 h-16 rounded overflow-hidden relative">
            <div 
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(https://mc-heads.net/avatar/${user.minecraftName}/128)` }}
            />
          </div>
          <div>
            <h3 className="font-bold text-lg">{user.name}</h3>
            <p className="text-sm text-zinc-400">{user.minecraftName}</p>
            <Badge className={`mt-1 ${rankColor}`}>{user.rank}</Badge>
          </div>
          <div className="ml-auto text-3xl" title={`${user.points} points`}>
            {emoji}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-0">
        <div className="w-full px-4 pb-4">
          <div className="flex justify-between text-xs mb-1">
            <span>{user.points} points</span>
            {degradationThreshold && <span>{degradationThreshold} needed</span>}
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardFooter>
    </Card>
  )
}

function getDegradationThreshold(rank: string): number | null {
  switch (rank) {
    case "Co-Owner": return 500
    case "Admin": return 400
    case "Jr. Admin": return 300
    case "Moderator": return 250
    case "Jr. Moderator": return 200
    case "Supporter": return 150
    case "Jr. Supporter": return 100
    default: return null
  }
}

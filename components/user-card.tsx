"use client"

import { Progress } from "@/components/ui/progress"
import type { User } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"
import { de } from "date-fns/locale"

interface UserCardProps {
  user: User
}

export default function UserCard({ user }: UserCardProps) {
  const lastActive = formatDistanceToNow(new Date(user.lastActive), {
    addSuffix: true,
    locale: de,
  })

  // Calculate progress to next rank
  const rankThresholds = {
    Mitglied: 0,
    Trusted: 100,
    Moderator: 300,
    Admin: 600,
    "Co-Owner": 1000,
    Owner: 1500,
  }

  const ranks = Object.keys(rankThresholds)
  const currentRankIndex = ranks.indexOf(user.rank)
  const nextRank = currentRankIndex < ranks.length - 1 ? ranks[currentRankIndex + 1] : null

  let progressPercent = 100
  let pointsToNextRank = 0

  if (nextRank) {
    const nextRankThreshold = rankThresholds[nextRank as keyof typeof rankThresholds]
    const currentRankThreshold = rankThresholds[user.rank as keyof typeof rankThresholds]
    const pointsNeeded = nextRankThreshold - currentRankThreshold
    pointsToNextRank = nextRankThreshold - user.points

    if (pointsToNextRank > 0) {
      progressPercent = Math.floor(((user.points - currentRankThreshold) / pointsNeeded) * 100)
    }
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: `url(https://mc-heads.net/avatar/${user.username})` }}
          />
          <div>
            <h3 className="font-bold text-lg">{user.username}</h3>
            <p className="text-sm text-muted-foreground">{user.rank}</p>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>Punkte: {user.points}</span>
            {nextRank && (
              <span>
                {pointsToNextRank} bis {nextRank}
              </span>
            )}
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        <div className="text-sm text-muted-foreground">Letzte Aktivität: {lastActive}</div>
      </div>
    </div>
  )
}


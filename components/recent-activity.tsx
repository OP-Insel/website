"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

type Activity = {
  id: number
  user: string
  action: string
  timestamp: number
}

export function RecentActivity({ className }: { className?: string }) {
  const [activities, setActivities] = useState<Activity[]>([])

  useEffect(() => {
    const storedActivities = localStorage.getItem("activities")
    if (storedActivities) {
      setActivities(JSON.parse(storedActivities))
    }
  }, [])

  // Format timestamp to relative time
  const formatRelativeTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp

    if (diff < 60000) return "gerade eben"
    if (diff < 3600000) return `vor ${Math.floor(diff / 60000)} Min.`
    if (diff < 86400000) return `vor ${Math.floor(diff / 3600000)} Std.`
    return `vor ${Math.floor(diff / 86400000)} Tagen`
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Letzte Aktivitäten</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-center text-muted-foreground py-2">Keine Aktivitäten vorhanden</p>
          ) : (
            activities
              .sort((a, b) => b.timestamp - a.timestamp)
              .slice(0, 5)
              .map((activity) => (
                <div key={activity.id} className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://mc-heads.net/avatar/${activity.user}`} alt={activity.user} />
                    <AvatarFallback>{activity.user.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground">{formatRelativeTime(activity.timestamp)}</p>
                  </div>
                </div>
              ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}


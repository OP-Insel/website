import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function UserActivity() {
  const activities = [
    {
      id: 1,
      user: {
        name: "Steve",
        avatar: "https://mc-heads.net/avatar/MHF_Steve",
        role: "Owner",
      },
      action: "completed task",
      target: "Update server plugins",
      time: "2 hours ago",
      active: true,
    },
    {
      id: 2,
      user: {
        name: "Alex",
        avatar: "https://mc-heads.net/avatar/MHF_Alex",
        role: "Admin",
      },
      action: "created event",
      target: "Community Event",
      time: "5 hours ago",
      active: true,
    },
    {
      id: 3,
      user: {
        name: "Creeper",
        avatar: "https://mc-heads.net/avatar/MHF_Creeper",
        role: "Moderator",
      },
      action: "assigned task",
      target: "Fix permissions system",
      time: "1 day ago",
      active: false,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-4">
              <Avatar className="h-9 w-9">
                <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                <AvatarFallback>{activity.user.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium leading-none">{activity.user.name}</p>
                  <Badge variant="outline" className="text-xs">
                    {activity.user.role}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {activity.action} <span className="font-medium">{activity.target}</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">{activity.time}</p>
                <div className={`h-2 w-2 rounded-full ${activity.active ? "bg-green-500" : "bg-gray-500"}`} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}


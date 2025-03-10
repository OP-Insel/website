import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function RecentActivity() {
  const activities = [
    {
      id: 1,
      user: {
        name: "Owner",
        email: "owner@example.com",
      },
      action: "Logged in",
      timestamp: "Just now",
    },
    {
      id: 2,
      user: {
        name: "System",
        email: "system@example.com",
      },
      action: "Created owner account",
      timestamp: "Today",
    },
  ]

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{activity.user.name}</p>
            <p className="text-sm text-muted-foreground">{activity.action}</p>
          </div>
          <div className="ml-auto text-sm text-muted-foreground">{activity.timestamp}</div>
        </div>
      ))}
    </div>
  )
}


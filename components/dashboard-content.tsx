import { Card } from "@/components/ui/card"
import { Icons } from "@/components/icons"

const stats = [
  {
    icon: Icons.check,
    title: "Tasks",
    value: "5 Assigned",
    trend: "+2 this week",
    trendUp: true,
  },
  {
    icon: Icons.checkCheck,
    title: "Completed",
    value: "12 Tasks",
    trend: "85% success rate",
    trendUp: true,
  },
  {
    icon: Icons.alertTriangle,
    title: "Infractions",
    value: "2 Points",
    trend: "-1 this month",
    trendUp: false,
  },
  {
    icon: Icons.star,
    title: "Rank Progress",
    value: "75%",
    trend: "Next: Senior Mod",
    trendUp: true,
  },
]

const recentTasks = [
  {
    title: "Review new member applications",
    status: "pending",
    due: "2h remaining",
  },
  {
    title: "Update server rules documentation",
    status: "completed",
    due: "Completed 1h ago",
  },
  {
    title: "Moderate chat during event",
    status: "pending",
    due: "Starts in 4h",
  },
]

const announcements = [
  {
    title: "New Server Event",
    content: "Join us this weekend for a special building competition!",
    date: "2h ago",
  },
  {
    title: "Staff Meeting Reminder",
    content: "Monthly staff meeting tomorrow at 8 PM GMT",
    date: "5h ago",
  },
]

export default function DashboardContent({ user }: { user: any }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Welcome back, {user.name}!</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card
              key={index}
              className="p-4 bg-black/40 backdrop-blur-xl border-gray-800 hover:bg-black/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                </div>
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <p className={`text-sm mt-2 flex items-center gap-1 ${stat.trendUp ? "text-green-500" : "text-red-500"}`}>
                {stat.trendUp ? <Icons.trendingUp className="h-4 w-4" /> : <Icons.trendingDown className="h-4 w-4" />}
                {stat.trend}
              </p>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-black/40 backdrop-blur-xl border-gray-800">
          <h3 className="text-lg font-semibold mb-4">Recent Tasks</h3>
          <div className="space-y-4">
            {recentTasks.map((task, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-black/20 hover:bg-black/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {task.status === "completed" ? (
                    <Icons.checkCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Icons.clock className="h-5 w-5 text-yellow-500" />
                  )}
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-muted-foreground">{task.due}</p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    task.status === "completed" ? "bg-green-500/20 text-green-500" : "bg-yellow-500/20 text-yellow-500"
                  }`}
                >
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-black/40 backdrop-blur-xl border-gray-800">
          <h3 className="text-lg font-semibold mb-4">Announcements</h3>
          <div className="space-y-4">
            {announcements.map((announcement, index) => (
              <div key={index} className="p-4 rounded-lg bg-black/20 hover:bg-black/30 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold">{announcement.title}</h4>
                  <span className="text-xs text-muted-foreground">{announcement.date}</span>
                </div>
                <p className="text-sm text-muted-foreground">{announcement.content}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}


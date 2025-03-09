import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export default function ProfileContent({ user }: { user: any }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Profile</h2>

      <Card className="p-6 bg-black/40 backdrop-blur-xl border-gray-800">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <div className="text-center md:text-left">
            <div className="relative inline-block">
              <img
                src={user.avatar || "/placeholder.svg"}
                alt={user.name}
                className="w-32 h-32 rounded-xl border-2 border-primary/20 shadow-xl"
              />
              <Button size="icon" className="absolute bottom-0 right-0 rounded-full h-8 w-8" variant="outline">
                <Icons.user className="h-4 w-4" />
              </Button>
            </div>
            <h3 className="text-xl font-bold mt-3">{user.name}</h3>
            <span className="text-sm px-3 py-1 bg-primary/20 rounded-full text-primary inline-block mt-2">
              {user.role}
            </span>
          </div>

          <div className="flex-1 space-y-6 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Discord Username</label>
                <div className="p-3 rounded-lg bg-black/20 font-medium">{user.name}#1234</div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Minecraft Username</label>
                <div className="p-3 rounded-lg bg-black/20 font-medium">{user.name}</div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Joined Date</label>
                <div className="p-3 rounded-lg bg-black/20 font-medium">March 15, 2023</div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Last Active</label>
                <div className="p-3 rounded-lg bg-black/20 font-medium">Today</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm text-muted-foreground">Points</label>
                <span className="text-sm font-medium">{user.points}/200</span>
              </div>
              <div className="h-2 bg-primary/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-purple-500 transition-all duration-500"
                  style={{ width: `${Math.min((user.points / 200) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">{200 - user.points} more points until next rank</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-black/40 backdrop-blur-xl border-gray-800">
          <h3 className="text-lg font-semibold mb-4">Activity History</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-black/20">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Icons.check className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">Completed task: Server maintenance</p>
                  <p className="text-sm text-muted-foreground">2 days ago</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-black/40 backdrop-blur-xl border-gray-800">
          <h3 className="text-lg font-semibold mb-4">Achievements</h3>
          <div className="space-y-4">
            {[
              { title: "First Week", desc: "Survived your first week as staff", icon: Icons.star },
              { title: "Task Master", desc: "Completed 10 tasks", icon: Icons.checkCheck },
              { title: "Team Player", desc: "Participated in 5 events", icon: Icons.users },
            ].map((achievement, index) => {
              const Icon = achievement.icon
              return (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-black/20">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">{achievement.title}</p>
                    <p className="text-sm text-muted-foreground">{achievement.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}


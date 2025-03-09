import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

const teamMembers = [
  {
    id: 1,
    name: "Alex",
    role: "Owner",
    avatar: "/placeholder.svg?height=80&width=80",
    points: 200,
    status: "online",
  },
  {
    id: 2,
    name: "Sam",
    role: "Admin",
    avatar: "/placeholder.svg?height=80&width=80",
    points: 180,
    status: "online",
  },
  {
    id: 3,
    name: "Jordan",
    role: "Moderator",
    avatar: "/placeholder.svg?height=80&width=80",
    points: 150,
    status: "away",
  },
  {
    id: 4,
    name: "Taylor",
    role: "Moderator",
    avatar: "/placeholder.svg?height=80&width=80",
    points: 145,
    status: "offline",
  },
  {
    id: 5,
    name: "Riley",
    role: "Jr-Moderator",
    avatar: "/placeholder.svg?height=80&width=80",
    points: 120,
    status: "online",
  },
  {
    id: 6,
    name: "Casey",
    role: "Supporter",
    avatar: "/placeholder.svg?height=80&width=80",
    points: 90,
    status: "offline",
  },
  {
    id: 7,
    name: "Jamie",
    role: "Jr-Supporter",
    avatar: "/placeholder.svg?height=80&width=80",
    points: 65,
    status: "away",
  },
  {
    id: 8,
    name: "Morgan",
    role: "Jr-Supporter",
    avatar: "/placeholder.svg?height=80&width=80",
    points: 50,
    status: "online",
  },
]

const roleColors: Record<string, string> = {
  Owner: "from-purple-500 to-pink-500",
  Admin: "from-red-500 to-orange-500",
  Moderator: "from-green-500 to-emerald-500",
  "Jr-Moderator": "from-lime-500 to-green-500",
  Supporter: "from-orange-500 to-amber-500",
  "Jr-Supporter": "from-yellow-500 to-amber-500",
}

export default function TeamContent() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Team Members</h2>
        <div className="flex gap-2">
          <select className="px-4 py-2 rounded-lg bg-black/20 border border-gray-800 text-sm">
            <option>All Roles</option>
            <option>Owner</option>
            <option>Admin</option>
            <option>Moderator</option>
            <option>Jr-Moderator</option>
            <option>Supporter</option>
            <option>Jr-Supporter</option>
          </select>

          <div className="relative">
            <input
              type="text"
              placeholder="Search members..."
              className="pl-8 pr-4 py-2 rounded-lg bg-black/20 border border-gray-800 text-sm w-48"
            />
            <Icons.check className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {teamMembers.map((member) => (
          <Card
            key={member.id}
            className="bg-black/40 backdrop-blur-xl border-gray-800 overflow-hidden hover:translate-y-[-4px] transition-transform duration-300"
          >
            <div className={`h-2 bg-gradient-to-r ${roleColors[member.role] || "from-gray-500 to-gray-600"}`}></div>
            <div className="p-4 text-center">
              <div className="relative inline-block">
                <img
                  src={member.avatar || "/placeholder.svg"}
                  alt={member.name}
                  className="w-20 h-20 rounded-full mx-auto border-2 border-primary/20"
                />
                <div
                  className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-black ${
                    member.status === "online"
                      ? "bg-green-500"
                      : member.status === "away"
                        ? "bg-yellow-500"
                        : "bg-gray-500"
                  }`}
                ></div>
              </div>

              <h3 className="font-semibold mt-3">{member.name}</h3>
              <span
                className={`text-xs px-2 py-1 rounded-full inline-block mt-1 bg-gradient-to-r ${roleColors[member.role] || "from-gray-500 to-gray-600"}`}
              >
                {member.role}
              </span>

              <div className="mt-3 text-sm text-muted-foreground">
                <div className="flex justify-between mb-1">
                  <span>Points</span>
                  <span>{member.points}</span>
                </div>
                <div className="h-2 bg-primary/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${roleColors[member.role] || "from-gray-500 to-gray-600"}`}
                    style={{ width: `${Math.min((member.points / 200) * 100, 100)}%` }}
                  />
                </div>
              </div>

              <Button variant="ghost" size="sm" className="mt-4 w-full">
                <Icons.user className="mr-2 h-4 w-4" />
                View Profile
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}


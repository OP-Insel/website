import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DashboardNav } from "@/components/dashboard-nav"
import { Shield } from "lucide-react"

export default function TeamPage() {
  // Beispiel-Teammitglieder
  const teamMembers = [
    {
      id: 1,
      name: "Steve",
      role: "Owner",
      avatar: "https://mc-heads.net/avatar/MHF_Steve",
      points: 150,
      joinedDate: "2023-01-15",
      badgeColor: "text-red-400 border-red-400",
    },
    {
      id: 2,
      name: "Alex",
      role: "Co-Owner",
      avatar: "https://mc-heads.net/avatar/MHF_Alex",
      points: 140,
      joinedDate: "2023-01-20",
      badgeColor: "text-orange-400 border-orange-400",
    },
    {
      id: 3,
      name: "Zombie",
      role: "Admin",
      avatar: "https://mc-heads.net/avatar/MHF_Zombie",
      points: 120,
      joinedDate: "2023-02-10",
      badgeColor: "text-purple-400 border-purple-400",
    },
    {
      id: 4,
      name: "Creeper",
      role: "Moderator",
      avatar: "https://mc-heads.net/avatar/MHF_Creeper",
      points: 95,
      joinedDate: "2023-03-05",
      badgeColor: "text-yellow-400 border-yellow-400",
    },
    {
      id: 5,
      name: "Skeleton",
      role: "Moderator",
      avatar: "https://mc-heads.net/avatar/MHF_Skeleton",
      points: 90,
      joinedDate: "2023-03-15",
      badgeColor: "text-yellow-400 border-yellow-400",
    },
    {
      id: 6,
      name: "Enderman",
      role: "Helper",
      avatar: "https://mc-heads.net/avatar/MHF_Enderman",
      points: 70,
      joinedDate: "2023-04-10",
      badgeColor: "text-blue-400 border-blue-400",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <header className="sticky top-0 z-10 border-b border-gray-800 bg-black/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">OP-Insel</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="/dashboard" className="text-sm font-medium hover:text-primary">
              Dashboard
            </a>
            <a href="/dashboard/tasks" className="text-sm font-medium hover:text-primary">
              Aufgaben
            </a>
            <a href="/dashboard/calendar" className="text-sm font-medium hover:text-primary">
              Termine
            </a>
            <a href="/dashboard/team" className="text-sm font-medium text-primary">
              Team
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src="https://mc-heads.net/avatar/MHF_Steve" alt="Steve" />
              <AvatarFallback>MC</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10 py-8">
        <aside className="fixed top-20 z-30 -ml-2 hidden h-[calc(100vh-5rem)] w-full shrink-0 overflow-y-auto border-r border-gray-800 md:sticky md:block">
          <DashboardNav />
        </aside>
        <main className="flex w-full flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold tracking-tight">Team-Mitglieder</h1>
          </div>
          <Card className="bg-gray-900 border-gray-800 text-white">
            <CardHeader>
              <CardTitle>Team-Hierarchie</CardTitle>
              <CardDescription className="text-gray-400">
                Alle Mitglieder des OP-Insel Teams und ihre Rollen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex flex-col items-center gap-2 rounded-lg border border-gray-800 p-4 text-center"
                  >
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h3 className="text-lg font-semibold">{member.name}</h3>
                    <Badge variant="outline" className={member.badgeColor}>
                      {member.role}
                    </Badge>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-400">
                        <span className="font-medium text-white">{member.points}</span> Punkte
                      </p>
                      <p className="text-xs text-gray-400">
                        Beigetreten: {new Date(member.joinedDate).toLocaleDateString("de-DE")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
      <footer className="border-t border-gray-800 bg-black py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-gray-400 md:text-left">
            &copy; {new Date().getFullYear()} OP-Insel. Alle Rechte vorbehalten.
          </p>
        </div>
      </footer>
    </div>
  )
}


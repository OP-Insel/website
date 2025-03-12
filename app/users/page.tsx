import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, MinusCircle, PlusCircle } from "lucide-react"

export default function UsersPage() {
  // Mock data for users
  const users = [
    { id: 1, name: "Spieler1", role: "Owner", points: 250, avatar: "/placeholder.svg?height=40&width=40" },
    { id: 2, name: "Spieler2", role: "Co-Owner", points: 180, avatar: "/placeholder.svg?height=40&width=40" },
    { id: 3, name: "Spieler3", role: "Admin", points: 120, avatar: "/placeholder.svg?height=40&width=40" },
    { id: 4, name: "Spieler4", role: "Moderator", points: 90, avatar: "/placeholder.svg?height=40&width=40" },
    { id: 5, name: "Spieler5", role: "Builder", points: 75, avatar: "/placeholder.svg?height=40&width=40" },
    { id: 6, name: "Spieler6", role: "Member", points: 50, avatar: "/placeholder.svg?height=40&width=40" },
    { id: 7, name: "Spieler7", role: "Member", points: 30, avatar: "/placeholder.svg?height=40&width=40" },
    { id: 8, name: "Spieler8", role: "Member", points: 15, avatar: "/placeholder.svg?height=40&width=40" },
  ]

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "Owner":
        return "destructive"
      case "Co-Owner":
        return "destructive"
      case "Admin":
        return "default"
      case "Moderator":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="container py-6 space-y-8 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Benutzer & Punktesystem</h1>
          <p className="text-muted-foreground mt-2">Verwalte Benutzer und vergebe Punkte für Aktivitäten.</p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Benutzer suchen..." className="pl-8" />
        </div>
        <Button variant="outline" className="gap-2">
          <Plus className="h-4 w-4" />
          Filter
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <Card key={user.id} className="border border-border hover:border-primary/50 transition-all">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{user.name}</CardTitle>
                    <CardDescription>{user.points} Punkte</CardDescription>
                  </div>
                </div>
                <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mt-4">
                <Button variant="outline" size="sm" className="gap-1">
                  <MinusCircle className="h-4 w-4" />
                  Punkte abziehen
                </Button>
                <Button size="sm" className="gap-1">
                  <PlusCircle className="h-4 w-4" />
                  Punkte geben
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}


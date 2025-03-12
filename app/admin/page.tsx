import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Shield, Users, Lock, Key } from "lucide-react"

export default function AdminPage() {
  // Mock data for users
  const users = [
    { id: 1, name: "Spieler1", role: "Owner", permissions: ["all"], avatar: "/placeholder.svg?height=40&width=40" },
    { id: 2, name: "Spieler2", role: "Co-Owner", permissions: ["all"], avatar: "/placeholder.svg?height=40&width=40" },
    {
      id: 3,
      name: "Spieler3",
      role: "Admin",
      permissions: ["manage_tasks", "manage_points"],
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      name: "Spieler4",
      role: "Moderator",
      permissions: ["manage_points"],
      avatar: "/placeholder.svg?height=40&width=40",
    },
    { id: 5, name: "Spieler5", role: "Builder", permissions: [], avatar: "/placeholder.svg?height=40&width=40" },
  ]

  // Mock data for roles
  const roles = [
    { id: 1, name: "Owner", color: "destructive", userCount: 1 },
    { id: 2, name: "Co-Owner", color: "destructive", userCount: 1 },
    { id: 3, name: "Admin", color: "default", userCount: 1 },
    { id: 4, name: "Moderator", color: "secondary", userCount: 1 },
    { id: 5, name: "Builder", color: "outline", userCount: 1 },
    { id: 6, name: "Member", color: "outline", userCount: 3 },
  ]

  // Mock data for permissions
  const permissions = [
    { id: "manage_points", name: "Punkte verwalten", description: "Punkte vergeben oder abziehen" },
    { id: "suggest_points", name: "Punkte vorschlagen", description: "Vorschläge für Punkteabzüge machen" },
    { id: "manage_tasks", name: "Aufgaben verwalten", description: "Aufgaben erstellen, umbenennen oder löschen" },
    { id: "delete_users", name: "Benutzer löschen", description: "Benutzer vom System entfernen" },
    { id: "manage_access", name: "Zugriff verwalten", description: "Zugriff auf die Website gewähren oder entziehen" },
  ]

  return (
    <div className="container py-6 space-y-8 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin-Dashboard</h1>
          <p className="text-muted-foreground mt-2">Verwalte Berechtigungen, Rollen und Systemeinstellungen.</p>
        </div>
        <Badge variant="destructive" className="gap-1">
          <Shield className="h-3 w-3" />
          Nur für Owner & Co-Owner
        </Badge>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" />
            Benutzer
          </TabsTrigger>
          <TabsTrigger value="roles" className="gap-2">
            <Key className="h-4 w-4" />
            Rollen
          </TabsTrigger>
          <TabsTrigger value="permissions" className="gap-2">
            <Lock className="h-4 w-4" />
            Berechtigungen
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Benutzerverwaltung</CardTitle>
              <CardDescription>Verwalte Benutzer und ihre Berechtigungen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Button variant="outline" size="sm">
                        Rolle ändern
                      </Button>
                      <Button variant="outline" size="sm">
                        Berechtigungen
                      </Button>
                      {user.role !== "Owner" && user.role !== "Co-Owner" && (
                        <Button variant="destructive" size="sm">
                          Entfernen
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Rollenverwaltung</CardTitle>
              <CardDescription>Verwalte Rollen und ihre Berechtigungen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {roles.map((role) => (
                  <div key={role.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Badge variant={role.color as any}>{role.name}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {role.userCount} {role.userCount === 1 ? "Benutzer" : "Benutzer"}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Button variant="outline" size="sm">
                        Berechtigungen
                      </Button>
                      {role.name !== "Owner" && role.name !== "Co-Owner" && (
                        <Button variant="outline" size="sm">
                          Bearbeiten
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Berechtigungsverwaltung</CardTitle>
              <CardDescription>Verwalte Systemberechtigungen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {permissions.map((permission) => (
                  <div key={permission.id} className="flex items-start justify-between">
                    <div>
                      <Label htmlFor={permission.id} className="text-base font-medium">
                        {permission.name}
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">{permission.description}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Switch id={permission.id} />
                      <Button variant="link" size="sm" className="h-auto p-0">
                        Rollen zuweisen
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}


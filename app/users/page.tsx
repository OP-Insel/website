"use client"

import { useState, useEffect } from "react"
import { UserCard } from "@/components/user-card"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getUsers, getCurrentUser, getRoles, getViolations } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [roles, setRoles] = useState<any[]>([])
  const [violations, setViolations] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const { toast } = useToast()

  useEffect(() => {
    // Lade Benutzer, Rollen und Verstöße
    const loadData = () => {
      try {
        const allUsers = getUsers()
        const current = getCurrentUser()
        const allRoles = getRoles()
        const allViolations = getViolations()

        setUsers(allUsers)
        setCurrentUser(current)
        setRoles(allRoles)
        setViolations(allViolations)
      } catch (error) {
        console.error("Fehler beim Laden der Daten:", error)
        toast({
          title: "Fehler",
          description: "Die Benutzerdaten konnten nicht geladen werden.",
          variant: "destructive",
        })
      }
    }

    loadData()
  }, [toast])

  // Filtere Benutzer basierend auf Suchbegriff und aktivem Tab
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "approved") return matchesSearch && user.approved
    if (activeTab === "unapproved") return matchesSearch && !user.approved
    if (activeTab === "banned") return matchesSearch && user.banned

    return matchesSearch
  })

  // Sortiere Benutzer: Nicht freigegebene zuerst, dann nach Rolle und Punkten
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    // Nicht freigegebene Benutzer zuerst
    if (a.approved !== b.approved) return a.approved ? 1 : -1

    // Nach Rolle sortieren (Owner > Co-Owner > Admin > Moderator > Team > User)
    const roleOrder = { owner: 0, "co-owner": 1, admin: 2, moderator: 3, team: 4, user: 5 }
    const aRoleOrder = roleOrder[a.role] ?? 999
    const bRoleOrder = roleOrder[b.role] ?? 999
    if (aRoleOrder !== bRoleOrder) return aRoleOrder - bRoleOrder

    // Nach Punkten sortieren (höhere Punkte zuerst)
    return (b.points || 0) - (a.points || 0)
  })

  const handleEdit = (userId: string) => {
    toast({
      title: "Benutzer bearbeiten",
      description: `Benutzer mit ID ${userId} wird bearbeitet.`,
    })
  }

  const handleDelete = (userId: string) => {
    toast({
      title: "Benutzer löschen",
      description: `Benutzer mit ID ${userId} wird gelöscht.`,
    })
  }

  const handleApprove = (userId: string, approved: boolean) => {
    toast({
      title: approved ? "Benutzer freigegeben" : "Freigabe entzogen",
      description: `Benutzer mit ID ${userId} wurde ${approved ? "freigegeben" : "die Freigabe entzogen"}.`,
    })
  }

  const handleRoleChange = (userId: string, newRole: string) => {
    toast({
      title: "Rolle geändert",
      description: `Die Rolle des Benutzers mit ID ${userId} wurde zu ${newRole} geändert.`,
    })
  }

  const handlePermissionEdit = (userId: string) => {
    toast({
      title: "Berechtigungen bearbeiten",
      description: `Berechtigungen des Benutzers mit ID ${userId} werden bearbeitet.`,
    })
  }

  const handlePointDeduction = (userId: string, points: number, reason: string) => {
    toast({
      title: "Punktabzug",
      description: `${points} Punkte wurden von Benutzer ${userId} abgezogen. Grund: ${reason}`,
    })
  }

  if (!currentUser) {
    return <div className="p-8 text-center">Lädt Benutzerdaten...</div>
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Benutzerverwaltung</h1>
          <p className="text-muted-foreground">Verwalte Benutzer, Rollen und Berechtigungen für das OP-Insel Team</p>
        </div>
        <div className="w-full md:w-auto">
          <Input
            placeholder="Benutzer suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-[250px]"
          />
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">Alle Benutzer</TabsTrigger>
          <TabsTrigger value="approved">Freigegebene</TabsTrigger>
          <TabsTrigger value="unapproved">Nicht freigegebene</TabsTrigger>
          <TabsTrigger value="banned">Gesperrte</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          {sortedUsers.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Keine Benutzer gefunden.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedUsers.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  currentUser={currentUser}
                  roles={roles}
                  violations={violations}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onApprove={handleApprove}
                  onRoleChange={handleRoleChange}
                  onPermissionEdit={handlePermissionEdit}
                  onPointDeduction={handlePointDeduction}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}


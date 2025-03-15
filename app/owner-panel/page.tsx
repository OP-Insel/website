"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Users, Settings, Search, UserPlus, CheckCircle, Server } from "lucide-react"
import { PermissionBadge } from "@/components/permission-badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { UserCard } from "@/components/user-card"
import { EnhancedServerStatus } from "@/components/enhanced-server-status"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"

export default function OwnerPanelPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [users, setUsers] = useState<any[]>([])
  const [roles, setRoles] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState<string | null>(null)
  const [editedUserData, setEditedUserData] = useState<any>(null)
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    title: string
    description: string
    action: () => void
  }>({
    open: false,
    title: "",
    description: "",
    action: () => {},
  })

  // System settings state
  const [systemSettings, setSystemSettings] = useState<any>({
    pointResetDay: 1,
    roleResetDay: 1,
    maintenanceMode: false,
    registrationOpen: true,
    minPointsForPromotion: 100,
    maxPointDeduction: 50,
    requireApproval: true,
  })
  const [editingSettings, setEditingSettings] = useState(false)
  const [editedSettings, setEditedSettings] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("users")

  // Permission management
  const [permissionDialog, setPermissionDialog] = useState<{
    open: boolean
    userId: string
    username: string
  }>({
    open: false,
    userId: "",
    username: "",
  })

  const allPermissions = [
    "manage_users",
    "manage_roles",
    "manage_points",
    "create_tasks",
    "delete_tasks",
    "assign_tasks",
    "create_content",
    "delete_content",
    "edit_content",
    "ban_users",
    "view_admin",
    "assign_roles",
    "manage_stories",
  ]

  useEffect(() => {
    // Check if user is logged in and has owner/co-owner role
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      router.push("/")
      return
    }

    const userData = JSON.parse(currentUser)

    // Only allow owner or co-owner
    if (userData.role !== "owner" && userData.role !== "co-owner") {
      toast({
        title: "Zugriff verweigert",
        description: "Nur Owner und Co-Owner haben Zugriff auf dieses Panel.",
        variant: "destructive",
      })
      router.push("/dashboard")
      return
    }

    setUser(userData)

    // Get all users and roles
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]")
    setUsers(allUsers)

    const allRoles = JSON.parse(localStorage.getItem("roles") || "[]")
    setRoles(allRoles)

    // Get system settings
    const settings = JSON.parse(localStorage.getItem("systemSettings") || "{}")
    setSystemSettings({
      ...systemSettings,
      ...settings,
    })

    setLoading(false)
  }, [router, toast])

  const handleUserEdit = (userId: string) => {
    const userToEdit = users.find((u) => u.id === userId)
    if (!userToEdit) return

    setEditingUser(userId)
    setEditedUserData({ ...userToEdit })
  }

  const saveUserEdit = () => {
    if (!editedUserData) return

    const updatedUsers = users.map((u) => (u.id === editedUserData.id ? editedUserData : u))

    setUsers(updatedUsers)
    localStorage.setItem("users", JSON.stringify(updatedUsers))

    // Add to activity log
    addActivityLog("user_edited", editedUserData.username, `User details updated by ${user.username}`)

    toast({
      title: "Erfolg",
      description: `Benutzer ${editedUserData.username} wurde aktualisiert.`,
    })

    setEditingUser(null)
    setEditedUserData(null)
  }

  const cancelUserEdit = () => {
    setEditingUser(null)
    setEditedUserData(null)
  }

  const handleDeleteUser = (userId: string) => {
    const userToDelete = users.find((u) => u.id === userId)
    if (!userToDelete) return

    setConfirmDialog({
      open: true,
      title: "Benutzer löschen",
      description: `Bist du sicher, dass du den Benutzer "${userToDelete.username}" löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden.`,
      action: () => {
        const updatedUsers = users.filter((u) => u.id !== userId)
        setUsers(updatedUsers)
        localStorage.setItem("users", JSON.stringify(updatedUsers))

        // Add to activity log
        addActivityLog("user_deleted", userToDelete.username, `User deleted by ${user.username}`)

        toast({
          title: "Erfolg",
          description: `Benutzer ${userToDelete.username} wurde gelöscht.`,
        })

        setConfirmDialog({ ...confirmDialog, open: false })
      },
    })
  }

  const handleApproveUser = (userId: string, approved: boolean) => {
    const targetUser = users.find((u) => u.id === userId)
    if (!targetUser) return

    const updatedUsers = users.map((u) => {
      if (u.id === userId) {
        return { ...u, approved }
      }
      return u
    })

    setUsers(updatedUsers)
    localStorage.setItem("users", JSON.stringify(updatedUsers))

    // Add to activity log
    addActivityLog(
      approved ? "user_approved" : "user_unapproved",
      targetUser.username,
      `User ${approved ? "approved" : "unapproved"} by ${user.username}`,
    )

    toast({
      title: "Erfolg",
      description: `Benutzer ${targetUser.username} wurde ${approved ? "freigegeben" : "gesperrt"}.`,
    })
  }

  const handleRoleChange = (userId: string, newRoleId: string) => {
    const targetUser = users.find((u) => u.id === userId)
    if (!targetUser) return

    // Don't allow changing owner role unless current user is owner
    if (targetUser.role === "owner" && user.role !== "owner") {
      toast({
        title: "Zugriff verweigert",
        description: "Nur der Owner kann die Rolle eines anderen Owners ändern.",
        variant: "destructive",
      })
      return
    }

    const updatedUsers = users.map((u) => {
      if (u.id === userId) {
        return { ...u, role: newRoleId }
      }
      return u
    })

    setUsers(updatedUsers)
    localStorage.setItem("users", JSON.stringify(updatedUsers))

    // Add to activity log
    addActivityLog(
      "role_changed",
      targetUser.username,
      `Role changed from ${targetUser.role} to ${newRoleId} by ${user.username}`,
    )

    toast({
      title: "Erfolg",
      description: `Rolle von ${targetUser.username} wurde zu ${newRoleId} geändert.`,
    })
  }

  const openPermissionDialog = (userId: string) => {
    const targetUser = users.find((u) => u.id === userId)
    if (!targetUser) return

    setPermissionDialog({
      open: true,
      userId,
      username: targetUser.username,
    })
  }

  const handlePermissionToggle = (permission: string) => {
    const targetUser = users.find((u) => u.id === permissionDialog.userId)
    if (!targetUser) return

    const userPermissions = targetUser.permissions || []
    const hasPermission = userPermissions.includes(permission)

    const updatedUsers = users.map((u) => {
      if (u.id === permissionDialog.userId) {
        const updatedPermissions = hasPermission
          ? userPermissions.filter((p) => p !== permission)
          : [...userPermissions, permission]

        return { ...u, permissions: updatedPermissions }
      }
      return u
    })

    setUsers(updatedUsers)
    localStorage.setItem("users", JSON.stringify(updatedUsers))

    // Add to activity log
    addActivityLog(
      hasPermission ? "permission_removed" : "permission_added",
      targetUser.username,
      `Permission "${permission}" ${hasPermission ? "removed from" : "added to"} ${targetUser.username} by ${user.username}`,
    )
  }

  const handleSaveSettings = () => {
    if (!editedSettings) return

    localStorage.setItem("systemSettings", JSON.stringify(editedSettings))
    setSystemSettings(editedSettings)

    // Add to activity log
    addActivityLog("settings_updated", "system", `System settings updated by ${user.username}`)

    toast({
      title: "Erfolg",
      description: "Systemeinstellungen wurden aktualisiert.",
    })

    setEditingSettings(false)
  }

  const handleResetPoints = () => {
    setConfirmDialog({
      open: true,
      title: "Punkte zurücksetzen",
      description:
        "Bist du sicher, dass du die Punkte aller Benutzer zurücksetzen möchtest? Diese Aktion kann nicht rückgängig gemacht werden.",
      action: () => {
        const updatedUsers = users.map((u) => {
          const pointsHistory = u.pointsHistory || []
          const historyEntry = {
            amount: -u.points,
            reason: "Monatlicher Punktereset",
            timestamp: new Date().toISOString(),
            awardedBy: user.username,
          }

          return {
            ...u,
            points: 0,
            pointsHistory: [historyEntry, ...pointsHistory],
            lastPointReset: new Date().toISOString(),
          }
        })

        setUsers(updatedUsers)
        localStorage.setItem("users", JSON.stringify(updatedUsers))

        // Add to activity log
        addActivityLog("points_reset", "all_users", `Points reset for all users by ${user.username}`)

        toast({
          title: "Erfolg",
          description: "Punkte wurden für alle Benutzer zurückgesetzt.",
        })

        setConfirmDialog({ ...confirmDialog, open: false })
      },
    })
  }

  const addActivityLog = (type: string, target: string, details: string) => {
    const activityLog = JSON.parse(localStorage.getItem("activityLog") || "[]")

    const newLog = {
      id: Date.now().toString(),
      type,
      userId: user.id,
      username: user.username,
      timestamp: new Date().toISOString(),
      target,
      details,
    }

    activityLog.unshift(newLog)
    localStorage.setItem("activityLog", JSON.stringify(activityLog))
  }

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const pendingApprovalCount = users.filter((u) => !u.approved && !u.banned).length

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Lädt...</div>
  }

  const handleSaveSettingsNew = () => {
    toast({
      title: "Einstellungen gespeichert",
      description: "Die Einstellungen wurden erfolgreich gespeichert.",
    })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Owner Panel</h2>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-sm">
              {roles.find((r) => r.id === user.role)?.name || user.role}
            </Badge>
          </div>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users" className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              <span>Benutzer</span>
            </TabsTrigger>
            <TabsTrigger value="server" className="flex items-center">
              <Server className="mr-2 h-4 w-4" />
              <span>Server</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              <span>Einstellungen</span>
            </TabsTrigger>
          </TabsList>

          {/* Benutzer Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Benutzerverwaltung</CardTitle>
                <CardDescription>Verwalte Benutzer, Rollen und Berechtigungen</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                  <div className="relative w-full md:w-auto">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Benutzer suchen..."
                      className="pl-8 w-full md:w-[300px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Benutzer hinzufügen
                    </Button>
                    {pendingApprovalCount > 0 && (
                      <Button variant="outline" onClick={() => router.push("/admin/user-approval")}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Freigaben ({pendingApprovalCount})
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredUsers.map((u) => (
                    <UserCard
                      key={u.id}
                      user={u}
                      currentUser={user}
                      roles={roles}
                      violations={JSON.parse(localStorage.getItem("violations") || "[]")}
                      onEdit={handleUserEdit}
                      onDelete={handleDeleteUser}
                      onApprove={handleApproveUser}
                      onRoleChange={handleRoleChange}
                      onPermissionEdit={(userId) => openPermissionDialog(userId)}
                      onPointDeduction={(userId, points, reason) => {
                        // Implementiere die Punktabzugsfunktion
                        const targetUser = users.find((u) => u.id === userId)
                        if (!targetUser) return

                        // Erstelle einen Punktabzugsantrag oder ziehe direkt Punkte ab
                        if (
                          user.role === "owner" ||
                          user.role === "co-owner" ||
                          (user.permissions && user.permissions.includes("manage_points"))
                        ) {
                          // Direkter Punktabzug
                          const updatedUsers = users.map((u) => {
                            if (u.id === userId) {
                              const currentPoints = u.points || 0
                              const newPoints = Math.max(0, currentPoints - points)

                              // Füge zum Punkteverlauf hinzu
                              const pointsHistory = u.pointsHistory || []
                              const historyEntry = {
                                amount: -points,
                                reason,
                                timestamp: new Date().toISOString(),
                                awardedBy: user.username,
                              }

                              return {
                                ...u,
                                points: newPoints,
                                pointsHistory: [historyEntry, ...pointsHistory],
                              }
                            }
                            return u
                          })

                          setUsers(updatedUsers)
                          localStorage.setItem("users", JSON.stringify(updatedUsers))

                          // Füge zum Aktivitätslog hinzu
                          addActivityLog(
                            "points_deducted",
                            targetUser.username,
                            `${points} Punkte abgezogen: ${reason}`,
                          )

                          toast({
                            title: "Erfolg",
                            description: `${points} Punkte wurden von ${targetUser.username} abgezogen.`,
                          })
                        } else {
                          // Erstelle einen Punktabzugsantrag
                          const pointRequests = JSON.parse(localStorage.getItem("pointDeductionRequests") || "[]")

                          const newRequest = {
                            id: Date.now().toString(),
                            userId,
                            requestedBy: user.id,
                            requestedAt: new Date().toISOString(),
                            reason,
                            points,
                            status: "pending",
                          }

                          localStorage.setItem("pointDeductionRequests", JSON.stringify([...pointRequests, newRequest]))

                          // Füge zum Aktivitätslog hinzu
                          addActivityLog(
                            "point_deduction_requested",
                            targetUser.username,
                            `Punktabzug vorgeschlagen: ${points} Punkte für ${reason}`,
                          )

                          toast({
                            title: "Erfolg",
                            description: `Dein Vorschlag für einen Punktabzug wurde eingereicht.`,
                          })
                        }
                      }}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Server Tab */}
          <TabsContent value="server" className="space-y-4">
            <EnhancedServerStatus />
          </TabsContent>

          {/* Einstellungen Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Allgemeine Einstellungen</CardTitle>
                <CardDescription>
                  Konfiguriere die grundlegenden Einstellungen für das OP-Insel Team-Management-System
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="team-name">Team Name</Label>
                    <Input id="team-name" defaultValue="OP-Insel Team" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="server-address">Server-Adresse</Label>
                    <Input id="server-address" defaultValue="OPInsel.de" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="public-registration">Öffentliche Registrierung</Label>
                      <p className="text-sm text-muted-foreground">Erlaube neuen Benutzern, sich zu registrieren</p>
                    </div>
                    <Switch id="public-registration" defaultChecked />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Punktesystem</h3>

                  <div className="space-y-2">
                    <Label htmlFor="starting-points">Startpunkte für neue Benutzer</Label>
                    <Input id="starting-points" type="number" defaultValue="100" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="min-points-moderator">Mindestpunkte für Moderator</Label>
                    <Input id="min-points-moderator" type="number" defaultValue="80" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="min-points-admin">Mindestpunkte für Admin</Label>
                    <Input id="min-points-admin" type="number" defaultValue="90" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="auto-demotion">Automatische Herabstufung</Label>
                      <p className="text-sm text-muted-foreground">
                        Benutzer automatisch herabstufen, wenn Punkte unter den Schwellenwert fallen
                      </p>
                    </div>
                    <Switch id="auto-demotion" defaultChecked />
                  </div>
                </div>

                <Separator />

                <div className="flex justify-end">
                  <Button onClick={handleSaveSettingsNew}>Einstellungen speichern</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{confirmDialog.title}</DialogTitle>
            <DialogDescription>{confirmDialog.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}>
              Abbrechen
            </Button>
            <Button variant="destructive" onClick={confirmDialog.action}>
              Bestätigen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Permission Management Dialog */}
      <Dialog open={permissionDialog.open} onOpenChange={(open) => setPermissionDialog({ ...permissionDialog, open })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Berechtigungen verwalten</DialogTitle>
            <DialogDescription>Berechtigungen für {permissionDialog.username} bearbeiten</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-2 py-4">
            {allPermissions.map((permission) => {
              const targetUser = users.find((u) => u.id === permissionDialog.userId)
              const hasPermission = targetUser?.permissions?.includes(permission) || false

              return (
                <div key={permission} className="flex items-center justify-between">
                  <span className="text-sm">{permission}</span>
                  <PermissionBadge
                    permission={hasPermission ? "Erlaubt" : "Verweigert"}
                    hasPermission={hasPermission}
                    onClick={() => handlePermissionToggle(permission)}
                  />
                </div>
              )
            })}
          </div>

          <DialogFooter>
            <Button onClick={() => setPermissionDialog({ ...permissionDialog, open: false })}>Schließen</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


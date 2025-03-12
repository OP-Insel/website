"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type User = {
  username: string
  password: string
  role: string
  points: number
  permissions: string[]
}

type Activity = {
  id: number
  user: string
  action: string
  timestamp: number
}

export default function AdminPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [pendingUsers, setPendingUsers] = useState<User[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)
  const [stories, setStories] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])
  const [showDeleteStoryConfirm, setShowDeleteStoryConfirm] = useState(false)
  const [storyToDelete, setStoryToDelete] = useState<string | null>(null)
  const [showDeleteTaskConfirm, setShowDeleteTaskConfirm] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null)

  useEffect(() => {
    // Check if user has admin access
    const userData = localStorage.getItem("currentUser")
    if (userData) {
      const user = JSON.parse(userData)
      setCurrentUser(user)

      if (!user.permissions.includes("access_admin")) {
        toast({
          title: "Zugriff verweigert",
          description: "Du hast keine Berechtigung, auf das Owner-Dashboard zuzugreifen.",
          variant: "destructive",
        })
        router.push("/dashboard")
      }
    } else {
      router.push("/")
    }

    // Load users
    const storedUsers = localStorage.getItem("users")
    if (storedUsers) {
      const parsedUsers = JSON.parse(storedUsers)
      setUsers(parsedUsers.filter((u: User) => u.role !== "pending"))
      setPendingUsers(parsedUsers.filter((u: User) => u.role === "pending"))
    }

    // Load activities
    const storedActivities = localStorage.getItem("activities")
    if (storedActivities) {
      setActivities(JSON.parse(storedActivities))
    }

    // Load stories
    const storedStories = localStorage.getItem("stories")
    if (storedStories) {
      setStories(JSON.parse(storedStories))
    }

    // Load tasks
    const storedTasks = localStorage.getItem("tasks")
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks))
    }
  }, [router, toast])

  const handleUserSelect = (user: User) => {
    setSelectedUser(user)
  }

  const handleRoleChange = (role: string) => {
    if (!selectedUser) return

    setSelectedUser({
      ...selectedUser,
      role,
    })
  }

  const handlePermissionToggle = (permission: string) => {
    if (!selectedUser) return

    const updatedPermissions = selectedUser.permissions.includes(permission)
      ? selectedUser.permissions.filter((p) => p !== permission)
      : [...selectedUser.permissions, permission]

    setSelectedUser({
      ...selectedUser,
      permissions: updatedPermissions,
    })
  }

  const handleSaveUser = () => {
    if (!selectedUser) return

    const updatedUsers = users.map((user) => (user.username === selectedUser.username ? selectedUser : user))

    setUsers(updatedUsers)
    localStorage.setItem("users", JSON.stringify([...updatedUsers, ...pendingUsers]))

    // Add activity
    const newActivity = {
      id: Date.now(),
      user: currentUser?.username || "",
      action: `hat die Berechtigungen von ${selectedUser.username} aktualisiert`,
      timestamp: Date.now(),
    }
    const updatedActivities = [newActivity, ...activities]
    setActivities(updatedActivities)
    localStorage.setItem("activities", JSON.stringify(updatedActivities))

    toast({
      title: "Benutzer aktualisiert",
      description: `Die Berechtigungen von ${selectedUser.username} wurden aktualisiert.`,
    })
  }

  const handleApproveUser = (user: User) => {
    // Approve user
    const approvedUser = {
      ...user,
      role: "user",
      permissions: [],
    }

    // Update users
    const updatedPendingUsers = pendingUsers.filter((u) => u.username !== user.username)
    const updatedUsers = [...users, approvedUser]

    setPendingUsers(updatedPendingUsers)
    setUsers(updatedUsers)
    localStorage.setItem("users", JSON.stringify([...updatedUsers]))

    // Add activity
    const newActivity = {
      id: Date.now(),
      user: currentUser?.username || "",
      action: `hat den Benutzer ${user.username} freigeschaltet`,
      timestamp: Date.now(),
    }
    const updatedActivities = [newActivity, ...activities]
    setActivities(updatedActivities)
    localStorage.setItem("activities", JSON.stringify(updatedActivities))

    toast({
      title: "Benutzer freigeschaltet",
      description: `Der Benutzer ${user.username} wurde erfolgreich freigeschaltet.`,
    })
  }

  const handleRejectUser = (user: User) => {
    // Remove user
    const updatedPendingUsers = pendingUsers.filter((u) => u.username !== user.username)

    setPendingUsers(updatedPendingUsers)
    localStorage.setItem("users", JSON.stringify([...users, ...updatedPendingUsers]))

    // Add activity
    const newActivity = {
      id: Date.now(),
      user: currentUser?.username || "",
      action: `hat den Benutzer ${user.username} abgelehnt`,
      timestamp: Date.now(),
    }
    const updatedActivities = [newActivity, ...activities]
    setActivities(updatedActivities)
    localStorage.setItem("activities", JSON.stringify(updatedActivities))

    toast({
      title: "Benutzer abgelehnt",
      description: `Der Benutzer ${user.username} wurde abgelehnt.`,
    })
  }

  const confirmDeleteUser = () => {
    if (!userToDelete) return

    // Remove user
    const updatedUsers = users.filter((u) => u.username !== userToDelete)

    setUsers(updatedUsers)
    localStorage.setItem("users", JSON.stringify([...updatedUsers, ...pendingUsers]))

    if (selectedUser?.username === userToDelete) {
      setSelectedUser(null)
    }

    // Add activity
    const newActivity = {
      id: Date.now(),
      user: currentUser?.username || "",
      action: `hat den Benutzer ${userToDelete} gelöscht`,
      timestamp: Date.now(),
    }
    const updatedActivities = [newActivity, ...activities]
    setActivities(updatedActivities)
    localStorage.setItem("activities", JSON.stringify(updatedActivities))

    toast({
      title: "Benutzer gelöscht",
      description: `Der Benutzer ${userToDelete} wurde erfolgreich gelöscht.`,
    })

    setShowDeleteConfirm(false)
    setUserToDelete(null)
  }

  const handleDeleteUser = (username: string) => {
    setUserToDelete(username)
    setShowDeleteConfirm(true)
  }

  const handleDeleteStory = (storyId: string) => {
    setStoryToDelete(storyId)
    setShowDeleteStoryConfirm(true)
  }

  const confirmDeleteStory = () => {
    if (!storyToDelete) return

    // Find the story to get its title for the activity log
    const storyToRemove = stories.find((s) => s.id === storyToDelete)

    // Remove story from localStorage
    const updatedStories = stories.filter((s) => s.id !== storyToDelete)
    setStories(updatedStories)
    localStorage.setItem("stories", JSON.stringify(updatedStories))

    // Add activity
    const newActivity = {
      id: Date.now(),
      user: currentUser?.username || "",
      action: `hat die Story "${storyToRemove?.title || "Unbekannt"}" gelöscht`,
      timestamp: Date.now(),
    }
    const updatedActivities = [newActivity, ...activities]
    setActivities(updatedActivities)
    localStorage.setItem("activities", JSON.stringify(updatedActivities))

    toast({
      title: "Story gelöscht",
      description: `Die Story wurde erfolgreich gelöscht.`,
    })

    setShowDeleteStoryConfirm(false)
    setStoryToDelete(null)
  }

  const handleDeleteTask = (taskId: string) => {
    setTaskToDelete(taskId)
    setShowDeleteTaskConfirm(true)
  }

  const confirmDeleteTask = () => {
    if (!taskToDelete) return

    // Find the task to get its title for the activity log
    const taskToRemove = tasks.find((t) => t.id === taskToDelete)

    // Remove task from localStorage
    const updatedTasks = tasks.filter((t) => t.id !== taskToDelete)
    setTasks(updatedTasks)
    localStorage.setItem("tasks", JSON.stringify(updatedTasks))

    // Add activity
    const newActivity = {
      id: Date.now(),
      user: currentUser?.username || "",
      action: `hat die Aufgabe "${taskToRemove?.title || "Unbekannt"}" gelöscht`,
      timestamp: Date.now(),
    }
    const updatedActivities = [newActivity, ...activities]
    setActivities(updatedActivities)
    localStorage.setItem("activities", JSON.stringify(updatedActivities))

    toast({
      title: "Aufgabe gelöscht",
      description: `Die Aufgabe wurde erfolgreich gelöscht.`,
    })

    setShowDeleteTaskConfirm(false)
    setTaskToDelete(null)
  }

  // Format timestamp to relative time
  const formatRelativeTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp

    if (diff < 60000) return "gerade eben"
    if (diff < 3600000) return `vor ${Math.floor(diff / 60000)} Min.`
    if (diff < 86400000) return `vor ${Math.floor(diff / 3600000)} Std.`
    return `vor ${Math.floor(diff / 86400000)} Tagen`
  }

  if (!currentUser?.permissions.includes("access_admin")) {
    return (
      <div className="flex h-full items-center justify-center">
        <p>Zugriff verweigert</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Owner-Dashboard</h1>

      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">Benutzer</TabsTrigger>
          <TabsTrigger value="pending">Freischaltungen ({pendingUsers.length})</TabsTrigger>
          <TabsTrigger value="stories">Storys</TabsTrigger>
          <TabsTrigger value="tasks">Aufgaben</TabsTrigger>
          <TabsTrigger value="logs">Aktivitäten</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Benutzer</CardTitle>
                <CardDescription>Wähle einen Benutzer aus, um seine Berechtigungen zu bearbeiten</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                  {users.map((user) => (
                    <div
                      key={user.username}
                      className={`flex items-center gap-3 p-2 rounded-md cursor-pointer ${selectedUser?.username === user.username ? "bg-muted" : "hover:bg-muted/50"}`}
                      onClick={() => handleUserSelect(user)}
                    >
                      <Avatar>
                        <AvatarImage src={`https://mc-heads.net/avatar/${user.username}`} alt={user.username} />
                        <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">{user.username}</p>
                        <p className="text-xs text-muted-foreground">
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)} • {user.points} Punkte
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Berechtigungen</CardTitle>
                <CardDescription>Bearbeite die Berechtigungen des ausgewählten Benutzers</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedUser ? (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label>Benutzername</Label>
                      <Input value={selectedUser.username} disabled />
                    </div>

                    <div className="space-y-2">
                      <Label>Rolle</Label>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={selectedUser.role}
                        onChange={(e) => handleRoleChange(e.target.value)}
                      >
                        <option value="user">User</option>
                        <option value="moderator">Moderator</option>
                        <option value="admin">Admin</option>
                        <option value="co-owner">Co-Owner</option>
                        <option value="owner">Owner</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label>Berechtigungen</Label>
                      <div className="space-y-2 border rounded-md p-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="manage_permissions">Berechtigungen verwalten</Label>
                            <p className="text-xs text-muted-foreground">
                              Kann Berechtigungen anderer Benutzer verwalten
                            </p>
                          </div>
                          <Switch
                            id="manage_permissions"
                            checked={selectedUser.permissions.includes("manage_permissions")}
                            onCheckedChange={() => handlePermissionToggle("manage_permissions")}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="manage_points">Punkte verwalten</Label>
                            <p className="text-xs text-muted-foreground">Kann Punkte vergeben oder abziehen</p>
                          </div>
                          <Switch
                            id="manage_points"
                            checked={selectedUser.permissions.includes("manage_points")}
                            onCheckedChange={() => handlePermissionToggle("manage_points")}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="manage_tasks">Aufgaben verwalten</Label>
                            <p className="text-xs text-muted-foreground">
                              Kann Aufgaben erstellen, umbenennen oder löschen
                            </p>
                          </div>
                          <Switch
                            id="manage_tasks"
                            checked={selectedUser.permissions.includes("manage_tasks")}
                            onCheckedChange={() => handlePermissionToggle("manage_tasks")}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="manage_users">Benutzer verwalten</Label>
                            <p className="text-xs text-muted-foreground">Kann Benutzer löschen oder sperren</p>
                          </div>
                          <Switch
                            id="manage_users"
                            checked={selectedUser.permissions.includes("manage_users")}
                            onCheckedChange={() => handlePermissionToggle("manage_users")}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="access_admin">Admin-Dashboard</Label>
                            <p className="text-xs text-muted-foreground">Hat Zugriff auf das Admin-Dashboard</p>
                          </div>
                          <Switch
                            id="access_admin"
                            checked={selectedUser.permissions.includes("access_admin")}
                            onCheckedChange={() => handlePermissionToggle("access_admin")}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => handleDeleteUser(selectedUser.username)}
                      >
                        Benutzer löschen
                      </Button>
                      <Button type="button" onClick={handleSaveUser}>
                        Änderungen speichern
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    Wähle einen Benutzer aus, um seine Berechtigungen zu bearbeiten
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pending" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Freischaltungsanfragen</CardTitle>
              <CardDescription>Neue Benutzer, die auf Freischaltung warten</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingUsers.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Keine Freischaltungsanfragen vorhanden</p>
              ) : (
                <div className="space-y-4">
                  {pendingUsers.map((user) => (
                    <div key={user.username} className="flex items-center justify-between p-4 border rounded-md">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={`https://mc-heads.net/avatar/${user.username}`} alt={user.username} />
                          <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.username}</p>
                          <p className="text-xs text-muted-foreground">Wartet auf Freischaltung</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => handleRejectUser(user)}>
                          Ablehnen
                        </Button>
                        <Button onClick={() => handleApproveUser(user)}>Freischalten</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Story-Verwaltung</CardTitle>
              <CardDescription>Verwalte alle Storys im System</CardDescription>
            </CardHeader>
            <CardContent>
              {stories.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Keine Storys vorhanden</p>
              ) : (
                <div className="space-y-4">
                  {stories.map((story) => (
                    <div key={story.id} className="flex items-center justify-between p-4 border rounded-md">
                      <div>
                        <p className="font-medium">{story.title}</p>
                        <p className="text-xs text-muted-foreground">
                          Erstellt von {story.author} • {new Date(story.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteStory(story.id)}>
                        Löschen
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Aufgaben-Verwaltung</CardTitle>
              <CardDescription>Verwalte alle Aufgaben im System</CardDescription>
            </CardHeader>
            <CardContent>
              {tasks.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Keine Aufgaben vorhanden</p>
              ) : (
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-4 border rounded-md">
                      <div>
                        <p className="font-medium">{task.title}</p>
                        <p className="text-xs text-muted-foreground">
                          Zugewiesen an: {task.assignee || "Niemand"} • Status:{" "}
                          {task.completed ? "Abgeschlossen" : "Offen"}
                        </p>
                      </div>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteTask(task.id)}>
                        Löschen
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Aktivitätsprotokoll</CardTitle>
              <CardDescription>Alle Aktivitäten und Änderungen im System</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[500px] overflow-y-auto">
                {activities.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Keine Aktivitäten vorhanden</p>
                ) : (
                  activities
                    .sort((a, b) => b.timestamp - a.timestamp)
                    .map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 border-b pb-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`https://mc-heads.net/avatar/${activity.user}`} alt={activity.user} />
                          <AvatarFallback>{activity.user.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm">
                            <span className="font-medium">{activity.user}</span> {activity.action}
                          </p>
                          <p className="text-xs text-muted-foreground">{formatRelativeTime(activity.timestamp)}</p>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Benutzer löschen</AlertDialogTitle>
            <AlertDialogDescription>
              Bist du sicher, dass du den Benutzer "{userToDelete}" löschen möchtest? Diese Aktion kann nicht rückgängig
              gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteUser} className="bg-destructive text-destructive-foreground">
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showDeleteStoryConfirm} onOpenChange={setShowDeleteStoryConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Story löschen</AlertDialogTitle>
            <AlertDialogDescription>
              Bist du sicher, dass du diese Story löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteStory} className="bg-destructive text-destructive-foreground">
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showDeleteTaskConfirm} onOpenChange={setShowDeleteTaskConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Aufgabe löschen</AlertDialogTitle>
            <AlertDialogDescription>
              Bist du sicher, dass du diese Aufgabe löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteTask} className="bg-destructive text-destructive-foreground">
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}


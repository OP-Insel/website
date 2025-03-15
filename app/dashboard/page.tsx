"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MainNav } from "@/components/main-nav"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Users, CheckCircle, FileText, BarChart3, Clock, UserPlus, Activity, User } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { PointsDisplay } from "@/components/points-display"
import { ServerStatus } from "@/components/server-status"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalTasks: 0,
    completedTasks: 0,
    totalStories: 0,
    totalCharacters: 0,
    recentActivities: [] as any[],
    usersByRole: {} as Record<string, number>,
  })
  const [users, setUsers] = useState<any[]>([])
  const [todaysTasks, setTodaysTasks] = useState<any[]>([])

  useEffect(() => {
    // Check if user is logged in
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      router.push("/")
      return
    }

    const userData = JSON.parse(currentUser)
    setUser(userData)

    // Calculate dashboard statistics
    calculateStats()

    // Get today's tasks
    const today = new Date().toISOString().split("T")[0]
    if (userData.tasks && Array.isArray(userData.tasks)) {
      const tasksForToday = userData.tasks.filter(
        (task: any) => task.deadline && task.deadline.startsWith(today) && !task.completed,
      )
      setTodaysTasks(tasksForToday)
    }

    setLoading(false)
  }, [router])

  const calculateStats = () => {
    // Get all data from localStorage
    const usersData = JSON.parse(localStorage.getItem("users") || "[]")
    setUsers(usersData)
    const stories = JSON.parse(localStorage.getItem("stories") || "[]")
    const characters = JSON.parse(localStorage.getItem("characters") || "[]")
    const activityLog = JSON.parse(localStorage.getItem("activityLog") || "[]")

    // Calculate total tasks and completed tasks
    let totalTasks = 0
    let completedTasks = 0

    usersData.forEach((user: any) => {
      if (user.tasks && Array.isArray(user.tasks)) {
        totalTasks += user.tasks.length
        completedTasks += user.tasks.filter((task: any) => task.completed).length
      }
    })

    // Calculate users by role
    const usersByRole: Record<string, number> = {}
    usersData.forEach((user: any) => {
      if (usersByRole[user.role]) {
        usersByRole[user.role]++
      } else {
        usersByRole[user.role] = 1
      }
    })

    // Calculate active users (users who logged in within the last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const recentLoginActivities = activityLog
      .filter((activity: any) => activity.type === "user_login")
      .reduce((acc: Record<string, any>, activity: any) => {
        // Keep only the most recent login for each user
        if (!acc[activity.userId] || new Date(activity.timestamp) > new Date(acc[activity.userId].timestamp)) {
          acc[activity.userId] = activity
        }
        return acc
      }, {})

    const activeUsers = Object.values(recentLoginActivities).filter(
      (activity: any) => new Date(activity.timestamp) > sevenDaysAgo,
    ).length

    setStats({
      totalUsers: usersData.length,
      activeUsers,
      totalTasks,
      completedTasks,
      totalStories: stories.length,
      totalCharacters: characters.length,
      recentActivities: activityLog.slice(0, 5),
      usersByRole,
    })
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Lädt...</div>
  }

  const isOwnerOrCoOwner = user.role === "owner" || user.role === "co-owner"
  const pendingApprovalCount = users.filter((u) => !u.approved && !u.banned).length

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <PointsDisplay points={user.points || 0} size="lg" showTrend />
            <Badge variant="outline" className="text-sm">
              {user?.role}
            </Badge>
          </div>
        </div>

        {/* Today's Tasks Alert */}
        {todaysTasks.length > 0 && (
          <Alert className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
            <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            <AlertTitle className="text-yellow-800 dark:text-yellow-300">Aufgaben für heute</AlertTitle>
            <AlertDescription className="text-yellow-700 dark:text-yellow-400">
              Du hast {todaysTasks.length} Aufgabe{todaysTasks.length !== 1 ? "n" : ""}, die heute fällig{" "}
              {todaysTasks.length !== 1 ? "sind" : "ist"}.
              <div className="mt-2 space-y-1">
                {todaysTasks.map((task) => (
                  <div key={task.id} className="flex items-center">
                    <span className="mr-2">•</span>
                    <span className="font-medium">{task.title}</span>
                    <Button
                      variant="link"
                      className="p-0 h-auto ml-2 text-yellow-600 dark:text-yellow-400"
                      onClick={() => router.push("/tasks")}
                    >
                      Ansehen
                    </Button>
                  </div>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {isOwnerOrCoOwner && (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Benutzer</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground mt-2">{stats.activeUsers} aktiv in den letzten 7 Tagen</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Aufgaben</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalTasks}</div>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Abschlussrate</span>
                      <span>
                        {stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%
                      </span>
                    </div>
                    <Progress
                      value={stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0}
                      className="h-1"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Inhalte</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalStories}</div>
                  <p className="text-xs text-muted-foreground mt-2">{stats.totalCharacters} Charaktere erstellt</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Benutzerverteilung</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(stats.usersByRole).map(([role, count]) => (
                      <div key={role} className="flex items-center justify-between">
                        <span className="text-sm capitalize">{role}</span>
                        <Badge variant="secondary">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="col-span-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ausstehende Freigaben</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {(() => {
                  return (
                    <>
                      <div className="text-2xl font-bold">{pendingApprovalCount}</div>
                      {pendingApprovalCount > 0 ? (
                        <Button
                          variant="link"
                          className="p-0 h-auto text-xs text-muted-foreground mt-2"
                          onClick={() => router.push("/admin/user-approval")}
                        >
                          Benutzer freigeben
                        </Button>
                      ) : (
                        <p className="text-xs text-muted-foreground mt-2">Keine ausstehenden Freigaben</p>
                      )}
                    </>
                  )
                })()}
              </CardContent>
            </Card>
          </>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Letzte Aktivitäten</CardTitle>
              <CardDescription>Neueste Aktionen im System</CardDescription>
            </CardHeader>
            <CardContent>
              {stats.recentActivities.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-4">
                      <div className="rounded-full h-8 w-8 bg-primary flex items-center justify-center text-primary-foreground">
                        {activity.type === "user_registered" ? (
                          <UserPlus className="h-4 w-4" />
                        ) : activity.type === "user_login" ? (
                          <Users className="h-4 w-4" />
                        ) : activity.type === "user_logout" ? (
                          <Users className="h-4 w-4" />
                        ) : (
                          <Activity className="h-4 w-4" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{activity.username}</p>
                        <p className="text-sm text-muted-foreground">
                          {activity.type === "user_registered"
                            ? "Registriert"
                            : activity.type === "user_login"
                              ? "Angemeldet"
                              : activity.type === "user_logout"
                                ? "Abgemeldet"
                                : activity.details}
                        </p>
                        <p className="text-xs text-muted-foreground">{new Date(activity.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Keine Aktivitäten gefunden.</p>
              )}
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Deine Aufgaben</CardTitle>
              <CardDescription>Dir zugewiesene Aufgaben</CardDescription>
            </CardHeader>
            <CardContent>
              {user?.tasks?.length > 0 ? (
                <div className="space-y-4">
                  {user.tasks
                    .filter((task: any) => !task.completed)
                    .slice(0, 5)
                    .map((task: any) => {
                      const isToday =
                        task.deadline &&
                        new Date(task.deadline).toISOString().split("T")[0] === new Date().toISOString().split("T")[0]

                      return (
                        <div
                          key={task.id}
                          className={`flex items-start space-x-4 p-2 rounded-md ${isToday ? "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800" : ""}`}
                        >
                          <div
                            className={`rounded-full h-2 w-2 mt-2 ${
                              task.priority === "high"
                                ? "bg-red-500"
                                : task.priority === "medium"
                                  ? "bg-yellow-500"
                                  : "bg-blue-500"
                            }`}
                          />
                          <div className="space-y-1 flex-1">
                            <div className="flex justify-between">
                              <p
                                className={`text-sm font-medium ${isToday ? "text-yellow-800 dark:text-yellow-300" : ""}`}
                              >
                                {task.title}
                                {isToday && (
                                  <span className="ml-2 text-xs bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-300 px-1.5 py-0.5 rounded-full">
                                    Heute
                                  </span>
                                )}
                              </p>
                              <Badge variant="outline" className="text-xs">
                                {task.priority}
                              </Badge>
                            </div>
                            <p
                              className={`text-xs flex items-center ${isToday ? "text-yellow-700 dark:text-yellow-400" : "text-muted-foreground"}`}
                            >
                              <Clock className="h-3 w-3 mr-1" />
                              Fällig: {new Date(task.deadline).toLocaleDateString()}
                            </p>
                            {task.checklist && task.checklist.length > 0 && (
                              <div className="mt-2">
                                <div className="flex justify-between text-xs mb-1">
                                  <span>Fortschritt</span>
                                  <span>
                                    {Math.round(
                                      (task.checklist.filter((item: any) => item.completed).length /
                                        task.checklist.length) *
                                        100,
                                    )}
                                    %
                                  </span>
                                </div>
                                <Progress
                                  value={
                                    (task.checklist.filter((item: any) => item.completed).length /
                                      task.checklist.length) *
                                    100
                                  }
                                  className="h-1"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">Dir wurden noch keine Aufgaben zugewiesen.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {isOwnerOrCoOwner && (
          <div className="grid gap-4 md:grid-cols-2">
            <ServerStatus />

            <Card>
              <CardHeader>
                <CardTitle>Systemstatus</CardTitle>
                <CardDescription>Übersicht über Systemzustand und Metriken</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Speichernutzung</h3>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>LocalStorage</span>
                      <span>
                        {Math.round((JSON.stringify(localStorage).length / (5 * 1024 * 1024)) * 100)}% von 5MB
                      </span>
                    </div>
                    <Progress value={(JSON.stringify(localStorage).length / (5 * 1024 * 1024)) * 100} className="h-1" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Benutzeraktivität</h3>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Aktive Benutzer</span>
                      <span>
                        {stats.activeUsers} von {stats.totalUsers} (
                        {stats.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0}%)
                      </span>
                    </div>
                    <Progress
                      value={stats.totalUsers > 0 ? (stats.activeUsers / stats.totalUsers) * 100 : 0}
                      className="h-1"
                    />
                  </div>
                </div>

                <Alert className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Systeminformation</AlertTitle>
                  <AlertDescription>
                    Diese Anwendung verwendet den Browser-LocalStorage für die Datenpersistenz. Die maximale
                    Speichergrenze beträgt 5MB. Regelmäßige Backups werden für die Datensicherheit empfohlen.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}


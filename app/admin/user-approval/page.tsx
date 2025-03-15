"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Check, User, X, Clock, Shield } from "lucide-react"
import { AnimatedContainer } from "@/components/animated-container"

interface User {
  id: string
  username: string
  role: string
  points: number
  permissions: string[]
  banned: boolean
  approved: boolean
  createdAt: string
}

export default function UserApprovalPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      router.push("/")
      return
    }

    const userData = JSON.parse(currentUser)
    setUser(userData)

    // Check if user has permission to approve users
    const hasPermission =
      userData.role === "owner" ||
      userData.role === "co-owner" ||
      (userData.permissions && userData.permissions.includes("manage_users"))

    if (!hasPermission) {
      toast({
        title: "Zugriff verweigert",
        description: "Du hast keine Berechtigung, diese Seite zu sehen.",
        variant: "destructive",
      })
      router.push("/dashboard")
      return
    }

    // Load users
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]")
    setUsers(allUsers)

    setLoading(false)
  }, [router, toast])

  const handleApproveUser = (userId: string) => {
    const updatedUsers = users.map((u) => {
      if (u.id === userId) {
        // Add notification
        const notifications = JSON.parse(localStorage.getItem("notifications") || "[]")
        notifications.push({
          id: Date.now().toString(),
          userId: u.id,
          type: "user_approved",
          message: "Dein Konto wurde freigegeben. Du kannst dich jetzt anmelden.",
          timestamp: new Date().toISOString(),
          read: false,
        })
        localStorage.setItem("notifications", JSON.stringify(notifications))

        return {
          ...u,
          approved: true,
        }
      }
      return u
    })

    localStorage.setItem("users", JSON.stringify(updatedUsers))
    setUsers(updatedUsers)

    // Add to activity log
    const activityLog = JSON.parse(localStorage.getItem("activityLog") || "[]")
    activityLog.unshift({
      id: Date.now().toString(),
      type: "user_approved",
      userId: user?.id || "",
      username: user?.username || "",
      timestamp: new Date().toISOString(),
      target: users.find((u) => u.id === userId)?.username,
      details: "Benutzer wurde freigegeben",
    })
    localStorage.setItem("activityLog", JSON.stringify(activityLog))

    toast({
      title: "Erfolg",
      description: "Benutzer wurde freigegeben.",
    })
  }

  const handleRejectUser = (userId: string) => {
    const updatedUsers = users.filter((u) => u.id !== userId)
    localStorage.setItem("users", JSON.stringify(updatedUsers))
    setUsers(updatedUsers)

    // Add to activity log
    const activityLog = JSON.parse(localStorage.getItem("activityLog") || "[]")
    activityLog.unshift({
      id: Date.now().toString(),
      type: "user_rejected",
      userId: user?.id || "",
      username: user?.username || "",
      timestamp: new Date().toISOString(),
      target: users.find((u) => u.id === userId)?.username,
      details: "Benutzeranmeldung wurde abgelehnt",
    })
    localStorage.setItem("activityLog", JSON.stringify(activityLog))

    toast({
      title: "Erfolg",
      description: "Benutzeranmeldung wurde abgelehnt.",
    })
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Lade Benutzerdaten...</p>
        </div>
      </div>
    )
  }

  const pendingUsers = users.filter((u) => !u.approved && !u.banned)
  const approvedUsers = users.filter((u) => u.approved && !u.banned)

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <AnimatedContainer>
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Benutzerfreigabe</h2>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-sm">
                {user?.role}
              </Badge>
            </div>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Ausstehende Freigaben</CardTitle>
              <CardDescription>Neue Benutzer, die auf Freigabe warten</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingUsers.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Benutzer</TableHead>
                        <TableHead>Registriert am</TableHead>
                        <TableHead>Aktionen</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingUsers.map((u) => (
                        <TableRow key={u.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span>{u.username}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{new Date(u.createdAt).toLocaleString()}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" onClick={() => handleApproveUser(u.id)}>
                                <Check className="mr-2 h-4 w-4" />
                                Freigeben
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => handleRejectUser(u.id)}>
                                <X className="mr-2 h-4 w-4" />
                                Ablehnen
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-10">
                  <Check className="mx-auto h-10 w-10 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">Keine ausstehenden Freigaben</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Es gibt derzeit keine Benutzer, die auf Freigabe warten.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Freigegebene Benutzer</CardTitle>
              <CardDescription>Benutzer, die bereits freigegeben wurden</CardDescription>
            </CardHeader>
            <CardContent>
              {approvedUsers.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Benutzer</TableHead>
                        <TableHead>Rolle</TableHead>
                        <TableHead>Registriert am</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {approvedUsers.map((u) => (
                        <TableRow key={u.id}>
                          <TableCell className="font-medium">{u.username}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Shield className="h-4 w-4 text-muted-foreground" />
                              <Badge variant="outline">{u.role}</Badge>
                            </div>
                          </TableCell>
                          <TableCell>{new Date(u.createdAt).toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant="default">Freigegeben</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-10">
                  <User className="mx-auto h-10 w-10 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">Keine freigegebenen Benutzer</h3>
                  <p className="mt-2 text-sm text-muted-foreground">Es wurden noch keine Benutzer freigegeben.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </AnimatedContainer>
      </div>
    </div>
  )
}


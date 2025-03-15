"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Check, Search, TrendingDown, User, X, Filter, Bell, Info } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AnimatedContainer } from "@/components/animated-container"

interface PointDeductionRequest {
  id: string
  userId: string
  requestedBy: string
  requestedAt: string
  reason: string
  violationType: string
  points: number
  status: "pending" | "approved" | "rejected"
  reviewedBy?: string
  reviewedAt?: string
  reviewNotes?: string
}

interface Violation {
  id: string
  name: string
  pointsDeduction: number
  description?: string
}

interface UserType {
  id: string
  username: string
  role: string
  points: number
  permissions: string[]
  banned: boolean
  approved: boolean
  pointsHistory: {
    amount: number
    reason: string
    timestamp: string
    awardedBy: string
  }[]
}

export default function PointsManagementPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<UserType | null>(null)
  const [users, setUsers] = useState<UserType[]>([])
  const [violations, setViolations] = useState<Violation[]>([])
  const [pointRequests, setPointRequests] = useState<PointDeductionRequest[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // New point deduction request state
  const [selectedUser, setSelectedUser] = useState<string>("")
  const [selectedViolation, setSelectedViolation] = useState<string>("")
  const [customReason, setCustomReason] = useState<string>("")
  const [customPoints, setCustomPoints] = useState<number>(0)
  const [requestDialogOpen, setRequestDialogOpen] = useState(false)

  // Review request state
  const [selectedRequest, setSelectedRequest] = useState<PointDeductionRequest | null>(null)
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [reviewNotes, setReviewNotes] = useState<string>("")

  useEffect(() => {
    // Check if user is logged in
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      router.push("/")
      return
    }

    const userData = JSON.parse(currentUser)
    setUser(userData)

    // Check if user has permission to view this page
    const hasPermission =
      userData.role === "owner" ||
      userData.role === "co-owner" ||
      (userData.permissions &&
        (userData.permissions.includes("manage_points") || userData.permissions.includes("suggest_points")))

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

    // Load violations
    const allViolations = JSON.parse(localStorage.getItem("violations") || "[]")
    setViolations(allViolations)

    // Load point deduction requests
    const allRequests = JSON.parse(localStorage.getItem("pointDeductionRequests") || "[]")
    setPointRequests(allRequests)

    setLoading(false)
  }, [router, toast])

  const canApproveRequests =
    user &&
    (user.role === "owner" ||
      user.role === "co-owner" ||
      (user.permissions && user.permissions.includes("manage_points")))

  const canDirectlyDeductPoints = user && (user.role === "owner" || user.role === "co-owner")

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredRequests = pointRequests.filter((request) => {
    const matchesSearch =
      users
        .find((u) => u.id === request.userId)
        ?.username.toLowerCase()
        .includes(searchQuery.toLowerCase()) || request.reason.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || request.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleCreateRequest = () => {
    if (!selectedUser || (!selectedViolation && !customReason)) {
      toast({
        title: "Fehler",
        description: "Bitte wähle einen Benutzer und gib einen Grund an.",
        variant: "destructive",
      })
      return
    }

    const points = selectedViolation
      ? violations.find((v) => v.id === selectedViolation)?.pointsDeduction || 0
      : customPoints

    if (points <= 0) {
      toast({
        title: "Fehler",
        description: "Die Punktzahl muss größer als 0 sein.",
        variant: "destructive",
      })
      return
    }

    const reason = selectedViolation ? violations.find((v) => v.id === selectedViolation)?.name || "" : customReason

    const newRequest: PointDeductionRequest = {
      id: Date.now().toString(),
      userId: selectedUser,
      requestedBy: user?.id || "",
      requestedAt: new Date().toISOString(),
      reason,
      violationType: selectedViolation,
      points,
      status: canDirectlyDeductPoints ? "approved" : "pending",
    }

    if (canDirectlyDeductPoints) {
      newRequest.reviewedBy = user?.id
      newRequest.reviewedAt = new Date().toISOString()

      // Directly deduct points if user is owner or co-owner
      const updatedUsers = users.map((u) => {
        if (u.id === selectedUser) {
          // Add to points history
          const pointsHistory = [
            {
              amount: -points,
              reason,
              timestamp: new Date().toISOString(),
              awardedBy: user?.username || "System",
            },
            ...(u.pointsHistory || []),
          ]

          // Update points
          const newPoints = Math.max(0, (u.points || 0) - points)

          // Add notification
          const notifications = JSON.parse(localStorage.getItem("notifications") || "[]")
          notifications.push({
            id: Date.now().toString(),
            userId: u.id,
            type: "point_deduction",
            message: `Dir wurden ${points} Punkte abgezogen. Grund: ${reason}`,
            timestamp: new Date().toISOString(),
            read: false,
          })
          localStorage.setItem("notifications", JSON.stringify(notifications))

          return {
            ...u,
            points: newPoints,
            pointsHistory,
          }
        }
        return u
      })

      localStorage.setItem("users", JSON.stringify(updatedUsers))
      setUsers(updatedUsers)

      // Check if user should be demoted
      checkForDemotion(selectedUser)
    }

    // Save the request
    const updatedRequests = [...pointRequests, newRequest]
    localStorage.setItem("pointDeductionRequests", JSON.stringify(updatedRequests))
    setPointRequests(updatedRequests)

    // Add to activity log
    const activityLog = JSON.parse(localStorage.getItem("activityLog") || "[]")
    activityLog.unshift({
      id: Date.now().toString(),
      type: canDirectlyDeductPoints ? "points_deducted" : "point_deduction_requested",
      userId: user?.id || "",
      username: user?.username || "",
      timestamp: new Date().toISOString(),
      target: users.find((u) => u.id === selectedUser)?.username,
      details: canDirectlyDeductPoints
        ? `Punkte abgezogen: ${points} für ${reason}`
        : `Punktabzug vorgeschlagen: ${points} für ${reason}`,
    })
    localStorage.setItem("activityLog", JSON.stringify(activityLog))

    // Reset form and close dialog
    setSelectedUser("")
    setSelectedViolation("")
    setCustomReason("")
    setCustomPoints(0)
    setRequestDialogOpen(false)

    toast({
      title: "Erfolg",
      description: canDirectlyDeductPoints
        ? "Punkte wurden abgezogen."
        : "Dein Vorschlag wurde zur Überprüfung eingereicht.",
    })
  }

  const handleReviewRequest = (approved: boolean) => {
    if (!selectedRequest) return

    const updatedRequests = pointRequests.map((request) => {
      if (request.id === selectedRequest.id) {
        return {
          ...request,
          status: approved ? "approved" : "rejected",
          reviewedBy: user?.id,
          reviewedAt: new Date().toISOString(),
          reviewNotes,
        }
      }
      return request
    })

    localStorage.setItem("pointDeductionRequests", JSON.stringify(updatedRequests))
    setPointRequests(updatedRequests)

    if (approved) {
      // Deduct points from user
      const updatedUsers = users.map((u) => {
        if (u.id === selectedRequest.userId) {
          // Add to points history
          const pointsHistory = [
            {
              amount: -selectedRequest.points,
              reason: selectedRequest.reason,
              timestamp: new Date().toISOString(),
              awardedBy: user?.username || "System",
            },
            ...(u.pointsHistory || []),
          ]

          // Update points
          const newPoints = Math.max(0, (u.points || 0) - selectedRequest.points)

          // Add notification
          const notifications = JSON.parse(localStorage.getItem("notifications") || "[]")
          notifications.push({
            id: Date.now().toString(),
            userId: u.id,
            type: "point_deduction",
            message: `Dir wurden ${selectedRequest.points} Punkte abgezogen. Grund: ${selectedRequest.reason}`,
            timestamp: new Date().toISOString(),
            read: false,
          })
          localStorage.setItem("notifications", JSON.stringify(notifications))

          return {
            ...u,
            points: newPoints,
            pointsHistory,
          }
        }
        return u
      })

      localStorage.setItem("users", JSON.stringify(updatedUsers))
      setUsers(updatedUsers)

      // Check if user should be demoted
      checkForDemotion(selectedRequest.userId)
    } else {
      // Notify the requester that their request was rejected
      const notifications = JSON.parse(localStorage.getItem("notifications") || "[]")
      notifications.push({
        id: Date.now().toString(),
        userId: selectedRequest.requestedBy,
        type: "request_rejected",
        message: `Dein Vorschlag für Punktabzug wurde abgelehnt. Grund: ${reviewNotes || "Keine Angabe"}`,
        timestamp: new Date().toISOString(),
        read: false,
      })
      localStorage.setItem("notifications", JSON.stringify(notifications))
    }

    // Add to activity log
    const activityLog = JSON.parse(localStorage.getItem("activityLog") || "[]")
    activityLog.unshift({
      id: Date.now().toString(),
      type: approved ? "point_deduction_approved" : "point_deduction_rejected",
      userId: user?.id || "",
      username: user?.username || "",
      timestamp: new Date().toISOString(),
      target: users.find((u) => u.id === selectedRequest.userId)?.username,
      details: approved
        ? `Punktabzug genehmigt: ${selectedRequest.points} für ${selectedRequest.reason}`
        : `Punktabzug abgelehnt: ${selectedRequest.points} für ${selectedRequest.reason}`,
    })
    localStorage.setItem("activityLog", JSON.stringify(activityLog))

    // Reset form and close dialog
    setSelectedRequest(null)
    setReviewNotes("")
    setReviewDialogOpen(false)

    toast({
      title: "Erfolg",
      description: approved ? "Punktabzug wurde genehmigt." : "Punktabzug wurde abgelehnt.",
    })
  }

  const checkForDemotion = (userId: string) => {
    const targetUser = users.find((u) => u.id === userId)
    if (!targetUser) return

    // Get roles sorted by point threshold
    const roles = JSON.parse(localStorage.getItem("roles") || "[]")
    const sortedRoles = [...roles].sort((a, b) => b.pointThreshold - a.pointThreshold)

    // Find current role
    const currentRole = roles.find((r) => r.id === targetUser.role)
    if (!currentRole || currentRole.id === "owner") return // Owner can't be demoted

    // Find appropriate role based on points
    const newRole = sortedRoles.find((r) => targetUser.points >= r.pointThreshold && r.id !== "owner")

    if (newRole && newRole.id !== currentRole.id) {
      // User should be demoted
      const updatedUsers = users.map((u) => {
        if (u.id === userId) {
          // Add notification
          const notifications = JSON.parse(localStorage.getItem("notifications") || "[]")
          notifications.push({
            id: Date.now().toString(),
            userId: u.id,
            type: "role_change",
            message: `Du wurdest von ${currentRole.name} zu ${newRole.name} herabgestuft aufgrund deiner Punktzahl.`,
            timestamp: new Date().toISOString(),
            read: false,
          })
          localStorage.setItem("notifications", JSON.stringify(notifications))

          return {
            ...u,
            role: newRole.id,
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
        type: "user_demoted",
        userId: "system",
        username: "System",
        timestamp: new Date().toISOString(),
        target: targetUser.username,
        details: `Benutzer wurde von ${currentRole.name} zu ${newRole.name} herabgestuft aufgrund der Punktzahl.`,
      })
      localStorage.setItem("activityLog", JSON.stringify(activityLog))
    }
  }

  const getUserName = (userId: string) => {
    return users.find((u) => u.id === userId)?.username || "Unbekannter Benutzer"
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

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <AnimatedContainer>
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Punkteverwaltung</h2>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-sm">
                {user?.role}
              </Badge>
            </div>
          </div>

          <Tabs defaultValue="requests" className="mt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="requests">
                <Bell className="mr-2 h-4 w-4" />
                Punktabzugsanträge
              </TabsTrigger>
              <TabsTrigger value="users">
                <User className="mr-2 h-4 w-4" />
                Benutzer
              </TabsTrigger>
            </TabsList>

            <TabsContent value="requests" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Punktabzugsanträge</CardTitle>
                      <CardDescription>Verwalte Anträge für Punktabzüge</CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Suchen..."
                          className="pl-8 w-[200px]"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[150px]">
                          <Filter className="mr-2 h-4 w-4" />
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Alle Status</SelectItem>
                          <SelectItem value="pending">Ausstehend</SelectItem>
                          <SelectItem value="approved">Genehmigt</SelectItem>
                          <SelectItem value="rejected">Abgelehnt</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button onClick={() => setRequestDialogOpen(true)}>
                        <TrendingDown className="mr-2 h-4 w-4" />
                        Neuer Antrag
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {filteredRequests.length > 0 ? (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Benutzer</TableHead>
                            <TableHead>Grund</TableHead>
                            <TableHead>Punkte</TableHead>
                            <TableHead>Beantragt von</TableHead>
                            <TableHead>Datum</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Aktionen</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredRequests.map((request) => (
                            <TableRow key={request.id}>
                              <TableCell className="font-medium">{getUserName(request.userId)}</TableCell>
                              <TableCell>{request.reason}</TableCell>
                              <TableCell>-{request.points}</TableCell>
                              <TableCell>{getUserName(request.requestedBy)}</TableCell>
                              <TableCell>{new Date(request.requestedAt).toLocaleString()}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    request.status === "approved"
                                      ? "default"
                                      : request.status === "rejected"
                                        ? "destructive"
                                        : "outline"
                                  }
                                >
                                  {request.status === "approved"
                                    ? "Genehmigt"
                                    : request.status === "rejected"
                                      ? "Abgelehnt"
                                      : "Ausstehend"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {request.status === "pending" && canApproveRequests && (
                                  <div className="flex space-x-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        setSelectedRequest(request)
                                        setReviewDialogOpen(true)
                                      }}
                                    >
                                      <Info className="mr-2 h-4 w-4" />
                                      Prüfen
                                    </Button>
                                  </div>
                                )}
                                {request.status !== "pending" && (
                                  <div className="text-xs text-muted-foreground">
                                    {request.reviewedBy && (
                                      <span>
                                        Geprüft von {getUserName(request.reviewedBy)} am{" "}
                                        {new Date(request.reviewedAt || "").toLocaleString()}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <Bell className="mx-auto h-10 w-10 text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-medium">Keine Anträge gefunden</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {searchQuery || statusFilter !== "all"
                          ? "Keine Anträge entsprechen deinen Filterkriterien."
                          : "Es gibt derzeit keine Punktabzugsanträge."}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Benutzer</CardTitle>
                      <CardDescription>Verwalte Benutzerpunkte</CardDescription>
                    </div>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Suchen..."
                        className="pl-8 w-[200px]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {filteredUsers.length > 0 ? (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Benutzer</TableHead>
                            <TableHead>Rolle</TableHead>
                            <TableHead>Punkte</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Aktionen</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredUsers.map((u) => (
                            <TableRow key={u.id}>
                              <TableCell className="font-medium">{u.username}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{u.role}</Badge>
                              </TableCell>
                              <TableCell>{u.points || 0}</TableCell>
                              <TableCell>
                                {u.banned ? (
                                  <Badge variant="destructive">Gesperrt</Badge>
                                ) : !u.approved ? (
                                  <Badge variant="outline">Nicht freigegeben</Badge>
                                ) : (
                                  <Badge variant="default">Aktiv</Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedUser(u.id)
                                    setRequestDialogOpen(true)
                                  }}
                                  disabled={u.role === "owner" && user?.role !== "owner"}
                                >
                                  <TrendingDown className="mr-2 h-4 w-4" />
                                  Punkte abziehen
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <User className="mx-auto h-10 w-10 text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-medium">Keine Benutzer gefunden</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {searchQuery
                          ? "Keine Benutzer entsprechen deiner Suche."
                          : "Es gibt derzeit keine Benutzer im System."}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </AnimatedContainer>
      </div>

      {/* Point Deduction Request Dialog */}
      <Dialog open={requestDialogOpen} onOpenChange={setRequestDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Punktabzug beantragen</DialogTitle>
            <DialogDescription>
              {canDirectlyDeductPoints
                ? "Als Owner/Co-Owner kannst du direkt Punkte abziehen."
                : "Dein Antrag wird von einem Administrator geprüft."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {!selectedUser && (
              <div className="grid gap-2">
                <Label htmlFor="user">Benutzer</Label>
                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger id="user">
                    <SelectValue placeholder="Benutzer auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {users
                      .filter((u) => u.id !== user?.id && u.role !== "owner" && !u.banned)
                      .map((u) => (
                        <SelectItem key={u.id} value={u.id}>
                          {u.username} ({u.role})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="violation">Regelverstoß</Label>
              <Select
                value={selectedViolation}
                onValueChange={(value) => {
                  setSelectedViolation(value)
                  if (value) {
                    setCustomReason("")
                    setCustomPoints(0)
                  }
                }}
              >
                <SelectTrigger id="violation">
                  <SelectValue placeholder="Regelverstoß auswählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="custom">Benutzerdefiniert</SelectItem>
                  {violations.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.name} (-{v.pointsDeduction} Punkte)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {!selectedViolation && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="reason">Grund</Label>
                  <Textarea
                    id="reason"
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder="Grund für den Punktabzug"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="points">Punkte</Label>
                  <Input
                    id="points"
                    type="number"
                    value={customPoints}
                    onChange={(e) => setCustomPoints(Number(e.target.value))}
                    min="1"
                    placeholder="Anzahl der abzuziehenden Punkte"
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRequestDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleCreateRequest}>
              {canDirectlyDeductPoints ? "Punkte abziehen" : "Antrag einreichen"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Review Request Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Punktabzugsantrag prüfen</DialogTitle>
            <DialogDescription>
              Prüfe den Antrag und entscheide, ob die Punkte abgezogen werden sollen.
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">Benutzer</Label>
                  <p className="font-medium">{getUserName(selectedRequest.userId)}</p>
                </div>
                <div>
                  <Label className="text-sm">Beantragt von</Label>
                  <p className="font-medium">{getUserName(selectedRequest.requestedBy)}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm">Grund</Label>
                <p className="font-medium">{selectedRequest.reason}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">Punkte</Label>
                  <p className="font-medium text-destructive">-{selectedRequest.points}</p>
                </div>
                <div>
                  <Label className="text-sm">Datum</Label>
                  <p className="font-medium">{new Date(selectedRequest.requestedAt).toLocaleString()}</p>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="notes">Anmerkungen</Label>
                <Textarea
                  id="notes"
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Anmerkungen zur Entscheidung (optional)"
                />
              </div>
            </div>
          )}
          <DialogFooter className="flex justify-between">
            <Button variant="destructive" onClick={() => handleReviewRequest(false)}>
              <X className="mr-2 h-4 w-4" />
              Ablehnen
            </Button>
            <Button onClick={() => handleReviewRequest(true)}>
              <Check className="mr-2 h-4 w-4" />
              Genehmigen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


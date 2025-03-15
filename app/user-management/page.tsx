"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Ban, CheckCircle2, Clock, Search, Shield, User, AlertTriangle, Calendar, History, Info } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { getUsers, getRoles, getUserById, addActivityLogEntry, userHasPermission } from "@/lib/store"
import type { User as UserType, Role, UserInteraction } from "@/lib/types"

export default function UserManagementPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [currentUser, setCurrentUser] = useState<UserType | null>(null)
  const [users, setUsers] = useState<UserType[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null)
  const [interactionDialogOpen, setInteractionDialogOpen] = useState(false)
  const [interactionType, setInteractionType] = useState<"warning" | "point_deduction" | "ban">("warning")
  const [interactionReason, setInteractionReason] = useState("")
  const [pointsToDeduct, setPointsToDeduct] = useState(0)
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false)
  const [roleExpirationDate, setRoleExpirationDate] = useState("")

  useEffect(() => {
    // Check if user is logged in and has admin permissions
    const currentUserData = localStorage.getItem("currentUser")
    if (!currentUserData) {
      router.push("/")
      return
    }

    const userData = JSON.parse(currentUserData) as UserType
    setCurrentUser(userData)

    // Check if user has permission to manage users
    if (!userHasPermission(userData.id, "manage_users")) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      })
      router.push("/dashboard")
      return
    }

    // Get all users and roles
    setUsers(getUsers())
    setRoles(getRoles())

    // Set default expiration date to 30 days from now
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
    setRoleExpirationDate(thirtyDaysFromNow.toISOString().split("T")[0])

    setLoading(false)
  }, [router, toast])

  const handleRoleChange = (userId: string, newRoleId: string, isTemporary = false) => {
    if (!currentUser) return

    const targetUser = users.find((u) => u.id === userId)
    if (!targetUser) return

    // Check if current user has permission to assign this role
    const newRole = roles.find((r) => r.id === newRoleId)
    if (!newRole) return

    // Only owners can assign owner role
    if (newRoleId === "owner" && currentUser.role !== "owner") {
      toast({
        title: "Permission Denied",
        description: "Only owners can assign the owner role.",
        variant: "destructive",
      })
      return
    }

    const updatedUser = { ...targetUser, role: newRoleId }

    // Handle role expiration if temporary
    if (isTemporary && newRole.isTemporary) {
      const expirationDate = new Date(roleExpirationDate)

      // Add to role expirations
      updatedUser.roleExpirations = [
        ...(updatedUser.roleExpirations || []),
        {
          roleId: newRoleId,
          expiresAt: expirationDate.toISOString(),
          assignedAt: new Date().toISOString(),
          assignedBy: currentUser.id,
        },
      ]
    }

    // Add to interaction history
    const interaction: UserInteraction = {
      id: Date.now().toString(),
      type: "role_change",
      timestamp: new Date().toISOString(),
      reason: isTemporary
        ? `Role changed to ${newRoleId} (temporary until ${new Date(roleExpirationDate).toLocaleDateString()})`
        : `Role changed to ${newRoleId}`,
      performedBy: currentUser.id,
      details: `Previous role: ${targetUser.role}`,
    }

    updatedUser.interactionHistory = [interaction, ...(updatedUser.interactionHistory || [])]

    // Update user
    const updatedUsers = users.map((u) => (u.id === userId ? updatedUser : u))
    setUsers(updatedUsers)
    localStorage.setItem("users", JSON.stringify(updatedUsers))

    // If current user is changing their own role
    if (currentUser.id === userId) {
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))
      setCurrentUser(updatedUser)
    }

    // Add to activity log
    addActivityLogEntry({
      id: Date.now().toString(),
      type: "role_changed",
      userId: currentUser.id,
      username: currentUser.username,
      target: targetUser.username,
      timestamp: new Date().toISOString(),
      details: `Changed role to ${newRoleId}${isTemporary ? " (temporary)" : ""}`,
    })

    toast({
      title: "Success",
      description: `Role of ${targetUser.username} has been changed to ${newRoleId}.`,
    })
  }

  const handleAddInteraction = () => {
    if (!currentUser || !selectedUser) return

    if (!interactionReason) {
      toast({
        title: "Error",
        description: "Please provide a reason for this action.",
        variant: "destructive",
      })
      return
    }

    if (interactionType === "point_deduction" && pointsToDeduct <= 0) {
      toast({
        title: "Error",
        description: "Please specify a valid number of points to deduct.",
        variant: "destructive",
      })
      return
    }

    // Create the interaction
    const interaction: UserInteraction = {
      id: Date.now().toString(),
      type: interactionType,
      timestamp: new Date().toISOString(),
      reason: interactionReason,
      performedBy: currentUser.id,
      details: interactionType === "point_deduction" ? `Deducted ${pointsToDeduct} points` : undefined,
      points: interactionType === "point_deduction" ? pointsToDeduct : undefined,
    }

    // Update the user
    const updatedUser = { ...selectedUser }

    // Add to interaction history
    updatedUser.interactionHistory = [interaction, ...(updatedUser.interactionHistory || [])]

    // Handle specific interaction types
    if (interactionType === "point_deduction") {
      // Deduct points
      const currentPoints = updatedUser.points || 0
      updatedUser.points = Math.max(0, currentPoints - pointsToDeduct)

      // Add to points history
      updatedUser.pointsHistory = [
        {
          amount: -pointsToDeduct,
          reason: interactionReason,
          timestamp: new Date().toISOString(),
          awardedBy: currentUser.username,
        },
        ...(updatedUser.pointsHistory || []),
      ]
    } else if (interactionType === "ban") {
      // Ban the user
      updatedUser.banned = true
    }

    // Update user in state and localStorage
    const updatedUsers = users.map((u) => (u.id === selectedUser.id ? updatedUser : u))
    setUsers(updatedUsers)
    localStorage.setItem("users", JSON.stringify(updatedUsers))

    // Add to activity log
    addActivityLogEntry({
      id: Date.now().toString(),
      type: `user_${interactionType}`,
      userId: currentUser.id,
      username: currentUser.username,
      target: selectedUser.username,
      timestamp: new Date().toISOString(),
      details:
        interactionType === "point_deduction"
          ? `Deducted ${pointsToDeduct} points: ${interactionReason}`
          : interactionType === "ban"
            ? `Banned user: ${interactionReason}`
            : `Warning: ${interactionReason}`,
    })

    // Reset form and close dialog
    setInteractionType("warning")
    setInteractionReason("")
    setPointsToDeduct(0)
    setInteractionDialogOpen(false)

    toast({
      title: "Success",
      description: `Action has been recorded for ${selectedUser.username}.`,
    })
  }

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-sm">
              {currentUser?.role}
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="users">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users">
              <User className="mr-2 h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="roles">
              <Shield className="mr-2 h-4 w-4" />
              Roles
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage users, roles, and interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      className="pl-8 w-[300px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Username</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Points</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Role Expires</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((u) => {
                        // Find role expiration if any
                        const roleExpiration = u.roleExpirations?.find((exp) => exp.roleId === u.role)
                        const roleExpiresAt = roleExpiration ? new Date(roleExpiration.expiresAt) : null

                        return (
                          <TableRow key={u.id}>
                            <TableCell className="font-medium">{u.username}</TableCell>
                            <TableCell>
                              {userHasPermission(currentUser?.id || "", "assign_roles") ? (
                                <div className="flex items-center space-x-2">
                                  <Select
                                    value={u.role}
                                    onValueChange={(value) => handleRoleChange(u.id, value)}
                                    disabled={u.role === "owner" && currentUser?.role !== "owner"}
                                  >
                                    <SelectTrigger className="w-[130px]">
                                      <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {roles.map((role) => (
                                        <SelectItem
                                          key={role.id}
                                          value={role.id}
                                          disabled={role.id === "owner" && currentUser?.role !== "owner"}
                                        >
                                          {role.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>

                                  {roles.find((r) => r.id === u.role)?.isTemporary && (
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <Button variant="outline" size="sm">
                                          <Clock className="h-4 w-4" />
                                        </Button>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-80">
                                        <div className="space-y-2">
                                          <h4 className="font-medium">Set Role Expiration</h4>
                                          <div className="space-y-1">
                                            <label className="text-sm">Expiration Date</label>
                                            <Input
                                              type="date"
                                              value={roleExpirationDate}
                                              onChange={(e) => setRoleExpirationDate(e.target.value)}
                                              min={new Date().toISOString().split("T")[0]}
                                            />
                                          </div>
                                          <Button size="sm" onClick={() => handleRoleChange(u.id, u.role, true)}>
                                            Set Expiration
                                          </Button>
                                        </div>
                                      </PopoverContent>
                                    </Popover>
                                  )}
                                </div>
                              ) : (
                                <Badge variant="outline">{roles.find((r) => r.id === u.role)?.name || u.role}</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <span>{u.points || 0}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {u.banned ? (
                                <Badge variant="destructive">Banned</Badge>
                              ) : (
                                <Badge variant="default">Active</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {roleExpiresAt ? (
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                                  <span className="text-sm">{roleExpiresAt.toLocaleDateString()}</span>
                                </div>
                              ) : (
                                <span className="text-sm text-muted-foreground">Never</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedUser(u)
                                    setHistoryDialogOpen(true)
                                  }}
                                >
                                  <History className="h-4 w-4 mr-1" />
                                  History
                                </Button>

                                {userHasPermission(currentUser?.id || "", "manage_users") && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedUser(u)
                                      setInteractionDialogOpen(true)
                                    }}
                                    disabled={u.role === "owner" && currentUser?.role !== "owner"}
                                  >
                                    <AlertTriangle className="h-4 w-4 mr-1" />
                                    Action
                                  </Button>
                                )}

                                {userHasPermission(currentUser?.id || "", "ban_users") && !u.banned && (
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedUser(u)
                                      setInteractionType("ban")
                                      setInteractionDialogOpen(true)
                                    }}
                                    disabled={u.role === "owner"}
                                  >
                                    <Ban className="h-4 w-4 mr-1" />
                                    Ban
                                  </Button>
                                )}

                                {userHasPermission(currentUser?.id || "", "ban_users") && u.banned && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      // Unban user
                                      const updatedUser = { ...u, banned: false }
                                      const updatedUsers = users.map((user) => (user.id === u.id ? updatedUser : user))
                                      setUsers(updatedUsers)
                                      localStorage.setItem("users", JSON.stringify(updatedUsers))

                                      // Add to activity log
                                      addActivityLogEntry({
                                        id: Date.now().toString(),
                                        type: "user_unbanned",
                                        userId: currentUser?.id || "",
                                        username: currentUser?.username || "",
                                        target: u.username,
                                        timestamp: new Date().toISOString(),
                                        details: "User unbanned",
                                      })

                                      toast({
                                        title: "Success",
                                        description: `${u.username} has been unbanned.`,
                                      })
                                    }}
                                  >
                                    <CheckCircle2 className="h-4 w-4 mr-1" />
                                    Unban
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roles" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Role Management</CardTitle>
                <CardDescription>View role details and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Role</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Point Threshold</TableHead>
                        <TableHead>Temporary</TableHead>
                        <TableHead>Permissions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {roles.map((role) => (
                        <TableRow key={role.id}>
                          <TableCell className="font-medium">{role.name}</TableCell>
                          <TableCell>{role.description}</TableCell>
                          <TableCell>
                            {role.pointThreshold === Number.POSITIVE_INFINITY ? "∞" : role.pointThreshold}
                          </TableCell>
                          <TableCell>
                            {role.isTemporary ? (
                              <Badge variant="default">Yes</Badge>
                            ) : (
                              <Badge variant="outline">No</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {(role.permissions || []).map((permission: string) => (
                                <Badge key={permission} variant="outline">
                                  {permission}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* User Interaction Dialog */}
      <Dialog open={interactionDialogOpen} onOpenChange={setInteractionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Action</DialogTitle>
            <DialogDescription>Record an action for user {selectedUser?.username}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <label className="text-sm font-medium">Action Type</label>
              <Select
                value={interactionType}
                onValueChange={(value: "warning" | "point_deduction" | "ban") => setInteractionType(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select action type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="point_deduction">Point Deduction</SelectItem>
                  <SelectItem value="ban">Ban User</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {interactionType === "point_deduction" && (
              <div>
                <label className="text-sm font-medium">Points to Deduct</label>
                <Input
                  type="number"
                  value={pointsToDeduct}
                  onChange={(e) => setPointsToDeduct(Number.parseInt(e.target.value) || 0)}
                  min="1"
                />
              </div>
            )}

            <div>
              <label className="text-sm font-medium">Reason</label>
              <Input
                value={interactionReason}
                onChange={(e) => setInteractionReason(e.target.value)}
                placeholder="Provide a reason for this action"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInteractionDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddInteraction} variant={interactionType === "ban" ? "destructive" : "default"}>
              {interactionType === "warning"
                ? "Issue Warning"
                : interactionType === "point_deduction"
                  ? "Deduct Points"
                  : "Ban User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User History Dialog */}
      <Dialog open={historyDialogOpen} onOpenChange={setHistoryDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>User History</DialogTitle>
            <DialogDescription>Interaction history for {selectedUser?.username}</DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="interactions">
            <TabsList>
              <TabsTrigger value="interactions">Interactions</TabsTrigger>
              <TabsTrigger value="points">Points History</TabsTrigger>
              <TabsTrigger value="roles">Role Changes</TabsTrigger>
            </TabsList>
            <TabsContent value="interactions" className="max-h-[60vh] overflow-auto">
              {selectedUser?.interactionHistory && selectedUser.interactionHistory.length > 0 ? (
                <div className="space-y-4 py-4">
                  {selectedUser.interactionHistory
                    .filter((interaction) => interaction.type !== "role_change")
                    .map((interaction, index) => (
                      <div key={index} className="flex items-start space-x-4 border-b pb-4 last:border-0">
                        <div
                          className={`rounded-full h-8 w-8 flex items-center justify-center 
                          ${
                            interaction.type === "warning"
                              ? "bg-yellow-500"
                              : interaction.type === "point_deduction"
                                ? "bg-red-500"
                                : "bg-destructive"
                          } text-white`}
                        >
                          {interaction.type === "warning" ? "!" : interaction.type === "point_deduction" ? "-" : "X"}
                        </div>
                        <div className="space-y-1 flex-1">
                          <div className="flex justify-between">
                            <p className="text-sm font-medium">
                              {interaction.type === "warning"
                                ? "Warning"
                                : interaction.type === "point_deduction"
                                  ? "Point Deduction"
                                  : "Ban"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(interaction.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <p className="text-sm">{interaction.reason}</p>
                          {interaction.details && (
                            <p className="text-xs text-muted-foreground">{interaction.details}</p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            By: {getUserById(interaction.performedBy)?.username || "System"}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <Info className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">No interaction history found</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="points" className="max-h-[60vh] overflow-auto">
              {selectedUser?.pointsHistory && selectedUser.pointsHistory.length > 0 ? (
                <div className="space-y-4 py-4">
                  {selectedUser.pointsHistory.map((entry, index) => (
                    <div key={index} className="flex items-start space-x-4 border-b pb-4 last:border-0">
                      <div
                        className={`rounded-full h-8 w-8 flex items-center justify-center ${entry.amount > 0 ? "bg-green-500" : "bg-red-500"} text-white`}
                      >
                        {entry.amount > 0 ? "+" : "-"}
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium">{entry.reason}</p>
                          <p className={`text-sm font-bold ${entry.amount > 0 ? "text-green-500" : "text-red-500"}`}>
                            {entry.amount > 0 ? `+${entry.amount}` : entry.amount} Points
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground">{new Date(entry.timestamp).toLocaleString()}</p>
                        {entry.awardedBy && (
                          <p className="text-xs text-muted-foreground">Awarded by: {entry.awardedBy}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <Info className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">No points history found</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="roles" className="max-h-[60vh] overflow-auto">
              {selectedUser?.interactionHistory &&
              selectedUser.interactionHistory.filter((interaction) => interaction.type === "role_change").length > 0 ? (
                <div className="space-y-4 py-4">
                  {selectedUser.interactionHistory
                    .filter((interaction) => interaction.type === "role_change")
                    .map((interaction, index) => (
                      <div key={index} className="flex items-start space-x-4 border-b pb-4 last:border-0">
                        <div className="rounded-full h-8 w-8 flex items-center justify-center bg-primary text-primary-foreground">
                          <Shield className="h-4 w-4" />
                        </div>
                        <div className="space-y-1 flex-1">
                          <div className="flex justify-between">
                            <p className="text-sm font-medium">Role Change</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(interaction.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <p className="text-sm">{interaction.reason}</p>
                          {interaction.details && (
                            <p className="text-xs text-muted-foreground">{interaction.details}</p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            By: {getUserById(interaction.performedBy)?.username || "System"}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <Info className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">No role change history found</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
          <DialogFooter>
            <Button variant="outline" onClick={() => setHistoryDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


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
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Ban, CheckCircle2, Lock, Plus, Search, Shield, Trash, User, UserPlus } from "lucide-react"

export default function AdminPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [users, setUsers] = useState<any[]>([])
  const [roles, setRoles] = useState<any[]>([])
  const [violations, setViolations] = useState<any[]>([])
  const [logs, setLogs] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [pointsToAdd, setPointsToAdd] = useState<number>(0)
  const [pointsReason, setPointsReason] = useState<string>("")
  const [selectedViolation, setSelectedViolation] = useState<string>("")

  // New role state
  const [newRole, setNewRole] = useState({
    id: "",
    name: "",
    description: "",
    pointThreshold: 0,
    permissions: [] as string[],
  })

  // New violation state
  const [newViolation, setNewViolation] = useState({
    id: "",
    name: "",
    pointsDeduction: 0,
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
    // Check if user is logged in and has admin permissions
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      router.push("/")
      return
    }

    const userData = JSON.parse(currentUser)

    // Check if user has view_admin permission
    const roles = JSON.parse(localStorage.getItem("roles") || "[]")
    const userRole = roles.find((role: any) => role.id === userData.role)

    const hasAdminPermission =
      (userData.permissions && userData.permissions.includes("view_admin")) ||
      (userRole && userRole.permissions && userRole.permissions.includes("view_admin"))

    if (!hasAdminPermission) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      })
      router.push("/dashboard")
      return
    }

    setUser(userData)
    setRoles(roles)

    // Get all users
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]")
    setUsers(allUsers)

    // Get violations
    const allViolations = JSON.parse(localStorage.getItem("violations") || "[]")
    setViolations(allViolations)

    // Get activity logs
    const activityLog = JSON.parse(localStorage.getItem("activityLog") || "[]")
    setLogs(activityLog)

    setLoading(false)
  }, [router, toast])

  const addLog = (action: string, target: string, details: string) => {
    const newLog = {
      id: Date.now().toString(),
      type: action,
      userId: user.id,
      username: user.username,
      target,
      timestamp: new Date().toISOString(),
      details,
    }

    const updatedLogs = [newLog, ...logs]
    setLogs(updatedLogs)
    localStorage.setItem("activityLog", JSON.stringify(updatedLogs))
  }

  const handleRoleChange = (userId: string, newRoleId: string) => {
    const targetUser = users.find((u) => u.id === userId)
    if (!targetUser) return

    const updatedUsers = users.map((u) => {
      if (u.id === userId) {
        const updatedUser = { ...u, role: newRoleId }

        // If current user is changing their own role
        if (user.id === userId) {
          localStorage.setItem("currentUser", JSON.stringify(updatedUser))
          setUser(updatedUser)
        }

        return updatedUser
      }
      return u
    })

    setUsers(updatedUsers)
    localStorage.setItem("users", JSON.stringify(updatedUsers))

    // Add to activity log
    addLog("role_changed", targetUser.username, `Changed role to ${newRoleId}`)

    toast({
      title: "Success",
      description: `Role of ${targetUser.username} has been changed to ${newRoleId}.`,
    })
  }

  const handlePermissionToggle = (userId: string, permission: string) => {
    const targetUser = users.find((u) => u.id === userId)
    if (!targetUser) return

    const updatedUsers = users.map((u) => {
      if (u.id === userId) {
        const permissions = u.permissions || []
        const hasPermission = permissions.includes(permission)

        let updatedPermissions
        if (hasPermission) {
          updatedPermissions = permissions.filter((p) => p !== permission)
          addLog("permission_removed", targetUser.username, `Removed permission: ${permission}`)
        } else {
          updatedPermissions = [...permissions, permission]
          addLog("permission_added", targetUser.username, `Added permission: ${permission}`)
        }

        const updatedUser = { ...u, permissions: updatedPermissions }

        // If current user is changing their own permissions
        if (user.id === userId) {
          localStorage.setItem("currentUser", JSON.stringify(updatedUser))
          setUser(updatedUser)
        }

        return updatedUser
      }
      return u
    })

    setUsers(updatedUsers)
    localStorage.setItem("users", JSON.stringify(updatedUsers))

    toast({
      title: "Success",
      description: "Permissions have been updated.",
    })
  }

  const handleAddPoints = (userId: string, points: number, reason: string) => {
    if (!points || !reason.trim()) {
      toast({
        title: "Error",
        description: "Please provide both points and a reason.",
        variant: "destructive",
      })
      return
    }

    const targetUser = users.find((u) => u.id === userId)
    if (!targetUser) return

    const updatedUsers = users.map((u) => {
      if (u.id === userId) {
        const currentPoints = u.points || 0
        const newPoints = currentPoints + points

        // Create points history entry
        const pointsHistory = u.pointsHistory || []
        const historyEntry = {
          amount: points,
          reason,
          timestamp: new Date().toISOString(),
          awardedBy: user.username,
        }

        const updatedUser = {
          ...u,
          points: newPoints >= 0 ? newPoints : 0, // Prevent negative points
          pointsHistory: [historyEntry, ...pointsHistory],
        }

        // If current user is changing their own points
        if (user.id === userId) {
          localStorage.setItem("currentUser", JSON.stringify(updatedUser))
          setUser(updatedUser)
        }

        // Check if user should be demoted based on points
        checkForDemotion(updatedUser)

        addLog(
          points > 0 ? "points_added" : "points_deducted",
          targetUser.username,
          `${points > 0 ? "Added" : "Deducted"} ${Math.abs(points)} points: ${reason}`,
        )

        return updatedUser
      }
      return u
    })

    setUsers(updatedUsers)
    localStorage.setItem("users", JSON.stringify(updatedUsers))
    setPointsToAdd(0)
    setPointsReason("")
    setSelectedViolation("")
    setSelectedUser(null)

    toast({
      title: "Success",
      description: `${points > 0 ? "Added" : "Deducted"}: ${Math.abs(points)} points for ${targetUser.username}.`,
    })
  }

  const checkForDemotion = (user: any) => {
    const currentRole = roles.find((r) => r.id === user.role)
    if (!currentRole) return

    // Find the role below the current role
    const sortedRoles = [...roles]
      .filter((r) => r.id !== "owner") // Owner can't be demoted
      .sort((a, b) => b.pointThreshold - a.pointThreshold)

    const currentRoleIndex = sortedRoles.findIndex((r) => r.id === currentRole.id)
    if (currentRoleIndex === -1 || currentRoleIndex === sortedRoles.length - 1) return

    const nextLowerRole = sortedRoles[currentRoleIndex + 1]

    // Check if user's points are below the threshold for their current role
    if (user.points < currentRole.pointThreshold) {
      // Demote the user
      const updatedUsers = users.map((u) => {
        if (u.id === user.id) {
          const updatedUser = { ...u, role: nextLowerRole.id }

          // If current user is being demoted
          if (user.id === user.id) {
            localStorage.setItem("currentUser", JSON.stringify(updatedUser))
            setUser(updatedUser)
          }

          addLog(
            "role_changed",
            user.username,
            `Automatically demoted to ${nextLowerRole.id} due to insufficient points`,
          )

          toast({
            title: "User Demoted",
            description: `${user.username} has been automatically demoted to ${nextLowerRole.id} due to insufficient points.`,
          })

          return updatedUser
        }
        return u
      })

      setUsers(updatedUsers)
      localStorage.setItem("users", JSON.stringify(updatedUsers))
    }

    // Check if user has 0 or fewer points
    if (user.points <= 0) {
      // Remove from team
      const updatedUsers = users.map((u) => {
        if (u.id === user.id) {
          const updatedUser = {
            ...u,
            role: "user",
            permissions: [],
            banned: true,
          }

          // If current user is being removed
          if (user.id === user.id) {
            localStorage.setItem("currentUser", JSON.stringify(updatedUser))
            setUser(updatedUser)
          }

          addLog("user_banned", user.username, `Automatically removed from team due to 0 or negative points`)

          toast({
            title: "User Removed",
            description: `${user.username} has been automatically removed from the team due to 0 or negative points.`,
            variant: "destructive",
          })

          return updatedUser
        }
        return u
      })

      setUsers(updatedUsers)
      localStorage.setItem("users", JSON.stringify(updatedUsers))
    }
  }

  const handleBanUser = (userId: string, isBanned: boolean) => {
    const targetUser = users.find((u) => u.id === userId)
    if (!targetUser) return

    const updatedUsers = users.map((u) => {
      if (u.id === userId) {
        const updatedUser = { ...u, banned: isBanned }

        addLog(
          isBanned ? "user_banned" : "user_unbanned",
          targetUser.username,
          isBanned ? "User banned" : "User unbanned",
        )
        return updatedUser
      }
      return u
    })

    setUsers(updatedUsers)
    localStorage.setItem("users", JSON.stringify(updatedUsers))

    toast({
      title: "Success",
      description: `User ${targetUser.username} has been ${isBanned ? "banned" : "unbanned"}.`,
    })
  }

  const handleCreateRole = () => {
    if (!newRole.id || !newRole.name || newRole.pointThreshold < 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    // Check if role ID already exists
    if (roles.some((role) => role.id === newRole.id)) {
      toast({
        title: "Error",
        description: "A role with this ID already exists.",
        variant: "destructive",
      })
      return
    }

    const updatedRoles = [...roles, newRole]
    setRoles(updatedRoles)
    localStorage.setItem("roles", JSON.stringify(updatedRoles))

    // Reset form
    setNewRole({
      id: "",
      name: "",
      description: "",
      pointThreshold: 0,
      permissions: [],
    })

    toast({
      title: "Success",
      description: "New role has been created.",
    })
  }

  const handleCreateViolation = () => {
    if (!newViolation.id || !newViolation.name || newViolation.pointsDeduction <= 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    // Check if violation ID already exists
    if (violations.some((v) => v.id === newViolation.id)) {
      toast({
        title: "Error",
        description: "A violation with this ID already exists.",
        variant: "destructive",
      })
      return
    }

    const updatedViolations = [...violations, newViolation]
    setViolations(updatedViolations)
    localStorage.setItem("violations", JSON.stringify(updatedViolations))

    // Reset form
    setNewViolation({
      id: "",
      name: "",
      pointsDeduction: 0,
    })

    toast({
      title: "Success",
      description: "New violation has been created.",
    })
  }

  const handleDeleteRole = (roleId: string) => {
    // Don't allow deleting the "owner" or "user" roles
    if (roleId === "owner" || roleId === "user") {
      toast({
        title: "Error",
        description: "This role cannot be deleted.",
        variant: "destructive",
      })
      return
    }

    // Check if any users have this role
    const usersWithRole = users.filter((u) => u.role === roleId)
    if (usersWithRole.length > 0) {
      toast({
        title: "Error",
        description: `There are still ${usersWithRole.length} users with this role. Assign them to a different role first.`,
        variant: "destructive",
      })
      return
    }

    const updatedRoles = roles.filter((role) => role.id !== roleId)
    setRoles(updatedRoles)
    localStorage.setItem("roles", JSON.stringify(updatedRoles))

    toast({
      title: "Success",
      description: "Role has been deleted.",
    })
  }

  const handleDeleteViolation = (violationId: string) => {
    const updatedViolations = violations.filter((v) => v.id !== violationId)
    setViolations(updatedViolations)
    localStorage.setItem("violations", JSON.stringify(updatedViolations))

    toast({
      title: "Success",
      description: "Violation has been deleted.",
    })
  }

  const handleResetPoints = () => {
    // Reset points for all users but keep their roles
    const updatedUsers = users.map((u) => {
      const pointsHistory = u.pointsHistory || []
      const historyEntry = {
        amount: -u.points,
        reason: "Monthly points reset",
        timestamp: new Date().toISOString(),
        awardedBy: "System",
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

    // Update current user if needed
    const currentUser = updatedUsers.find((u) => u.id === user.id)
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser))
      setUser(currentUser)
    }

    // Add to activity log
    addLog("points_reset", "all_users", "Monthly points reset performed")

    toast({
      title: "Success",
      description: "Points have been reset for all users.",
    })
  }

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const hasPermission = (permission: string) => {
    if (!user) return false

    // Check if user has the specific permission
    if (user.permissions && user.permissions.includes(permission)) {
      return true
    }

    // Check if user's role has the permission
    const userRole = roles.find((role: any) => role.id === user.role)

    return userRole && userRole.permissions && userRole.permissions.includes(permission)
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-sm">
              {roles.find((r) => r.id === user.role)?.name || user.role}
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="users">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">
              <User className="mr-2 h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="roles">
              <Shield className="mr-2 h-4 w-4" />
              Roles
            </TabsTrigger>
            <TabsTrigger value="violations">
              <Ban className="mr-2 h-4 w-4" />
              Violations
            </TabsTrigger>
            <TabsTrigger value="logs">
              <Lock className="mr-2 h-4 w-4" />
              Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage users, roles and permissions</CardDescription>
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
                  <div className="flex items-center space-x-2">
                    {hasPermission("manage_users") && (
                      <Button>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add User
                      </Button>
                    )}
                    <Button onClick={() => router.push("/admin/user-approval")} variant="outline">
                      <User className="mr-2 h-4 w-4" />
                      Benutzerfreigabe
                    </Button>
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Username</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Points</TableHead>
                        <TableHead>Permissions</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((u) => (
                        <TableRow key={u.id}>
                          <TableCell className="font-medium">{u.username}</TableCell>
                          <TableCell>
                            {hasPermission("assign_roles") ? (
                              <Select
                                value={u.role}
                                onValueChange={(value) => handleRoleChange(u.id, value)}
                                disabled={u.role === "owner" && user.role !== "owner"}
                              >
                                <SelectTrigger className="w-[130px]">
                                  <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                  {roles.map((role) => (
                                    <SelectItem
                                      key={role.id}
                                      value={role.id}
                                      disabled={role.id === "owner" && user.role !== "owner"}
                                    >
                                      {role.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <Badge variant="outline">{roles.find((r) => r.id === u.role)?.name || u.role}</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span>{u.points || 0}</span>
                              {hasPermission("manage_points") && (
                                <Button variant="outline" size="sm" onClick={() => setSelectedUser(u)}>
                                  <Plus className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                            {selectedUser?.id === u.id && (
                              <div className="mt-2 space-y-2">
                                <div className="flex items-center space-x-2">
                                  <Input
                                    type="number"
                                    value={pointsToAdd}
                                    onChange={(e) => setPointsToAdd(Number.parseInt(e.target.value) || 0)}
                                    className="w-20 h-8"
                                    placeholder="Points"
                                  />
                                  <Select
                                    value={selectedViolation}
                                    onValueChange={(value) => {
                                      setSelectedViolation(value)
                                      const violation = violations.find((v) => v.id === value)
                                      if (violation) {
                                        setPointsToAdd(-violation.pointsDeduction)
                                        setPointsReason(violation.name)
                                      }
                                    }}
                                  >
                                    <SelectTrigger className="w-[180px]">
                                      <SelectValue placeholder="Select violation" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {violations.map((v) => (
                                        <SelectItem key={v.id} value={v.id}>
                                          {v.name} (-{v.pointsDeduction})
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <Input
                                  value={pointsReason}
                                  onChange={(e) => setPointsReason(e.target.value)}
                                  className="h-8"
                                  placeholder="Reason"
                                />
                                <div className="flex space-x-2">
                                  <Button
                                    size="sm"
                                    onClick={() => handleAddPoints(u.id, Math.abs(pointsToAdd), pointsReason)}
                                    disabled={!pointsToAdd || !pointsReason.trim()}
                                  >
                                    Add
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleAddPoints(u.id, -Math.abs(pointsToAdd), pointsReason)}
                                    disabled={!pointsToAdd || !pointsReason.trim()}
                                  >
                                    Deduct
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedUser(null)
                                      setPointsToAdd(0)
                                      setPointsReason("")
                                      setSelectedViolation("")
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            {hasPermission("manage_users") ? (
                              <div className="flex flex-wrap gap-1">
                                {allPermissions.map((permission) => (
                                  <Badge
                                    key={permission}
                                    variant={(u.permissions || []).includes(permission) ? "default" : "outline"}
                                    className="cursor-pointer"
                                    onClick={() => handlePermissionToggle(u.id, permission)}
                                  >
                                    {permission}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <div className="flex flex-wrap gap-1">
                                {(u.permissions || []).map((permission: string) => (
                                  <Badge key={permission} variant="outline">
                                    {permission}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            {u.banned ? (
                              <Badge variant="destructive">Banned</Badge>
                            ) : (
                              <Badge variant="default">Active</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {hasPermission("ban_users") && (
                              <div className="flex space-x-2">
                                <Button
                                  variant={u.banned ? "outline" : "ghost"}
                                  size="sm"
                                  onClick={() => handleBanUser(u.id, !u.banned)}
                                  disabled={u.role === "owner"}
                                >
                                  {u.banned ? (
                                    <>
                                      <CheckCircle2 className="h-4 w-4 mr-1" /> Unban
                                    </>
                                  ) : (
                                    <>
                                      <Ban className="h-4 w-4 mr-1" /> Ban
                                    </>
                                  )}
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
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
                <CardDescription>Manage roles and their permissions</CardDescription>
              </CardHeader>
              <CardContent>
                {hasPermission("manage_roles") && (
                  <div className="mb-6 p-4 border rounded-md">
                    <h3 className="text-lg font-medium mb-4">Create New Role</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Role ID</label>
                        <Input
                          value={newRole.id}
                          onChange={(e) => setNewRole({ ...newRole, id: e.target.value })}
                          placeholder="e.g. moderator"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Name</label>
                        <Input
                          value={newRole.name}
                          onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                          placeholder="e.g. Moderator"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <Input
                          value={newRole.description}
                          onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                          placeholder="Role description"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Point Threshold</label>
                        <Input
                          type="number"
                          value={newRole.pointThreshold}
                          onChange={(e) =>
                            setNewRole({ ...newRole, pointThreshold: Number.parseInt(e.target.value) || 0 })
                          }
                          placeholder="Minimum points for this role"
                        />
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <label className="text-sm font-medium">Permissions</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {allPermissions.map((permission) => (
                          <div key={permission} className="flex items-center space-x-2">
                            <Checkbox
                              id={`permission-${permission}`}
                              checked={newRole.permissions.includes(permission)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setNewRole({
                                    ...newRole,
                                    permissions: [...newRole.permissions, permission],
                                  })
                                } else {
                                  setNewRole({
                                    ...newRole,
                                    permissions: newRole.permissions.filter((p) => p !== permission),
                                  })
                                }
                              }}
                            />
                            <label htmlFor={`permission-${permission}`} className="text-sm cursor-pointer">
                              {permission}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button onClick={handleCreateRole}>Create Role</Button>
                  </div>
                )}

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Point Threshold</TableHead>
                        <TableHead>Permissions</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {roles.map((role) => (
                        <TableRow key={role.id}>
                          <TableCell className="font-medium">{role.id}</TableCell>
                          <TableCell>{role.name}</TableCell>
                          <TableCell>
                            {role.pointThreshold === Number.POSITIVE_INFINITY ? "∞" : role.pointThreshold}
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
                          <TableCell>
                            {hasPermission("manage_roles") && role.id !== "owner" && role.id !== "user" && (
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteRole(role.id)}>
                                <Trash className="h-4 w-4 mr-1" /> Delete
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="violations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Violations</CardTitle>
                <CardDescription>Manage violations and their point deductions</CardDescription>
              </CardHeader>
              <CardContent>
                {hasPermission("manage_points") && (
                  <div className="mb-6 p-4 border rounded-md">
                    <h3 className="text-lg font-medium mb-4">Create New Violation</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Violation ID</label>
                        <Input
                          value={newViolation.id}
                          onChange={(e) => setNewViolation({ ...newViolation, id: e.target.value })}
                          placeholder="e.g. spam"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Name</label>
                        <Input
                          value={newViolation.name}
                          onChange={(e) => setNewViolation({ ...newViolation, name: e.target.value })}
                          placeholder="e.g. Spamming commands"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Point Deduction</label>
                        <Input
                          type="number"
                          value={newViolation.pointsDeduction}
                          onChange={(e) =>
                            setNewViolation({ ...newViolation, pointsDeduction: Number.parseInt(e.target.value) || 0 })
                          }
                          placeholder="Points to deduct"
                        />
                      </div>
                    </div>
                    <Button onClick={handleCreateViolation}>Create Violation</Button>
                  </div>
                )}

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Point Deduction</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {violations.map((violation) => (
                        <TableRow key={violation.id}>
                          <TableCell className="font-medium">{violation.id}</TableCell>
                          <TableCell>{violation.name}</TableCell>
                          <TableCell>-{violation.pointsDeduction}</TableCell>
                          <TableCell>
                            {hasPermission("manage_points") && (
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteViolation(violation.id)}>
                                <Trash className="h-4 w-4 mr-1" /> Delete
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {hasPermission("manage_points") && (
                  <div className="mt-6 p-4 border rounded-md">
                    <h3 className="text-lg font-medium mb-4">Point Reset</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      This action resets the points of all users to 0. Roles will remain unchanged. According to the
                      rules, this should be performed on the 1st of each month.
                    </p>
                    <Button variant="destructive" onClick={handleResetPoints}>
                      Reset Points for All Users
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Logs</CardTitle>
                <CardDescription>Overview of all changes and activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Target</TableHead>
                        <TableHead>Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {logs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                          <TableCell className="font-medium">{log.username}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {log.type === "user_registered"
                                ? "Registration"
                                : log.type === "user_login"
                                  ? "Login"
                                  : log.type === "user_logout"
                                    ? "Logout"
                                    : log.type === "points_added"
                                      ? "Points added"
                                      : log.type === "points_deducted"
                                        ? "Points deducted"
                                        : log.type === "points_reset"
                                          ? "Points reset"
                                          : log.type === "role_changed"
                                            ? "Role changed"
                                            : log.type === "permission_added"
                                              ? "Permission added"
                                              : log.type === "permission_removed"
                                                ? "Permission removed"
                                                : log.type === "user_banned"
                                                  ? "User banned"
                                                  : log.type === "user_unbanned"
                                                    ? "User unbanned"
                                                    : log.type}
                            </Badge>
                          </TableCell>
                          <TableCell>{log.target}</TableCell>
                          <TableCell>{log.details}</TableCell>
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
    </div>
  )
}


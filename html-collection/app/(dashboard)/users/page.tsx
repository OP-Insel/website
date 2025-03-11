"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Shield, Star, UserPlus } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"

type User = {
  id: number
  username: string
  role: "Owner" | "Co-Owner" | "Admin" | "Moderator" | "Helper" | "Member"
  avatar: string
  points: number
  joinDate: string
  lastActive: string
  permissions: string[]
}

export default function UsersPage() {
  const { hasPermission } = useAuth()
  const canManageUsers = hasPermission("manage_users")
  const canManagePermissions = hasPermission("manage_permissions")

  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      username: "Steve",
      role: "Owner",
      avatar: "https://mc-heads.net/avatar/MHF_Steve",
      points: 1250,
      joinDate: "2023-01-15",
      lastActive: "2023-11-10",
      permissions: [
        "manage_users",
        "manage_permissions",
        "manage_server",
        "view_dashboard",
        "manage_tasks",
        "manage_events",
      ],
    },
    {
      id: 2,
      username: "Alex",
      role: "Co-Owner",
      avatar: "https://mc-heads.net/avatar/MHF_Alex",
      points: 980,
      joinDate: "2023-02-20",
      lastActive: "2023-11-09",
      permissions: [
        "manage_users",
        "manage_permissions",
        "manage_server",
        "view_dashboard",
        "manage_tasks",
        "manage_events",
      ],
    },
    {
      id: 3,
      username: "Creeper",
      role: "Admin",
      avatar: "https://mc-heads.net/avatar/MHF_Creeper",
      points: 750,
      joinDate: "2023-03-10",
      lastActive: "2023-11-08",
      permissions: ["manage_users", "view_dashboard", "manage_tasks", "manage_events"],
    },
    {
      id: 4,
      username: "Zombie",
      role: "Moderator",
      avatar: "https://mc-heads.net/avatar/MHF_Zombie",
      points: 520,
      joinDate: "2023-04-05",
      lastActive: "2023-11-01",
      permissions: ["view_dashboard", "manage_tasks"],
    },
    {
      id: 5,
      username: "Skeleton",
      role: "Helper",
      avatar: "https://mc-heads.net/avatar/MHF_Skeleton",
      points: 320,
      joinDate: "2023-05-15",
      lastActive: "2023-11-05",
      permissions: ["view_dashboard"],
    },
    {
      id: 6,
      username: "Enderman",
      role: "Member",
      avatar: "https://mc-heads.net/avatar/MHF_Enderman",
      points: 150,
      joinDate: "2023-06-20",
      lastActive: "2023-11-07",
      permissions: ["view_dashboard"],
    },
  ])

  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [pointsToAdd, setPointsToAdd] = useState<number>(0)
  const [newUserData, setNewUserData] = useState({
    username: "",
    role: "Member",
  })
  const [isValidatingUsername, setIsValidatingUsername] = useState(false)
  const [usernameValid, setUsernameValid] = useState<boolean | null>(null)

  // Filter users by role
  const staffUsers = users.filter((user) => ["Owner", "Co-Owner", "Admin", "Moderator", "Helper"].includes(user.role))
  const memberUsers = users.filter((user) => user.role === "Member")

  // Filter users by search query
  const filteredUsers = users.filter((user) => user.username.toLowerCase().includes(searchQuery.toLowerCase()))

  // Validate Minecraft username
  const validateMinecraftUsername = async (username: string) => {
    if (!username) return false

    setIsValidatingUsername(true)
    try {
      // In a real app, you would call an API to validate the Minecraft username
      // For demo purposes, we'll simulate an API call
      const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`)
      const isValid = response.ok
      setUsernameValid(isValid)
      return isValid
    } catch (error) {
      setUsernameValid(false)
      return false
    } finally {
      setIsValidatingUsername(false)
    }
  }

  // Handle username blur for validation
  const handleBlurUsername = () => {
    if (newUserData.username) {
      validateMinecraftUsername(newUserData.username)
    }
  }

  // Add a new user
  const addUser = async () => {
    if (!newUserData.username) return

    // Validate username
    const isValid = await validateMinecraftUsername(newUserData.username)
    if (!isValid) return

    const newUser: User = {
      id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
      username: newUserData.username,
      role: newUserData.role as any,
      avatar: `https://mc-heads.net/avatar/${newUserData.username}`,
      points: 0,
      joinDate: new Date().toISOString().split("T")[0],
      lastActive: new Date().toISOString().split("T")[0],
      permissions: newUserData.role === "Member" ? ["view_dashboard"] : ["view_dashboard", "manage_tasks"],
    }

    setUsers([...users, newUser])
    setNewUserData({ username: "", role: "Member" })
    setUsernameValid(null)
  }

  // Update user permissions
  const togglePermission = (userId: number, permission: string) => {
    setUsers(
      users.map((user) => {
        if (user.id === userId) {
          const hasPermission = user.permissions.includes(permission)
          const updatedPermissions = hasPermission
            ? user.permissions.filter((p) => p !== permission)
            : [...user.permissions, permission]

          return { ...user, permissions: updatedPermissions }
        }
        return user
      }),
    )
  }

  // Update user role
  const updateUserRole = (userId: number, role: string) => {
    setUsers(
      users.map((user) => {
        if (user.id === userId) {
          return { ...user, role: role as any }
        }
        return user
      }),
    )
  }

  // Add or remove points
  const updateUserPoints = (userId: number, action: "add" | "remove") => {
    if (!pointsToAdd || pointsToAdd <= 0) return

    setUsers(
      users.map((user) => {
        if (user.id === userId) {
          const newPoints = action === "add" ? user.points + pointsToAdd : Math.max(0, user.points - pointsToAdd)

          return { ...user, points: newPoints }
        }
        return user
      }),
    )

    setPointsToAdd(0)
  }

  // Remove a user
  const removeUser = (userId: number) => {
    setUsers(users.filter((user) => user.id !== userId))
    setSelectedUser(null)
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        {canManageUsers && (
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" /> Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="username">Minecraft Username</Label>
                  <div className="relative">
                    <Input
                      id="username"
                      placeholder="Enter Minecraft username"
                      value={newUserData.username}
                      onChange={(e) => setNewUserData({ ...newUserData, username: e.target.value })}
                      onBlur={handleBlurUsername}
                      className={
                        usernameValid === true
                          ? "border-green-500 pr-10"
                          : usernameValid === false
                            ? "border-red-500 pr-10"
                            : ""
                      }
                    />
                    {isValidatingUsername && (
                      <div className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    )}
                    {usernameValid === true && !isValidatingUsername && (
                      <div className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-green-500" />
                    )}
                    {usernameValid === false && !isValidatingUsername && (
                      <div className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-red-500" />
                    )}
                  </div>
                  {usernameValid === false && <p className="text-sm text-red-500">Invalid Minecraft username</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={newUserData.role}
                    onValueChange={(value) => setNewUserData({ ...newUserData, role: value })}
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Moderator">Moderator</SelectItem>
                      <SelectItem value="Helper">Helper</SelectItem>
                      <SelectItem value="Member">Member</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="button" onClick={addUser} disabled={!newUserData.username || usernameValid !== true}>
                  Add User
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Users ({users.length})</TabsTrigger>
          <TabsTrigger value="staff">Staff ({staffUsers.length})</TabsTrigger>
          <TabsTrigger value="members">Members ({memberUsers.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map((user) => (
              <Card
                key={user.id}
                className="cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => setSelectedUser(user)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar} alt={user.username} />
                      <AvatarFallback>{user.username.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{user.username}</h3>
                        {user.role === "Owner" && <Star className="h-4 w-4 text-yellow-500" />}
                        {user.role === "Co-Owner" && <Star className="h-4 w-4 text-blue-500" />}
                        {user.role === "Admin" && <Shield className="h-4 w-4 text-red-500" />}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{user.role}</Badge>
                        <span className="text-xs text-muted-foreground">{user.points} points</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="staff" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {staffUsers
              .filter((user) => user.username.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((user) => (
                <Card
                  key={user.id}
                  className="cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => setSelectedUser(user)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.avatar} alt={user.username} />
                        <AvatarFallback>{user.username.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{user.username}</h3>
                          {user.role === "Owner" && <Star className="h-4 w-4 text-yellow-500" />}
                          {user.role === "Co-Owner" && <Star className="h-4 w-4 text-blue-500" />}
                          {user.role === "Admin" && <Shield className="h-4 w-4 text-red-500" />}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{user.role}</Badge>
                          <span className="text-xs text-muted-foreground">{user.points} points</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
        <TabsContent value="members" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {memberUsers
              .filter((user) => user.username.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((user) => (
                <Card
                  key={user.id}
                  className="cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => setSelectedUser(user)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.avatar} alt={user.username} />
                        <AvatarFallback>{user.username.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{user.username}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{user.role}</Badge>
                          <span className="text-xs text-muted-foreground">{user.points} points</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {selectedUser && (
        <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>User Profile: {selectedUser.username}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedUser.avatar} alt={selectedUser.username} />
                  <AvatarFallback>{selectedUser.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold">{selectedUser.username}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">{selectedUser.role}</Badge>
                    <span className="text-sm text-muted-foreground">{selectedUser.points} points</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Join Date</p>
                  <p>{new Date(selectedUser.joinDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Last Active</p>
                  <p>{new Date(selectedUser.lastActive).toLocaleDateString()}</p>
                </div>
              </div>

              {canManagePermissions && (
                <div>
                  <h3 className="font-medium mb-2">Berechtigungen</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      "view_dashboard",
                      "manage_tasks",
                      "manage_events",
                      "manage_users",
                      "manage_permissions",
                      "manage_server",
                    ].map((permission) => (
                      <div key={permission} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`perm-${permission}`}
                          checked={selectedUser?.permissions.includes(permission)}
                          onChange={() => togglePermission(selectedUser.id, permission)}
                          className="h-4 w-4"
                        />
                        <label htmlFor={`perm-${permission}`} className="text-sm">
                          {permission
                            .split("_")
                            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(" ")}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {canManageUsers && (
                <div>
                  <h3 className="font-medium mb-2">Manage Points</h3>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Points"
                      min="0"
                      value={pointsToAdd || ""}
                      onChange={(e) => setPointsToAdd(Number.parseInt(e.target.value) || 0)}
                    />
                    <Button
                      variant="outline"
                      onClick={() => updateUserPoints(selectedUser.id, "add")}
                      disabled={!pointsToAdd || pointsToAdd <= 0}
                    >
                      Add
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => updateUserPoints(selectedUser.id, "remove")}
                      disabled={!pointsToAdd || pointsToAdd <= 0}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              )}

              {canManageUsers && (
                <div className="flex justify-between">
                  <div>
                    <Select
                      defaultValue={selectedUser.role}
                      onValueChange={(value) => updateUserRole(selectedUser.id, value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Change role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Moderator">Moderator</SelectItem>
                        <SelectItem value="Helper">Helper</SelectItem>
                        <SelectItem value="Member">Member</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Button variant="destructive" onClick={() => removeUser(selectedUser.id)}>
                      Remove User
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}


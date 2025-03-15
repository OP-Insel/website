"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { LogOut } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [roles, setRoles] = useState<any[]>([])
  const [pointsHistory, setPointsHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [nextRoleProgress, setNextRoleProgress] = useState(0)
  const [nextRole, setNextRole] = useState<any>(null)

  useEffect(() => {
    // Check if user is logged in
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      router.push("/")
      return
    }

    const userData = JSON.parse(currentUser)
    setUser(userData)

    // Get all roles
    const allRoles = JSON.parse(localStorage.getItem("roles") || "[]")
    setRoles(allRoles)

    // Get user's role
    const userRole = allRoles.find((role: any) => role.id === userData.role)

    // Find the next role based on point threshold
    const sortedRoles = [...allRoles].sort((a, b) => a.pointThreshold - b.pointThreshold)
    const nextPossibleRole = sortedRoles.find(
      (role) => role.pointThreshold > userRole.pointThreshold && role.pointThreshold !== Number.POSITIVE_INFINITY,
    )

    if (nextPossibleRole) {
      setNextRole(nextPossibleRole)
      // Calculate progress to next role
      const currentPoints = userData.points || 0
      const currentThreshold = userRole.pointThreshold
      const nextThreshold = nextPossibleRole.pointThreshold

      const progress = Math.min(
        Math.round(((currentPoints - currentThreshold) / (nextThreshold - currentThreshold)) * 100),
        100,
      )
      setNextRoleProgress(progress)
    }

    // Get points history
    setPointsHistory(userData.pointsHistory || [])

    setLoading(false)
  }, [router])

  const handleLogout = () => {
    // Add to activity log
    if (user) {
      const activityLog = JSON.parse(localStorage.getItem("activityLog") || "[]")
      activityLog.unshift({
        id: Date.now().toString(),
        type: "user_logout",
        userId: user.id,
        username: user.username,
        timestamp: new Date().toISOString(),
        details: "User logged out",
      })
      localStorage.setItem("activityLog", JSON.stringify(activityLog))
    }

    localStorage.removeItem("currentUser")
    toast({
      title: "Success",
      description: "You have been logged out.",
    })
    router.push("/")
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Your Profile</h2>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>User Information</CardTitle>
              <CardDescription>Your personal information and statistics</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`}
                  alt={user.username}
                />
                <AvatarFallback className="text-4xl">{user.username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>

              <div className="text-center">
                <h3 className="text-xl font-bold">{user.username}</h3>
                <p className="text-sm text-muted-foreground">
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="flex flex-col items-center p-3 border rounded-md">
                  <span className="text-2xl font-bold">{user.points || 0}</span>
                  <span className="text-sm text-muted-foreground">Points</span>
                </div>
                <div className="flex flex-col items-center p-3 border rounded-md">
                  <span className="text-2xl font-bold">{user.role}</span>
                  <span className="text-sm text-muted-foreground">Role</span>
                </div>
              </div>

              {nextRole && (
                <div className="w-full">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress to next role:</span>
                    <span>{nextRoleProgress}%</span>
                  </div>
                  <Progress value={nextRoleProgress} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{roles.find((role: any) => role.id === user.role)?.name}</span>
                    <span>{nextRole.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    {nextRole.pointThreshold - (user.points || 0)} more points until {nextRole.name}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Permissions</CardTitle>
              <CardDescription>Your permissions in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Role</h3>
                  <Badge variant="outline" className="text-sm">
                    {roles.find((role: any) => role.id === user.role)?.name || user.role}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    {roles.find((role: any) => role.id === user.role)?.description || ""}
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Role Permissions</h3>
                  <div className="flex flex-wrap gap-2">
                    {roles
                      .find((role: any) => role.id === user.role)
                      ?.permissions?.map((permission: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {permission}
                        </Badge>
                      )) || <p className="text-sm text-muted-foreground">No role permissions</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Additional Permissions</h3>
                  {user.permissions && user.permissions.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {user.permissions.map((permission: string, index: number) => (
                        <Badge key={index} variant="outline">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No additional permissions</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Points History</CardTitle>
            <CardDescription>Overview of your point changes</CardDescription>
          </CardHeader>
          <CardContent>
            {pointsHistory && pointsHistory.length > 0 ? (
              <div className="space-y-4">
                {pointsHistory.map((entry, index) => (
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
              <p className="text-center py-8 text-muted-foreground">No point changes yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


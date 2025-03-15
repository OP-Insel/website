"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Search } from "lucide-react"

export default function ActivitiesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [activities, setActivities] = useState<any[]>([])
  const [filteredActivities, setFilteredActivities] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      router.push("/")
      return
    }

    setUser(JSON.parse(currentUser))

    // Get all activities
    const activityLog = JSON.parse(localStorage.getItem("activityLog") || "[]")
    setActivities(activityLog)
    setFilteredActivities(activityLog)

    setLoading(false)
  }, [router])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredActivities(activities)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = activities.filter(
      (activity) =>
        activity.username.toLowerCase().includes(query) ||
        activity.type.toLowerCase().includes(query) ||
        (activity.details && activity.details.toLowerCase().includes(query)),
    )

    setFilteredActivities(filtered)
  }, [searchQuery, activities])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "user_registered":
        return "👤"
      case "user_login":
        return "🔑"
      case "user_logout":
        return "🚪"
      case "points_added":
        return "⬆️"
      case "points_deducted":
        return "⬇️"
      case "role_changed":
        return "🔄"
      case "permission_added":
        return "✅"
      case "permission_removed":
        return "❌"
      case "user_banned":
        return "🚫"
      case "user_unbanned":
        return "✳️"
      default:
        return "📝"
    }
  }

  const getActivityLabel = (type: string) => {
    switch (type) {
      case "user_registered":
        return "Registrierung"
      case "user_login":
        return "Anmeldung"
      case "user_logout":
        return "Abmeldung"
      case "points_added":
        return "Punkte hinzugefügt"
      case "points_deducted":
        return "Punkte abgezogen"
      case "role_changed":
        return "Rolle geändert"
      case "permission_added":
        return "Berechtigung hinzugefügt"
      case "permission_removed":
        return "Berechtigung entfernt"
      case "user_banned":
        return "Benutzer gesperrt"
      case "user_unbanned":
        return "Benutzer entsperrt"
      default:
        return type
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Laden...</div>
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Aktivitäten</h2>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Aktivitäten durchsuchen..."
              className="pl-8 w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Aktivitätsprotokoll</CardTitle>
            <CardDescription>Alle Aktivitäten im System</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredActivities.length > 0 ? (
              <div className="space-y-4">
                {filteredActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4 border-b pb-4 last:border-0">
                    <div className="rounded-full h-10 w-10 bg-secondary flex items-center justify-center text-lg">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium">{activity.username}</p>
                          <Badge variant="outline" className="mt-1">
                            {getActivityLabel(activity.type)}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{new Date(activity.timestamp).toLocaleString()}</p>
                      </div>
                      {activity.details && <p className="text-sm mt-2">{activity.details}</p>}
                      {activity.target && activity.target !== activity.username && (
                        <p className="text-xs text-muted-foreground mt-1">Ziel: {activity.target}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Keine Aktivitäten gefunden</p>
                {searchQuery && (
                  <Button variant="ghost" className="mt-2" onClick={() => setSearchQuery("")}>
                    Suche zurücksetzen
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


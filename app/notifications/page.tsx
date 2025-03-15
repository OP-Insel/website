"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, Check, Info, TrendingDown, Shield, AlertTriangle } from "lucide-react"
import { AnimatedContainer } from "@/components/animated-container"

interface Notification {
  id: string
  userId: string
  type: "point_deduction" | "role_change" | "request_rejected" | "user_approved" | "system"
  message: string
  timestamp: string
  read: boolean
}

export default function NotificationsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
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

    // Get notifications for this user
    const allNotifications = JSON.parse(localStorage.getItem("notifications") || "[]")
    const userNotifications = allNotifications.filter((n: Notification) => n.userId === userData.id)
    setNotifications(userNotifications)

    setLoading(false)
  }, [router])

  const markAsRead = (notificationId: string) => {
    const allNotifications = JSON.parse(localStorage.getItem("notifications") || "[]")
    const updatedNotifications = allNotifications.map((n: Notification) => {
      if (n.id === notificationId) {
        return { ...n, read: true }
      }
      return n
    })

    localStorage.setItem("notifications", JSON.stringify(updatedNotifications))

    // Update state
    setNotifications(
      notifications.map((n) => {
        if (n.id === notificationId) {
          return { ...n, read: true }
        }
        return n
      }),
    )
  }

  const markAllAsRead = () => {
    const allNotifications = JSON.parse(localStorage.getItem("notifications") || "[]")
    const updatedNotifications = allNotifications.map((n: Notification) => {
      if (n.userId === user.id) {
        return { ...n, read: true }
      }
      return n
    })

    localStorage.setItem("notifications", JSON.stringify(updatedNotifications))

    // Update state
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "point_deduction":
        return <TrendingDown className="h-5 w-5 text-destructive" />
      case "role_change":
        return <Shield className="h-5 w-5 text-blue-500" />
      case "request_rejected":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "user_approved":
        return <Check className="h-5 w-5 text-green-500" />
      default:
        return <Info className="h-5 w-5 text-muted-foreground" />
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Lade Benachrichtigungen...</p>
        </div>
      </div>
    )
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <AnimatedContainer>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-3xl font-bold tracking-tight">Benachrichtigungen</h2>
              {unreadCount > 0 && <Badge className="ml-2 bg-primary text-primary-foreground">{unreadCount} neu</Badge>}
            </div>
            {notifications.length > 0 && (
              <Button variant="outline" onClick={markAllAsRead}>
                Alle als gelesen markieren
              </Button>
            )}
          </div>

          <div className="mt-6 space-y-4">
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <AnimatedContainer key={notification.id} delay={index * 0.05}>
                  <Card className={notification.read ? "opacity-70" : ""}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          {getNotificationIcon(notification.type)}
                          <CardTitle className="text-lg">
                            {notification.type === "point_deduction"
                              ? "Punktabzug"
                              : notification.type === "role_change"
                                ? "Rollenänderung"
                                : notification.type === "request_rejected"
                                  ? "Antrag abgelehnt"
                                  : notification.type === "user_approved"
                                    ? "Konto freigegeben"
                                    : "System"}
                          </CardTitle>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{new Date(notification.timestamp).toLocaleString()}</Badge>
                          {!notification.read && (
                            <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <CardDescription>
                        {!notification.read && (
                          <Badge variant="default" className="mr-2">
                            Neu
                          </Badge>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>{notification.message}</p>
                    </CardContent>
                  </Card>
                </AnimatedContainer>
              ))
            ) : (
              <div className="text-center py-10">
                <Bell className="mx-auto h-10 w-10 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Keine Benachrichtigungen</h3>
                <p className="mt-2 text-sm text-muted-foreground">Du hast derzeit keine Benachrichtigungen.</p>
              </div>
            )}
          </div>
        </AnimatedContainer>
      </div>
    </div>
  )
}


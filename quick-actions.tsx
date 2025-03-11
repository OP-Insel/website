"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, Calendar, Power, UserPlus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useNotifications } from "@/components/dashboard/notification-provider"
import { useRouter } from "next/navigation"

export function QuickActions() {
  const { toast } = useToast()
  const { addNotification } = useNotifications()
  const router = useRouter()

  const handleAction = (action: string) => {
    switch (action) {
      case "restart":
        toast({
          title: "Server-Neustart",
          description: "Der Server wird in 5 Minuten neu gestartet.",
        })
        addNotification({
          title: "Server-Neustart geplant",
          message: "Der Server wird in 5 Minuten neu gestartet. Bitte informiere alle Spieler.",
          type: "warning",
        })
        break
      case "whitelist":
        router.push("/dashboard/whitelist")
        break
      case "event":
        router.push("/dashboard/calendar")
        break
      case "announcement":
        addNotification({
          title: "Ankündigung gesendet",
          message: "Deine Ankündigung wurde an alle Spieler gesendet.",
          type: "success",
        })
        break
      default:
        break
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Schnellaktionen</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            className="flex flex-col h-auto py-4 justify-center items-center"
            onClick={() => handleAction("restart")}
          >
            <Power className="h-5 w-5 mb-1" />
            <span className="text-xs">Server neustarten</span>
          </Button>

          <Button
            variant="outline"
            className="flex flex-col h-auto py-4 justify-center items-center"
            onClick={() => handleAction("whitelist")}
          >
            <UserPlus className="h-5 w-5 mb-1" />
            <span className="text-xs">Whitelist verwalten</span>
          </Button>

          <Button
            variant="outline"
            className="flex flex-col h-auto py-4 justify-center items-center"
            onClick={() => handleAction("event")}
          >
            <Calendar className="h-5 w-5 mb-1" />
            <span className="text-xs">Event erstellen</span>
          </Button>

          <Button
            variant="outline"
            className="flex flex-col h-auto py-4 justify-center items-center"
            onClick={() => handleAction("announcement")}
          >
            <Bell className="h-5 w-5 mb-1" />
            <span className="text-xs">Ankündigung</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}


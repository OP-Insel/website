import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Shield, CheckSquare, AlertTriangle, Calendar } from "lucide-react"

interface NotificationListProps {
  limit?: number
}

export function NotificationList({ limit }: NotificationListProps) {
  // Beispiel-Benachrichtigungen
  const notifications = [
    {
      id: 1,
      type: "role",
      user: {
        name: "Alex",
        avatar: "https://mc-heads.net/avatar/MHF_Alex",
      },
      message: "wurde zum Moderator befördert",
      time: "Vor 2 Stunden",
      icon: <Shield className="h-4 w-4 text-green-400" />,
    },
    {
      id: 2,
      type: "task",
      user: {
        name: "Steve",
        avatar: "https://mc-heads.net/avatar/MHF_Steve",
      },
      message: "hat die Aufgabe 'Server-Regeln aktualisieren' abgeschlossen",
      time: "Vor 5 Stunden",
      icon: <CheckSquare className="h-4 w-4 text-blue-400" />,
    },
    {
      id: 3,
      type: "warning",
      user: {
        name: "Creeper",
        avatar: "https://mc-heads.net/avatar/MHF_Creeper",
      },
      message: "hat 5 Punkte für einen unrechtmäßigen Bann verloren",
      time: "Vor 1 Tag",
      icon: <AlertTriangle className="h-4 w-4 text-red-400" />,
    },
    {
      id: 4,
      type: "event",
      user: {
        name: "Zombie",
        avatar: "https://mc-heads.net/avatar/MHF_Zombie",
      },
      message: "hat ein neues Team-Meeting für morgen erstellt",
      time: "Vor 2 Tagen",
      icon: <Calendar className="h-4 w-4 text-purple-400" />,
    },
  ]

  const displayNotifications = limit ? notifications.slice(0, limit) : notifications

  return (
    <div className="space-y-4">
      {displayNotifications.map((notification) => (
        <div key={notification.id} className="flex items-start gap-4 rounded-lg border border-gray-800 p-4">
          <div className="mt-0.5">{notification.icon}</div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={notification.user.avatar} alt={notification.user.name} />
                <AvatarFallback>{notification.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="font-medium">{notification.user.name}</span>
              <span className="text-gray-400">{notification.message}</span>
            </div>
            <p className="text-xs text-gray-400">{notification.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}


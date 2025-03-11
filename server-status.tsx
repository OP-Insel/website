"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, Server, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useNotifications } from "@/components/dashboard/notification-provider"

export function ServerStatus() {
  const [status, setStatus] = useState<"online" | "offline" | "loading">("loading")
  const [playerCount, setPlayerCount] = useState<number>(0)
  const [maxPlayers, setMaxPlayers] = useState<number>(50)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
  const { toast } = useToast()
  const { addNotification } = useNotifications()

  // Simulate fetching server status
  const fetchServerStatus = () => {
    setIsRefreshing(true)

    // Simulate API call delay
    setTimeout(() => {
      // For demo purposes, randomly set status
      const isOnline = Math.random() > 0.2 // 80% chance to be online
      setStatus(isOnline ? "online" : "offline")

      if (isOnline) {
        // Random player count between 0 and max
        const newPlayerCount = Math.floor(Math.random() * maxPlayers)
        setPlayerCount(newPlayerCount)

        // If player count is high (>80% capacity), send notification
        if (newPlayerCount > maxPlayers * 0.8) {
          addNotification({
            title: "Hohe Spieleranzahl",
            message: `Der Server ist fast voll! ${newPlayerCount}/${maxPlayers} Spieler online.`,
            type: "warning",
          })
        }
      } else {
        setPlayerCount(0)

        // Send notification if server is offline
        addNotification({
          title: "Server Offline",
          message: "Der OP Insel Server ist offline. Bitte überprüfe die Verbindung.",
          type: "error",
        })
      }

      setLastUpdated(new Date())
      setIsRefreshing(false)

      toast({
        title: "Status aktualisiert",
        description: `Server-Status wurde aktualisiert: ${isOnline ? "Online" : "Offline"}`,
      })
    }, 1500)
  }

  // Fetch status on component mount
  useEffect(() => {
    fetchServerStatus()

    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchServerStatus, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Server-Status
            </CardTitle>
            <CardDescription>OPinsel.de</CardDescription>
          </div>
          {status === "online" ? (
            <Badge className="bg-green-500 hover:bg-green-600">Online</Badge>
          ) : status === "offline" ? (
            <Badge variant="destructive">Offline</Badge>
          ) : (
            <Badge variant="outline">Wird geladen...</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>Spieler online:</span>
            </div>
            <span className="font-medium">{status === "online" ? `${playerCount}/${maxPlayers}` : "0/0"}</span>
          </div>

          {status === "online" && (
            <div className="w-full bg-muted rounded-full h-2.5">
              <div
                className="bg-primary h-2.5 rounded-full"
                style={{ width: `${(playerCount / maxPlayers) * 100}%` }}
              ></div>
            </div>
          )}

          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>Zuletzt aktualisiert: {lastUpdated.toLocaleTimeString()}</span>
            <Button variant="ghost" size="sm" onClick={fetchServerStatus} disabled={isRefreshing} className="h-8 px-2">
              <RefreshCw className={`h-3.5 w-3.5 mr-1 ${isRefreshing ? "animate-spin" : ""}`} />
              Aktualisieren
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


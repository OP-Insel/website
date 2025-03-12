"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Server } from "lucide-react"

// Simulierte API-Funktion
async function fetchServerStatus() {
  await new Promise((resolve) => setTimeout(resolve, 800))
  const isOnline = Math.random() > 0.3

  return {
    status: isOnline ? "online" : "offline",
    players: isOnline ? Math.floor(Math.random() * 20) : 0,
    maxPlayers: 20,
  }
}

export function ServerStatus() {
  const [status, setStatus] = useState<"online" | "offline" | "loading">("loading")
  const [players, setPlayers] = useState<number>(0)
  const [maxPlayers, setMaxPlayers] = useState<number>(0)

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const data = await fetchServerStatus()
        setStatus(data.status)
        setPlayers(data.players)
        setMaxPlayers(data.maxPlayers)
      } catch (error) {
        console.error("Fehler beim Abrufen des Server-Status:", error)
        setStatus("offline")
      }
    }

    checkStatus()
  }, [])

  return (
    <Card className="border-primary/20 bg-card/80">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Server-Status</CardTitle>
          <Server className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold">OPInsel.de</div>
            {status === "loading" ? (
              <p className="text-xs text-muted-foreground">Prüfe Status...</p>
            ) : status === "online" ? (
              <p className="text-xs text-muted-foreground">
                {players}/{maxPlayers} Spieler online
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">Server ist offline</p>
            )}
          </div>
          {status === "loading" ? (
            <Badge variant="outline">Laden...</Badge>
          ) : status === "online" ? (
            <Badge className="bg-green-500">Online</Badge>
          ) : (
            <Badge variant="destructive">Offline</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}


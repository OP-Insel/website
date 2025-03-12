"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, Server, Users, Activity, AlertTriangle } from "lucide-react"

// Echte Minecraft Server Status API Integration
interface ServerData {
  status: "online" | "offline"
  players: {
    online: number
    max: number
    list?: string[]
  }
  version: string
  motd: string
  tps: number
  uptime: string
  plugins: number
}

async function fetchServerStatus(): Promise<ServerData> {
  try {
    // Verwende die tatsächliche Minecraft Server API
    const response = await fetch("https://api.mcsrvstat.us/2/opinsel.de")
    const data = await response.json()

    return {
      status: data.online ? "online" : "offline",
      players: {
        online: data.players?.online || 0,
        max: data.players?.max || 0,
        list: data.players?.list || [],
      },
      version: data.version || "Unknown",
      motd: data.motd?.clean?.[0] || "Willkommen auf OP-Insel!",
      // TPS und Uptime müssen über ein Plugin oder eine eigene API bereitgestellt werden
      tps: 20, // Standardwert
      uptime: "Unknown",
      plugins: data.plugins?.raw?.length || 0,
    }
  } catch (error) {
    console.error("Fehler beim Abrufen des Server-Status:", error)
    return {
      status: "offline",
      players: { online: 0, max: 0 },
      version: "Unknown",
      motd: "Server nicht erreichbar",
      tps: 0,
      uptime: "0h 0m",
      plugins: 0,
    }
  }
}

export default function ServerStatusPage() {
  const [serverData, setServerData] = useState<ServerData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
  const [playerList, setPlayerList] = useState<string[]>([])

  const checkServerStatus = async () => {
    setIsLoading(true)
    try {
      const data = await fetchServerStatus()
      setServerData(data)
      setPlayerList(data.players.list || [])
      setLastRefresh(new Date())
    } catch (error) {
      console.error("Fehler beim Abrufen des Server-Status:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkServerStatus()

    // Aktualisiere alle 5 Minuten
    const interval = setInterval(checkServerStatus, 300000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Server-Status</h1>
        <Button variant="outline" onClick={checkServerStatus} disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Aktualisieren
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card/80 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Server className="h-5 w-5 text-muted-foreground" />
              {isLoading ? (
                <Badge variant="outline">Laden...</Badge>
              ) : serverData?.status === "online" ? (
                <Badge className="bg-green-500">Online</Badge>
              ) : (
                <Badge variant="destructive">Offline</Badge>
              )}
            </div>
            <div className="mt-3 text-2xl font-bold">OPInsel.de</div>
            <p className="text-xs text-muted-foreground mt-1">
              Letzte Aktualisierung: {lastRefresh.toLocaleTimeString()}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/80 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Spieler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Users className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {isLoading ? "Laden..." : serverData?.status === "online" ? "Online" : "Offline"}
              </span>
            </div>
            <div className="mt-3 text-2xl font-bold">
              {isLoading ? (
                <div className="h-8 w-20 bg-muted animate-pulse rounded"></div>
              ) : serverData?.status === "online" ? (
                `${serverData.players.online}/${serverData.players.max}`
              ) : (
                "0/0"
              )}
            </div>
            {playerList.length > 0 && (
              <div className="mt-2 text-xs text-muted-foreground">
                <p className="font-medium mb-1">Online Spieler:</p>
                <ul className="list-disc list-inside">
                  {playerList.map((player) => (
                    <li key={player}>{player}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card/80 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Version & MOTD</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Server className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {isLoading ? "Laden..." : serverData?.status === "online" ? "Info" : "Offline"}
              </span>
            </div>
            <div className="mt-3">
              <p className="text-lg font-bold">{serverData?.version || "Unknown"}</p>
              <p className="text-sm text-muted-foreground mt-1">{serverData?.motd || "Keine MOTD verfügbar"}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/80 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Activity className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {isLoading ? "Laden..." : serverData?.status === "online" ? "TPS" : "Offline"}
              </span>
            </div>
            <div className="mt-3 text-2xl font-bold">
              {isLoading ? (
                <div className="h-8 w-20 bg-muted animate-pulse rounded"></div>
              ) : serverData?.status === "online" ? (
                serverData.tps.toFixed(1)
              ) : (
                "0.0"
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {isLoading ? (
                <div className="h-4 w-32 bg-muted animate-pulse rounded"></div>
              ) : serverData?.status === "online" ? (
                serverData.tps > 19 ? (
                  "Ausgezeichnet"
                ) : serverData.tps > 18 ? (
                  "Gut"
                ) : (
                  "Langsam"
                )
              ) : (
                "Server ist offline"
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      {serverData?.status === "offline" && (
        <Card className="bg-destructive/10 border-destructive/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <h3 className="font-medium text-destructive">Server ist offline</h3>
            </div>
            <p className="mt-2 text-sm text-destructive">
              Der Server ist derzeit nicht erreichbar. Bitte versuche es später erneut oder kontaktiere einen
              Administrator.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}


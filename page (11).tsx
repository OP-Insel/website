"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Search, Trash2, UserPlus } from "lucide-react"

interface WhitelistPlayer {
  id: string
  username: string
  addedOn: string
  addedBy: string
}

export default function WhitelistPage() {
  const { toast } = useToast()
  const [newUsername, setNewUsername] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [players, setPlayers] = useState<WhitelistPlayer[]>([
    {
      id: "1",
      username: "MinecraftPro123",
      addedOn: "2025-03-01",
      addedBy: "Admin",
    },
    {
      id: "2",
      username: "BuilderKing",
      addedOn: "2025-03-05",
      addedBy: "Admin",
    },
    {
      id: "3",
      username: "RedstoneWizard",
      addedOn: "2025-03-08",
      addedBy: "Moderator",
    },
    {
      id: "4",
      username: "ExplorerGirl",
      addedOn: "2025-03-10",
      addedBy: "Admin",
    },
  ])

  const handleAddPlayer = () => {
    if (!newUsername.trim()) {
      toast({
        title: "Fehler",
        description: "Bitte gib einen Benutzernamen ein.",
        variant: "destructive",
      })
      return
    }

    // Check if player already exists
    if (players.some((player) => player.username.toLowerCase() === newUsername.toLowerCase())) {
      toast({
        title: "Fehler",
        description: "Dieser Spieler ist bereits auf der Whitelist.",
        variant: "destructive",
      })
      return
    }

    const newPlayer: WhitelistPlayer = {
      id: Date.now().toString(),
      username: newUsername,
      addedOn: new Date().toISOString().split("T")[0],
      addedBy: "Admin",
    }

    setPlayers([...players, newPlayer])
    setNewUsername("")

    toast({
      title: "Spieler hinzugefügt",
      description: `${newUsername} wurde zur Whitelist hinzugefügt.`,
    })
  }

  const handleRemovePlayer = (id: string) => {
    const playerToRemove = players.find((player) => player.id === id)
    setPlayers(players.filter((player) => player.id !== id))

    toast({
      title: "Spieler entfernt",
      description: `${playerToRemove?.username} wurde von der Whitelist entfernt.`,
    })
  }

  const filteredPlayers = searchQuery
    ? players.filter((player) => player.username.toLowerCase().includes(searchQuery.toLowerCase()))
    : players

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader heading="Whitelist Verwaltung" text="Verwalte die Whitelist für deinen OP Insel Server." />
      <main className="flex-1 p-6 pt-0">
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Spieler hinzufügen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Minecraft Benutzername</Label>
                  <div className="flex gap-2">
                    <Input
                      id="username"
                      placeholder="Benutzername"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                    />
                    <Button onClick={handleAddPlayer}>
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Füge Spieler zur Whitelist hinzu, um ihnen Zugang zum Server zu gewähren.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Whitelist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Spieler suchen..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Benutzername</TableHead>
                        <TableHead>Hinzugefügt am</TableHead>
                        <TableHead>Hinzugefügt von</TableHead>
                        <TableHead className="w-[80px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPlayers.length > 0 ? (
                        filteredPlayers.map((player) => (
                          <TableRow key={player.id}>
                            <TableCell className="font-medium">{player.username}</TableCell>
                            <TableCell>{new Date(player.addedOn).toLocaleDateString()}</TableCell>
                            <TableCell>{player.addedBy}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="icon" onClick={() => handleRemovePlayer(player.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="h-24 text-center">
                            Keine Spieler gefunden.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}


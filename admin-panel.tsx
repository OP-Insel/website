"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"

// Mock data for ranks
const initialRanks = [
  { id: 1, name: "Owner", defaultPoints: Number.POSITIVE_INFINITY, degradationThreshold: null, canBeAssigned: false },
  { id: 2, name: "Co-Owner", defaultPoints: 750, degradationThreshold: 500, canBeAssigned: true },
  { id: 3, name: "Admin", defaultPoints: 500, degradationThreshold: 400, canBeAssigned: true },
  { id: 4, name: "Jr. Admin", defaultPoints: 400, degradationThreshold: 300, canBeAssigned: true },
  { id: 5, name: "Moderator", defaultPoints: 300, degradationThreshold: 250, canBeAssigned: true },
  { id: 6, name: "Jr. Moderator", defaultPoints: 250, degradationThreshold: 200, canBeAssigned: true },
  { id: 7, name: "Supporter", defaultPoints: 200, degradationThreshold: 150, canBeAssigned: true },
  { id: 8, name: "Jr. Supporter", defaultPoints: 150, degradationThreshold: 0, canBeAssigned: true },
  { id: 9, name: "Developer", defaultPoints: 250, degradationThreshold: 200, canBeAssigned: true },
  { id: 10, name: "Sr. Builder", defaultPoints: 300, degradationThreshold: 250, canBeAssigned: true },
  { id: 11, name: "Builder", defaultPoints: 200, degradationThreshold: 150, canBeAssigned: true },
]

// Mock data for point deduction requests
const initialDeductionRequests = [
  {
    id: 1,
    requestedBy: "Moderator1",
    targetUser: "Jr.Supporter1",
    points: -10,
    reason: "Inaktiv ohne Abmeldung für 2 Wochen",
    status: "pending",
    date: "2025-03-05",
  },
  {
    id: 2,
    requestedBy: "Admin1",
    targetUser: "Builder2",
    points: -5,
    reason: "Spamming von Befehlen im Server",
    status: "approved",
    date: "2025-03-04",
    approvedBy: "Co-Owner1",
  },
  {
    id: 3,
    requestedBy: "Jr.Admin1",
    targetUser: "Moderator2",
    points: -15,
    reason: "Beleidigung gegenüber Spielern",
    status: "rejected",
    date: "2025-03-03",
    rejectedBy: "Owner",
  },
]

export function AdminPanel() {
  const [ranks, setRanks] = useState(initialRanks)
  const [deductionRequests, setDeductionRequests] = useState(initialDeductionRequests)
  const [editingRank, setEditingRank] = useState(null)

  const handleRankUpdate = (id, field, value) => {
    setRanks(ranks.map((rank) => (rank.id === id ? { ...rank, [field]: value } : rank)))
  }

  const handleDeductionAction = (id, action) => {
    setDeductionRequests(
      deductionRequests.map((request) =>
        request.id === id
          ? {
              ...request,
              status: action === "approve" ? "approved" : "rejected",
              ...(action === "approve" ? { approvedBy: "Owner" } : { rejectedBy: "Owner" }),
            }
          : request,
      ),
    )
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="ranks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="ranks">Rang-Einstellungen</TabsTrigger>
          <TabsTrigger value="deductions">Punktabzugs-Anfragen</TabsTrigger>
          <TabsTrigger value="settings">Allgemeine Einstellungen</TabsTrigger>
        </TabsList>

        <TabsContent value="ranks" className="space-y-4">
          <div className="flex justify-between">
            <h3 className="text-xl font-medium">Rang-Konfiguration</h3>
            <Button size="sm">Neuen Rang erstellen</Button>
          </div>

          <div className="rounded-md border">
            <div className="grid grid-cols-5 gap-4 p-4 font-medium border-b">
              <div>Rang</div>
              <div>Standard Punkte</div>
              <div>Degradierungs-Schwelle</div>
              <div>Zuweisbar</div>
              <div className="text-right">Aktionen</div>
            </div>
            <ScrollArea className="h-[400px]">
              {ranks.map((rank) => (
                <div key={rank.id} className="grid grid-cols-5 gap-4 p-4 border-b items-center">
                  <div className="font-medium">{rank.name}</div>
                  <div>
                    {editingRank === rank.id ? (
                      <Input
                        type="number"
                        value={rank.defaultPoints === Number.POSITIVE_INFINITY ? 999999 : rank.defaultPoints}
                        onChange={(e) =>
                          handleRankUpdate(rank.id, "defaultPoints", Number.parseInt(e.target.value) || 0)
                        }
                        className="w-24"
                      />
                    ) : (
                      <span>{rank.defaultPoints === Number.POSITIVE_INFINITY ? "∞" : rank.defaultPoints}</span>
                    )}
                  </div>
                  <div>
                    {editingRank === rank.id ? (
                      <Input
                        type="number"
                        value={rank.degradationThreshold === null ? "" : rank.degradationThreshold}
                        onChange={(e) =>
                          handleRankUpdate(rank.id, "degradationThreshold", Number.parseInt(e.target.value) || null)
                        }
                        className="w-24"
                        disabled={rank.name === "Owner"}
                      />
                    ) : (
                      <span>{rank.degradationThreshold === null ? "-" : rank.degradationThreshold}</span>
                    )}
                  </div>
                  <div>
                    {editingRank === rank.id ? (
                      <Switch
                        checked={rank.canBeAssigned}
                        onCheckedChange={(checked) => handleRankUpdate(rank.id, "canBeAssigned", checked)}
                        disabled={rank.name === "Owner"}
                      />
                    ) : (
                      <span>{rank.canBeAssigned ? "Ja" : "Nein"}</span>
                    )}
                  </div>
                  <div className="flex justify-end gap-2">
                    {editingRank === rank.id ? (
                      <>
                        <Button size="sm" variant="outline" onClick={() => setEditingRank(null)}>
                          Abbrechen
                        </Button>
                        <Button size="sm" onClick={() => setEditingRank(null)}>
                          Speichern
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingRank(rank.id)}
                        disabled={rank.name === "Owner"}
                      >
                        Bearbeiten
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>
        </TabsContent>

        <TabsContent value="deductions" className="space-y-4">
          <h3 className="text-xl font-medium">Punktabzugs-Anfragen</h3>

          <div className="grid gap-4">
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Anfragen</SelectItem>
                  <SelectItem value="pending">Ausstehend</SelectItem>
                  <SelectItem value="approved">Genehmigt</SelectItem>
                  <SelectItem value="rejected">Abgelehnt</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="Suche nach Benutzer..." className="flex-1" />
            </div>

            <div className="space-y-4">
              {deductionRequests.map((request) => (
                <Card key={request.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">Punktabzug für {request.targetUser}</CardTitle>
                        <CardDescription>
                          Beantragt von {request.requestedBy} am {request.date}
                        </CardDescription>
                      </div>
                      {request.status === "pending" ? (
                        <Badge className="bg-amber-500">Ausstehend</Badge>
                      ) : request.status === "approved" ? (
                        <Badge className="bg-green-500">Genehmigt</Badge>
                      ) : (
                        <Badge className="bg-red-500">Abgelehnt</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Punktabzug:</span>
                        <Badge variant="outline" className="text-destructive">
                          {request.points} Punkte
                        </Badge>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Grund:</span>
                        <p className="text-sm mt-1">{request.reason}</p>
                      </div>
                      {request.status === "approved" && (
                        <div className="text-sm text-muted-foreground">Genehmigt von {request.approvedBy}</div>
                      )}
                      {request.status === "rejected" && (
                        <div className="text-sm text-muted-foreground">Abgelehnt von {request.rejectedBy}</div>
                      )}
                    </div>
                  </CardContent>
                  {request.status === "pending" && (
                    <CardFooter className="pt-2">
                      <div className="flex gap-2 w-full">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleDeductionAction(request.id, "reject")}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Ablehnen
                        </Button>
                        <Button className="flex-1" onClick={() => handleDeductionAction(request.id, "approve")}>
                          <Check className="mr-2 h-4 w-4" />
                          Genehmigen
                        </Button>
                      </div>
                    </CardFooter>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <h3 className="text-xl font-medium">Allgemeine Einstellungen</h3>

          <Card>
            <CardHeader>
              <CardTitle>Punktesystem-Einstellungen</CardTitle>
              <CardDescription>Konfiguriere die grundlegenden Einstellungen des Punktesystems</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="reset-day">Monatlicher Reset-Tag</Label>
                <Select defaultValue="1">
                  <SelectTrigger id="reset-day">
                    <SelectValue placeholder="Tag auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 28 }, (_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        {i + 1}. des Monats
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-demote">Automatische Degradierung</Label>
                  <p className="text-sm text-muted-foreground">
                    Benutzer automatisch degradieren, wenn sie unter den Schwellenwert fallen
                  </p>
                </div>
                <Switch id="auto-demote" defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="require-approval">Punktabzüge erfordern Genehmigung</Label>
                  <p className="text-sm text-muted-foreground">
                    Alle Punktabzüge müssen von einem Owner oder Co-Owner genehmigt werden
                  </p>
                </div>
                <Switch id="require-approval" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notify-discord">Discord-Benachrichtigungen</Label>
                  <p className="text-sm text-muted-foreground">
                    Benachrichtigungen über Punktänderungen an Discord senden
                  </p>
                </div>
                <Switch id="notify-discord" defaultChecked />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Einstellungen speichern</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}


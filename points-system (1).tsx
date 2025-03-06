"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const violations = [
  { name: "Ban ohne Begründung", points: -5 },
  { name: "Unfaire oder ungerechtfertigte Strafe gegen Spieler", points: -10 },
  { name: "Missbrauch der Admin-Rechte", points: -20 },
  { name: "Beleidigung oder schlechtes Verhalten", points: -15 },
  { name: "Inaktiv ohne Abmeldung", points: -10 },
  { name: "Wiederholtes Fehlverhalten trotz Ermahnung", points: -30 },
  { name: "Spamming von Befehlen oder Nachrichten", points: -5 },
  { name: "Schwere Regelverstöße", points: -20 },
]

const rankDegradations = [
  { from: "Co-Owner", to: "Admin", points: 500 },
  { from: "Admin", to: "Jr. Admin", points: 400 },
  { from: "Jr. Admin", to: "Moderator", points: 300 },
  { from: "Moderator", to: "Jr. Moderator", points: 250 },
  { from: "Jr. Moderator", to: "Supporter", points: 200 },
  { from: "Supporter", to: "Jr. Supporter", points: 150 },
  { from: "Jr. Supporter", to: "Entfernt aus dem Team", points: 0 },
]

// Mock users for the dropdown
const mockUsers = [
  { name: "Steve123", rank: "Moderator" },
  { name: "Alex456", rank: "Builder" },
  { name: "Notch789", rank: "Jr. Admin" },
  { name: "Herobrine", rank: "Jr. Supporter" },
]

export function PointsSystem({ currentUser }) {
  const [selectedViolation, setSelectedViolation] = useState(null)
  const [selectedUser, setSelectedUser] = useState("")
  const [customPoints, setCustomPoints] = useState("")
  const [reason, setReason] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const isAdminOrHigher =
    currentUser?.rank === "Owner" || currentUser?.rank === "Co-Owner" || currentUser?.rank === "Admin"

  const handleSubmitDeduction = () => {
    // In a real app, this would send the deduction request to the server
    console.log({
      targetUser: selectedUser,
      points: selectedViolation
        ? violations.find((v) => v.name === selectedViolation)?.points
        : Number.parseInt(customPoints),
      reason: reason,
      requestedBy: currentUser?.name,
    })

    setSuccessMessage("Punktabzug wurde zur Genehmigung eingereicht.")
    setTimeout(() => {
      setIsDialogOpen(false)
      setSelectedViolation(null)
      setSelectedUser("")
      setCustomPoints("")
      setReason("")

      // Clear success message after dialog closes
      setTimeout(() => {
        setSuccessMessage("")
      }, 300)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-medium">Punktesystem Übersicht</h3>
        {!currentUser?.rank?.includes("Owner") && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">Punktabzug vorschlagen</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Punktabzug vorschlagen</DialogTitle>
                <DialogDescription>
                  Schlage einen Punktabzug für ein Teammitglied vor. Dieser muss von einem Owner oder Co-Owner genehmigt
                  werden.
                </DialogDescription>
              </DialogHeader>

              {successMessage ? (
                <div className="py-6 text-center">
                  <Alert className="bg-green-50 text-green-800 border-green-200">
                    <AlertDescription>{successMessage}</AlertDescription>
                  </Alert>
                </div>
              ) : (
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="user">Benutzer</Label>
                    <Select value={selectedUser} onValueChange={setSelectedUser}>
                      <SelectTrigger id="user">
                        <SelectValue placeholder="Benutzer auswählen" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockUsers.map((user) => (
                          <SelectItem key={user.name} value={user.name}>
                            {user.name} ({user.rank})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="violation">Regelverstoß</Label>
                    <Select value={selectedViolation} onValueChange={setSelectedViolation}>
                      <SelectTrigger id="violation">
                        <SelectValue placeholder="Regelverstoß auswählen" />
                      </SelectTrigger>
                      <SelectContent>
                        {violations.map((violation) => (
                          <SelectItem key={violation.name} value={violation.name}>
                            {violation.name} ({violation.points} Punkte)
                          </SelectItem>
                        ))}
                        <SelectItem value="custom">Benutzerdefinierter Abzug</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedViolation === "custom" && (
                    <div className="grid gap-2">
                      <Label htmlFor="custom-points">Punktabzug</Label>
                      <Input
                        id="custom-points"
                        type="number"
                        placeholder="-10"
                        value={customPoints}
                        onChange={(e) => setCustomPoints(e.target.value)}
                      />
                    </div>
                  )}

                  <div className="grid gap-2">
                    <Label htmlFor="reason">Begründung</Label>
                    <Textarea
                      id="reason"
                      placeholder="Detaillierte Begründung für den Punktabzug..."
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <DialogFooter>
                {!successMessage && (
                  <Button
                    type="submit"
                    onClick={handleSubmitDeduction}
                    disabled={!selectedUser || (!selectedViolation && !customPoints) || !reason}
                  >
                    Vorschlag einreichen
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Punktabzüge für Regelverstöße
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-2">
                {violations.map((violation, index) => (
                  <div key={index} className="flex items-center justify-between rounded-lg border p-3">
                    <span className="text-sm">{violation.name}</span>
                    <Badge variant="destructive">{violation.points} Punkte</Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>📉 Degradierungssystem</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-2">
                {rankDegradations.map((degradation, index) => (
                  <div key={index} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">{degradation.from}</span>
                      <span>→</span>
                      <span className="font-medium">{degradation.to}</span>
                    </div>
                    <Badge variant="secondary">{degradation.points} Punkte</Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>📌 Wichtige Regeln</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <AlertDescription>
                1. Punkte werden am 1. jedes Monats zurückgesetzt, aber Runterstufungen bleiben bestehen
              </AlertDescription>
            </Alert>
            <Alert>
              <AlertDescription>2. Admins und Co-Owner müssen Regelverstöße im Discord protokollieren</AlertDescription>
            </Alert>
            <Alert>
              <AlertDescription>3. Bei 0 Punkten oder weniger wird ein Teammitglied entfernt</AlertDescription>
            </Alert>
            <Alert>
              <AlertDescription>
                4. Owner & Co-Owner können Punkte zurücksetzen oder vergeben, falls jemand unfair behandelt wurde
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


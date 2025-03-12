"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Punktabzüge für Regelverstöße
const VIOLATIONS = {
  "ban-without-reason": { points: -5, label: "Ban ohne Begründung" },
  "unfair-punishment": { points: -10, label: "Unfaire oder ungerechtfertigte Strafe" },
  "admin-abuse": { points: -20, label: "Missbrauch der Admin-Rechte" },
  harassment: { points: -15, label: "Beleidigung oder schlechtes Verhalten" },
  inactivity: { points: -10, label: "Inaktiv ohne Abmeldung" },
  "repeated-misconduct": { points: -30, label: "Wiederholtes Fehlverhalten" },
  spam: { points: -5, label: "Spamming von Befehlen oder Nachrichten" },
  "severe-violation": { points: -20, label: "Schwere Regelverstöße" },
}

// Rang-Degradierungen
const RANK_THRESHOLDS = {
  "co-owner": { points: 500, nextRank: "admin", label: "Co-Owner → Admin" },
  admin: { points: 400, nextRank: "jr-admin", label: "Admin → Jr. Admin" },
  "jr-admin": { points: 300, nextRank: "moderator", label: "Jr. Admin → Moderator" },
  moderator: { points: 250, nextRank: "jr-moderator", label: "Moderator → Jr. Moderator" },
  "jr-moderator": { points: 200, nextRank: "supporter", label: "Jr. Moderator → Supporter" },
  supporter: { points: 150, nextRank: "jr-supporter", label: "Supporter → Jr. Supporter" },
  "jr-supporter": { points: 0, nextRank: "removed", label: "Jr. Supporter → Entfernt" },
}

type User = {
  username: string
  role: string
  points: number
  permissions: string[]
}

export default function PointsPage() {
  const [users, setUsers] = useState<User[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [selectedUser, setSelectedUser] = useState<string>("")
  const [selectedViolation, setSelectedViolation] = useState<string>("")
  const [customPoints, setCustomPoints] = useState<number>(0)
  const [reason, setReason] = useState<string>("")
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [pointsToDeduct, setPointsToDeduct] = useState<number>(0)
  const { toast } = useToast()

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (userData) {
      setCurrentUser(JSON.parse(userData))
    }

    const storedUsers = localStorage.getItem("users")
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers))
    }
  }, [])

  const handleViolationSelect = (violation: string) => {
    setSelectedViolation(violation)
    setPointsToDeduct(Math.abs(VIOLATIONS[violation as keyof typeof VIOLATIONS].points))
  }

  const checkForDegradation = (user: User, newPoints: number) => {
    const currentRankThreshold = RANK_THRESHOLDS[user.role as keyof typeof RANK_THRESHOLDS]

    if (currentRankThreshold && newPoints < currentRankThreshold.points) {
      const newRank = currentRankThreshold.nextRank
      return {
        shouldDegrade: true,
        newRank,
        message: `${user.username} wurde aufgrund zu niedriger Punkte von ${user.role} zu ${newRank} herabgestuft.`,
      }
    }

    return { shouldDegrade: false }
  }

  const handlePointsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowConfirmDialog(true)
  }

  const confirmPointsDeduction = () => {
    if (!selectedUser || (!selectedViolation && customPoints === 0)) {
      toast({
        title: "Fehler",
        description: "Bitte wähle einen Benutzer und gib einen Grund für den Punktabzug an.",
        variant: "destructive",
      })
      return
    }

    const pointsToRemove = selectedViolation
      ? VIOLATIONS[selectedViolation as keyof typeof VIOLATIONS].points
      : -Math.abs(customPoints)

    const updatedUsers = users.map((user) => {
      if (user.username === selectedUser) {
        const newPoints = user.points + pointsToRemove
        const degradation = checkForDegradation(user, newPoints)

        if (degradation.shouldDegrade) {
          return {
            ...user,
            points: newPoints,
            role: degradation.newRank,
          }
        }

        return {
          ...user,
          points: newPoints,
        }
      }
      return user
    })

    setUsers(updatedUsers)
    localStorage.setItem("users", JSON.stringify(updatedUsers))

    // Update current user if they are the selected user
    if (currentUser?.username === selectedUser) {
      const updatedUser = updatedUsers.find((u) => u.username === selectedUser)
      if (updatedUser) {
        setCurrentUser(updatedUser)
        localStorage.setItem("currentUser", JSON.stringify(updatedUser))
      }
    }

    // Add activity
    const activities = JSON.parse(localStorage.getItem("activities") || "[]")
    const newActivity = {
      id: Date.now(),
      user: currentUser?.username,
      action: `hat ${pointsToRemove} Punkte von ${selectedUser} abgezogen: "${reason}"`,
      timestamp: Date.now(),
    }
    localStorage.setItem("activities", JSON.stringify([newActivity, ...activities]))

    toast({
      title: "Punkte aktualisiert",
      description: `${pointsToRemove} Punkte wurden ${selectedUser} abgezogen.`,
    })

    // Check for degradation
    const affectedUser = updatedUsers.find((u) => u.username === selectedUser)
    if (affectedUser) {
      const degradation = checkForDegradation(affectedUser, affectedUser.points)
      if (degradation.shouldDegrade) {
        toast({
          title: "Rang-Degradierung",
          description: degradation.message,
          variant: "warning",
        })
      }
    }

    setSelectedUser("")
    setSelectedViolation("")
    setCustomPoints(0)
    setReason("")
    setShowConfirmDialog(false)
  }

  const canManagePoints = currentUser?.permissions?.includes("manage_points")

  if (!canManagePoints) {
    return (
      <div className="flex h-full items-center justify-center">
        <p>Keine Berechtigung zum Verwalten von Punkten</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Punktesystem</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card/80 border-primary/20">
          <CardHeader>
            <CardTitle>Punktabzug</CardTitle>
            <CardDescription>Ziehe Punkte für Regelverstöße ab</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePointsSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Benutzer</Label>
                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger>
                    <SelectValue placeholder="Benutzer auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {users
                      .filter((user) => user.role !== "pending" && user.username !== currentUser?.username)
                      .map((user) => (
                        <SelectItem key={user.username} value={user.username}>
                          {user.username} ({user.points} Punkte)
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Regelverstoß</Label>
                <Select value={selectedViolation} onValueChange={handleViolationSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Regelverstoß auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(VIOLATIONS).map(([key, violation]) => (
                      <SelectItem key={key} value={key}>
                        {violation.label} ({violation.points} Punkte)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Eigener Punktabzug</Label>
                <Input
                  type="number"
                  value={customPoints === 0 ? "" : customPoints}
                  onChange={(e) => {
                    setCustomPoints(Number(e.target.value))
                    setSelectedViolation("")
                  }}
                  placeholder="Anzahl der Punkte"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label>Begründung</Label>
                <Textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Warum werden Punkte abgezogen?"
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Punkte abziehen
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-card/80 border-primary/20">
          <CardHeader>
            <CardTitle>Rang-Übersicht</CardTitle>
            <CardDescription>Punktegrenzen für Rang-Degradierungen</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(RANK_THRESHOLDS).map(([rank, data]) => (
                <div key={rank} className="flex items-center justify-between">
                  <span className="text-sm">{data.label}</span>
                  <span className="text-sm font-medium">{data.points} Punkte</span>
                </div>
              ))}
              <div className="mt-4 p-4 bg-destructive/10 rounded-md">
                <p className="text-sm text-destructive">
                  Achtung: Bei 0 Punkten wird das Teammitglied automatisch entfernt!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Punktabzug bestätigen</AlertDialogTitle>
            <AlertDialogDescription>
              Möchtest du wirklich {pointsToDeduct} Punkte von {selectedUser} abziehen?
              {selectedUser && users.find((u) => u.username === selectedUser)?.points - pointsToDeduct <= 0 && (
                <p className="mt-2 text-destructive">
                  Warnung: Diese Aktion wird das Teammitglied auf 0 Punkte setzen und zum Ausschluss führen!
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={confirmPointsDeduction}>Bestätigen</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}


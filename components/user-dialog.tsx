"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { NewUser } from "@/lib/types"

interface UserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (userData: NewUser) => void
  initialData?: Partial<NewUser>
}

export default function UserDialog({ open, onOpenChange, onSave, initialData = {} }: UserDialogProps) {
  const [userData, setUserData] = useState<Partial<NewUser>>({
    username: "",
    rank: "Mitglied",
    points: 0,
    ...initialData,
  })

  const handleChange = (field: keyof NewUser, value: string | number) => {
    setUserData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (userData.username && userData.rank) {
      onSave(userData as NewUser)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Benutzer hinzufügen</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Benutzername</Label>
            <Input
              id="username"
              value={userData.username}
              onChange={(e) => handleChange("username", e.target.value)}
              placeholder="Minecraft-Benutzername"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rank">Rang</Label>
            <Select value={userData.rank} onValueChange={(value) => handleChange("rank", value)}>
              <SelectTrigger id="rank">
                <SelectValue placeholder="Rang auswählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mitglied">Mitglied</SelectItem>
                <SelectItem value="Trusted">Trusted</SelectItem>
                <SelectItem value="Moderator">Moderator</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Co-Owner">Co-Owner</SelectItem>
                <SelectItem value="Owner">Owner</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="points">Punkte</Label>
            <Input
              id="points"
              type="number"
              min="0"
              value={userData.points}
              onChange={(e) => handleChange("points", Number.parseInt(e.target.value) || 0)}
            />
          </div>

          <DialogFooter>
            <Button type="submit">Speichern</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}


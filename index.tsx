"use client"

import type React from "react"

import { useState } from "react"
import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const initialRanks = ["Jr. Supporter", "Supporter", "Jr. Moderator", "Moderator", "Jr. Admin", "Admin", "Co-Owner"]

interface AddStaffDialogProps {
  onAddStaff: (name: string, rank: string) => void
}

export function AddStaffDialog({ onAddStaff }: AddStaffDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [rank, setRank] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name && rank) {
      onAddStaff(name, rank)
      setName("")
      setRank("")
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Teammitglied hinzufügen
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Neues Teammitglied</DialogTitle>
          <DialogDescription>
            Füge ein neues Teammitglied hinzu. Alle Teammitglieder starten mit der vollen Punktzahl ihres Ranges.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Minecraft Username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rank">Startrang</Label>
            <Select value={rank} onValueChange={setRank} required>
              <SelectTrigger id="rank">
                <SelectValue placeholder="Wähle einen Rang" />
              </SelectTrigger>
              <SelectContent>
                {initialRanks.map((rank) => (
                  <SelectItem key={rank} value={rank}>
                    {rank}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>
              Abbrechen
            </Button>
            <Button type="submit">Hinzufügen</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}


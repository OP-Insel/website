"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

type Character = {
  id: string
  name: string
  description: string
  creator: string
  imageUrl: string
}

type CharacterFormProps = {
  onSubmit: (character: Character) => void
  onCancel: () => void
}

export function CharacterForm({ onSubmit, onCancel }: CharacterFormProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [imageUrl, setImageUrl] = useState("/placeholder.svg?height=200&width=200")
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (name.trim() === "") return

    const newCharacter: Character = {
      id: Date.now().toString(),
      name,
      description,
      creator: user?.username || "Unbekannt",
      imageUrl: imageUrl || "/placeholder.svg?height=200&width=200",
    }

    onSubmit(newCharacter)
  }

  if (!user) return null

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold">Neuen Charakter erstellen</h2>

      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Beschreibung</Label>
        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">Bild-URL (optional)</Label>
        <Input
          id="imageUrl"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="URL zu einem Bild des Charakters"
        />
        <p className="text-xs text-muted-foreground">Leer lassen für ein Platzhalterbild</p>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Abbrechen
        </Button>
        <Button type="submit">Erstellen</Button>
      </div>
    </form>
  )
}


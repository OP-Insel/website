"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

type Story = {
  id: string
  title: string
  description: string
  author: string
  characters: string[]
  chapters: {
    id: string
    title: string
    scenes: {
      id: string
      title: string
      content: string
    }[]
  }[]
}

type Character = {
  id: string
  name: string
  description: string
  creator: string
  imageUrl: string
}

type StoryFormProps = {
  onSubmit: (story: Story) => void
  onCancel: () => void
  characters: Character[]
}

export function StoryForm({ onSubmit, onCancel, characters }: StoryFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([])
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (title.trim() === "") return

    const newStory: Story = {
      id: Date.now().toString(),
      title,
      description,
      author: user?.username || "Unbekannt",
      characters: selectedCharacters,
      chapters: [],
    }

    onSubmit(newStory)
  }

  const handleCharacterToggle = (characterId: string) => {
    setSelectedCharacters((prev) => {
      if (prev.includes(characterId)) {
        return prev.filter((id) => id !== characterId)
      } else {
        return [...prev, characterId]
      }
    })
  }

  if (!user) return null

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold">Neue Story erstellen</h2>

      <div className="space-y-2">
        <Label htmlFor="title">Titel</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Beschreibung</Label>
        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label>Charaktere</Label>
        <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-2">
          {characters.length === 0 ? (
            <p className="text-center text-muted-foreground py-2">Keine Charaktere vorhanden</p>
          ) : (
            characters.map((character) => (
              <div key={character.id} className="flex items-center gap-2">
                <Checkbox
                  id={`character-${character.id}`}
                  checked={selectedCharacters.includes(character.id)}
                  onCheckedChange={() => handleCharacterToggle(character.id)}
                />
                <label htmlFor={`character-${character.id}`} className="text-sm cursor-pointer">
                  {character.name}
                </label>
              </div>
            ))
          )}
        </div>
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


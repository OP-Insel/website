"use client"

import { useEffect, useState } from "react"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StoryList } from "@/components/story-list"
import { EnhancedStoryEditor } from "@/components/enhanced-story-editor"
import { CharacterForm } from "@/components/character-form"
import { useToast } from "@/hooks/use-toast"
import type { FileData } from "@/components/file-upload"

type StoryPermission = {
  userId: string
  username: string
  role: "viewer" | "editor" | "admin"
  canEdit: boolean
  canDelete: boolean
  canInvite: boolean
}

type StoryTask = {
  id: string
  title: string
  description: string
  assignee: string
  dueDate: string
  completed: boolean
  points: number
}

type Story = {
  id: string
  title: string
  description: string
  author: string
  createdAt: number
  updatedAt: number
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
  files: FileData[]
  permissions: StoryPermission[]
  tasks: StoryTask[]
  pointsPerContribution: number
}

type Character = {
  id: string
  name: string
  description: string
  creator: string
  imageUrl: string
}

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([])
  const [characters, setCharacters] = useState<Character[]>([])
  const [filteredStories, setFilteredStories] = useState<Story[]>([])
  const [filteredCharacters, setFilteredCharacters] = useState<Character[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showStoryForm, setShowStoryForm] = useState(false)
  const [showCharacterForm, setShowCharacterForm] = useState(false)
  const [user, setUser] = useState<any>(null)
  const { toast } = useToast()

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (userData) {
      setUser(JSON.parse(userData))
    }

    // Initialize stories if not exists
    if (!localStorage.getItem("stories")) {
      const initialStories = [
        {
          id: "1",
          title: "Die Legende von OP-Insel",
          description: "Die Entstehungsgeschichte unseres Servers",
          author: "owner",
          createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
          updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
          characters: ["1", "2"],
          chapters: [
            {
              id: "1-1",
              title: "Der Anfang",
              scenes: [
                {
                  id: "1-1-1",
                  title: "Die Idee",
                  content:
                    "<p>Es war einmal ein Minecraft-Spieler, der davon träumte, einen eigenen Server zu erstellen...</p>",
                },
              ],
            },
          ],
          files: [],
          permissions: [],
          tasks: [
            {
              id: "task-1",
              title: "Kapitel 2 schreiben",
              description: "Das zweite Kapitel der Geschichte verfassen",
              assignee: "co-owner",
              dueDate: new Date().toISOString().split("T")[0],
              completed: false,
              points: 10,
            },
            {
              id: "task-2",
              title: "Charakterprofile erstellen",
              description: "Detaillierte Profile für alle Hauptcharaktere erstellen",
              assignee: "",
              dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
              completed: false,
              points: 5,
            },
          ],
          pointsPerContribution: 5,
        },
      ]
      localStorage.setItem("stories", JSON.stringify(initialStories))
    }

    // Initialize characters if not exists
    if (!localStorage.getItem("characters")) {
      const initialCharacters = [
        {
          id: "1",
          name: "Der Gründer",
          description: "Der Gründer des OP-Insel Servers",
          creator: "owner",
          imageUrl: "/placeholder.svg?height=200&width=200",
        },
        {
          id: "2",
          name: "Der Baumeister",
          description: "Ein talentierter Baumeister, der die Welt von OP-Insel gestaltet",
          creator: "co-owner",
          imageUrl: "/placeholder.svg?height=200&width=200",
        },
      ]
      localStorage.setItem("characters", JSON.stringify(initialCharacters))
    }

    const storedStories = localStorage.getItem("stories")
    if (storedStories) {
      const parsedStories = JSON.parse(storedStories)
      setStories(parsedStories)
      setFilteredStories(parsedStories)
    }

    const storedCharacters = localStorage.getItem("characters")
    if (storedCharacters) {
      const parsedCharacters = JSON.parse(storedCharacters)
      setCharacters(parsedCharacters)
      setFilteredCharacters(parsedCharacters)
    }
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredStories(stories)
      setFilteredCharacters(characters)
    } else {
      const query = searchQuery.toLowerCase()

      const filteredS = stories.filter(
        (story) => story.title.toLowerCase().includes(query) || story.description.toLowerCase().includes(query),
      )
      setFilteredStories(filteredS)

      const filteredC = characters.filter(
        (character) =>
          character.name.toLowerCase().includes(query) || character.description.toLowerCase().includes(query),
      )
      setFilteredCharacters(filteredC)
    }
  }, [searchQuery, stories, characters])

  const handleCreateStory = (newStory: Story) => {
    // Ensure all required fields are present
    const completeStory = {
      ...newStory,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      files: [],
      permissions: [],
      tasks: [],
      pointsPerContribution: 5,
    }

    const updatedStories = [...stories, completeStory]
    setStories(updatedStories)
    localStorage.setItem("stories", JSON.stringify(updatedStories))

    // Add activity
    const activities = JSON.parse(localStorage.getItem("activities") || "[]")
    const newActivity = {
      id: Date.now(),
      user: user.username,
      action: `hat eine neue Story erstellt: "${newStory.title}"`,
      timestamp: Date.now(),
    }
    localStorage.setItem("activities", JSON.stringify([newActivity, ...activities]))

    setShowStoryForm(false)
    toast({
      title: "Story erstellt",
      description: "Die Story wurde erfolgreich erstellt.",
    })
  }

  const handleCreateCharacter = (newCharacter: Character) => {
    const updatedCharacters = [...characters, newCharacter]
    setCharacters(updatedCharacters)
    localStorage.setItem("characters", JSON.stringify(updatedCharacters))

    // Add activity
    const activities = JSON.parse(localStorage.getItem("activities") || "[]")
    const newActivity = {
      id: Date.now(),
      user: user.username,
      action: `hat einen neuen Charakter erstellt: "${newCharacter.name}"`,
      timestamp: Date.now(),
    }
    localStorage.setItem("activities", JSON.stringify([newActivity, ...activities]))

    setShowCharacterForm(false)
    toast({
      title: "Charakter erstellt",
      description: "Der Charakter wurde erfolgreich erstellt.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Story-Planer</h1>
        <div className="flex gap-2">
          <Button onClick={() => setShowCharacterForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Neuer Charakter
          </Button>
          <Button onClick={() => setShowStoryForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Neue Story
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Storys und Charaktere durchsuchen..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="stories">
        <TabsList>
          <TabsTrigger value="stories">Storys</TabsTrigger>
          <TabsTrigger value="characters">Charaktere</TabsTrigger>
        </TabsList>
        <TabsContent value="stories">
          <StoryList stories={filteredStories} characters={characters} />
        </TabsContent>
        <TabsContent value="characters">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-4">
            {filteredCharacters.map((character) => (
              <Card key={character.id}>
                <CardContent className="p-6">
                  <div className="aspect-square w-full overflow-hidden rounded-md mb-4">
                    <img
                      src={character.imageUrl || "/placeholder.svg"}
                      alt={character.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <h3 className="font-bold">{character.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{character.description}</p>
                  <p className="text-xs text-muted-foreground mt-4">Erstellt von: {character.creator}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {showStoryForm && (
        <Card className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <CardContent className="w-full max-w-4xl p-6 max-h-[90vh] overflow-auto">
            <EnhancedStoryEditor
              story={{
                id: Date.now().toString(),
                title: "",
                description: "",
                author: user.username,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                characters: [],
                chapters: [],
                files: [],
                permissions: [],
                tasks: [],
                pointsPerContribution: 5,
              }}
              characters={characters}
              onClose={() => setShowStoryForm(false)}
              isOwner={true}
            />
          </CardContent>
        </Card>
      )}

      {showCharacterForm && (
        <Card className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <CardContent className="w-full max-w-md p-6">
            <CharacterForm onSubmit={handleCreateCharacter} onCancel={() => setShowCharacterForm(false)} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}


"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { BookOpen, Plus, Search, User } from "lucide-react"

interface Character {
  id: string
  name: string
  description: string
  imageUrl: string
}

interface Story {
  id: string
  title: string
  description: string
  chapters: Chapter[]
  createdAt: string
  updatedAt: string
}

interface Chapter {
  id: string
  title: string
  content: string
  scenes: Scene[]
}

interface Scene {
  id: string
  title: string
  content: string
  characters: string[] // Character IDs
}

export default function StoryPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [characters, setCharacters] = useState<Character[]>([])
  const [stories, setStories] = useState<Story[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  const [newCharacter, setNewCharacter] = useState<Partial<Character>>({
    name: "",
    description: "",
    imageUrl: "",
  })

  const [newStory, setNewStory] = useState<Partial<Story>>({
    title: "",
    description: "",
    chapters: [],
  })

  const [characterDialogOpen, setCharacterDialogOpen] = useState(false)
  const [storyDialogOpen, setStoryDialogOpen] = useState(false)
  const [canManageStories, setCanManageStories] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      router.push("/")
      return
    }

    const userData = JSON.parse(currentUser)
    setUser(userData)

    // Check if user has permission to manage stories
    const hasPermission =
      userData.role === "owner" ||
      userData.role === "co-owner" ||
      (userData.permissions && userData.permissions.includes("create_content"))
    setCanManageStories(hasPermission)

    // Get stories and characters from localStorage
    const storedCharacters = localStorage.getItem("characters")
    const storedStories = localStorage.getItem("stories")

    if (storedCharacters) {
      setCharacters(JSON.parse(storedCharacters))
    }

    if (storedStories) {
      setStories(JSON.parse(storedStories))
    }

    setLoading(false)
  }, [router])

  const handleCreateCharacter = () => {
    if (!newCharacter.name) {
      toast({
        title: "Fehler",
        description: "Bitte gib einen Namen für den Charakter ein.",
        variant: "destructive",
      })
      return
    }

    const character: Character = {
      id: Date.now().toString(),
      name: newCharacter.name || "",
      description: newCharacter.description || "",
      imageUrl: newCharacter.imageUrl || `/placeholder.svg?height=100&width=100`,
    }

    const updatedCharacters = [...characters, character]
    setCharacters(updatedCharacters)
    localStorage.setItem("characters", JSON.stringify(updatedCharacters))

    // Reset form and close dialog
    setNewCharacter({
      name: "",
      description: "",
      imageUrl: "",
    })
    setCharacterDialogOpen(false)

    toast({
      title: "Erfolg",
      description: "Charakter wurde erstellt.",
    })
  }

  const handleCreateStory = () => {
    if (!newStory.title) {
      toast({
        title: "Fehler",
        description: "Bitte gib einen Titel für die Story ein.",
        variant: "destructive",
      })
      return
    }

    const story: Story = {
      id: Date.now().toString(),
      title: newStory.title || "",
      description: newStory.description || "",
      chapters: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const updatedStories = [...stories, story]
    setStories(updatedStories)
    localStorage.setItem("stories", JSON.stringify(updatedStories))

    // Reset form and close dialog
    setNewStory({
      title: "",
      description: "",
      chapters: [],
    })
    setStoryDialogOpen(false)

    toast({
      title: "Erfolg",
      description: "Story wurde erstellt.",
    })
  }

  const filteredCharacters = characters.filter(
    (character) =>
      character.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      character.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredStories = stories.filter(
    (story) =>
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Laden...</div>
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-3xl font-bold tracking-tight">Story-Planer</h2>
          <div className="flex flex-col md:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Suchen..."
                className="pl-8 w-full md:w-[200px] lg:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {canManageStories && (
              <div className="flex gap-2">
                <Dialog open={characterDialogOpen} onOpenChange={setCharacterDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <User className="mr-2 h-4 w-4" />
                      Charakter
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Neuen Charakter erstellen</DialogTitle>
                      <DialogDescription>Erstelle einen neuen Charakter für deine Storys.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={newCharacter.name}
                          onChange={(e) => setNewCharacter({ ...newCharacter, name: e.target.value })}
                          placeholder="Name des Charakters"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="description">Beschreibung</Label>
                        <Textarea
                          id="description"
                          value={newCharacter.description}
                          onChange={(e) => setNewCharacter({ ...newCharacter, description: e.target.value })}
                          placeholder="Beschreibung des Charakters"
                          rows={4}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="imageUrl">Bild-URL (optional)</Label>
                        <Input
                          id="imageUrl"
                          value={newCharacter.imageUrl}
                          onChange={(e) => setNewCharacter({ ...newCharacter, imageUrl: e.target.value })}
                          placeholder="URL zu einem Bild des Charakters"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleCreateCharacter}>Charakter erstellen</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog open={storyDialogOpen} onOpenChange={setStoryDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Neue Story
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Neue Story erstellen</DialogTitle>
                      <DialogDescription>Erstelle eine neue Story für dein Minecraft-Abenteuer.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="title">Titel</Label>
                        <Input
                          id="title"
                          value={newStory.title}
                          onChange={(e) => setNewStory({ ...newStory, title: e.target.value })}
                          placeholder="Titel der Story"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="storyDescription">Beschreibung</Label>
                        <Textarea
                          id="storyDescription"
                          value={newStory.description}
                          onChange={(e) => setNewStory({ ...newStory, description: e.target.value })}
                          placeholder="Beschreibung der Story"
                          rows={4}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleCreateStory}>Story erstellen</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        </div>

        <Tabs defaultValue="stories">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="stories">
              <BookOpen className="mr-2 h-4 w-4" />
              Storys
            </TabsTrigger>
            <TabsTrigger value="characters">
              <User className="mr-2 h-4 w-4" />
              Charaktere
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stories" className="space-y-4 mt-4">
            {filteredStories.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredStories.map((story) => (
                  <Card key={story.id}>
                    <CardHeader>
                      <CardTitle>{story.title}</CardTitle>
                      <CardDescription>Erstellt am {new Date(story.createdAt).toLocaleDateString()}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {story.description || "Keine Beschreibung vorhanden."}
                      </p>
                      <div className="mt-4">
                        <p className="text-sm font-medium">Kapitel: {story.chapters.length}</p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        <BookOpen className="mr-2 h-4 w-4" />
                        Story öffnen
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <BookOpen className="mx-auto h-10 w-10 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Keine Storys gefunden</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {searchQuery
                    ? "Keine Storys gefunden, die deiner Suche entsprechen."
                    : "Es wurden noch keine Storys erstellt."}
                </p>
                {canManageStories && !searchQuery && (
                  <Button onClick={() => setStoryDialogOpen(true)} className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Neue Story
                  </Button>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="characters" className="space-y-4 mt-4">
            {filteredCharacters.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredCharacters.map((character) => (
                  <Card key={character.id}>
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-md bg-primary flex items-center justify-center text-primary-foreground overflow-hidden">
                          {character.imageUrl ? (
                            <img
                              src={character.imageUrl || "/placeholder.svg"}
                              alt={character.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-xl font-bold">{character.name.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <CardTitle>{character.name}</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {character.description || "Keine Beschreibung vorhanden."}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        Bearbeiten
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <User className="mx-auto h-10 w-10 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Keine Charaktere gefunden</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {searchQuery
                    ? "Keine Charaktere gefunden, die deiner Suche entsprechen."
                    : "Es wurden noch keine Charaktere erstellt."}
                </p>
                {canManageStories && !searchQuery && (
                  <Button onClick={() => setCharacterDialogOpen(true)} className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Neuer Charakter
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}


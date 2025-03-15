"use client"

import { Badge } from "@/components/ui/badge"

import type React from "react"

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
import { BookOpen, Plus, Search, User, FileEdit, Upload } from "lucide-react"
import { RichTextEditor } from "@/components/rich-text-editor"

interface Character {
  id: string
  name: string
  description: string
  imageUrl: string
  createdBy: string
  createdAt: string
  permissions: {
    view: string[] // User IDs
    edit: string[] // User IDs
  }
}

interface Story {
  id: string
  title: string
  description: string
  content: string
  characters: string[] // Character IDs
  createdBy: string
  createdAt: string
  updatedAt: string
  permissions: {
    view: string[] // User IDs
    edit: string[] // User IDs
  }
}

export default function StoriesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [stories, setStories] = useState<Story[]>([])
  const [characters, setCharacters] = useState<Character[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [allUsers, setAllUsers] = useState<any[]>([])

  const [newCharacter, setNewCharacter] = useState<Partial<Character>>({
    name: "",
    description: "",
    imageUrl: "",
    permissions: {
      view: [],
      edit: [],
    },
  })

  const [newStory, setNewStory] = useState<Partial<Story>>({
    title: "",
    description: "",
    content: "",
    characters: [],
    permissions: {
      view: [],
      edit: [],
    },
  })

  const [characterDialogOpen, setCharacterDialogOpen] = useState(false)
  const [storyDialogOpen, setStoryDialogOpen] = useState(false)
  const [canManageStories, setCanManageStories] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [storyContent, setStoryContent] = useState("")

  useEffect(() => {
    // Check if user is logged in
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      router.push("/")
      return
    }

    const userData = JSON.parse(currentUser)
    setUser(userData)

    // Get all users for permissions
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    setAllUsers(users)

    // Check if user has permission to manage stories
    const hasPermission =
      userData.role === "owner" ||
      userData.role === "co-owner" ||
      (userData.permissions && userData.permissions.includes("manage_stories"))
    setCanManageStories(hasPermission)

    // Get stories and characters from localStorage
    const storedCharacters = localStorage.getItem("characters")
    const storedStories = localStorage.getItem("stories")

    if (storedCharacters) {
      const parsedCharacters = JSON.parse(storedCharacters)
      // Filter characters based on permissions
      const filteredCharacters = parsedCharacters.filter(
        (character: Character) =>
          character.createdBy === userData.id ||
          character.permissions.view.includes(userData.id) ||
          userData.role === "owner" ||
          userData.role === "co-owner",
      )
      setCharacters(filteredCharacters)
    }

    if (storedStories) {
      const parsedStories = JSON.parse(storedStories)
      // Filter stories based on permissions
      const filteredStories = parsedStories.filter(
        (story: Story) =>
          story.createdBy === userData.id ||
          story.permissions.view.includes(userData.id) ||
          userData.role === "owner" ||
          userData.role === "co-owner",
      )
      setStories(filteredStories)
    }

    setLoading(false)
  }, [router])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Check file size (limit to 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Image size should be less than 2MB",
          variant: "destructive",
        })
        return
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Error",
          description: "Only image files are allowed",
          variant: "destructive",
        })
        return
      }

      setSelectedFile(file)

      // Create a preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCreateCharacter = () => {
    if (!newCharacter.name) {
      toast({
        title: "Error",
        description: "Please enter a name for the character.",
        variant: "destructive",
      })
      return
    }

    // Convert the file to base64 for storage
    const imageUrl = previewUrl || `/placeholder.svg?height=100&width=100`

    const character: Character = {
      id: Date.now().toString(),
      name: newCharacter.name || "",
      description: newCharacter.description || "",
      imageUrl: imageUrl,
      createdBy: user.id,
      createdAt: new Date().toISOString(),
      permissions: {
        view: newCharacter.permissions?.view || [],
        edit: newCharacter.permissions?.edit || [],
      },
    }

    const updatedCharacters = [...characters, character]
    setCharacters(updatedCharacters)

    // Save to localStorage
    const allCharacters = JSON.parse(localStorage.getItem("characters") || "[]")
    localStorage.setItem("characters", JSON.stringify([...allCharacters, character]))

    // Add to activity log
    const activityLog = JSON.parse(localStorage.getItem("activityLog") || "[]")
    activityLog.unshift({
      id: Date.now().toString(),
      type: "character_created",
      userId: user.id,
      username: user.username,
      timestamp: new Date().toISOString(),
      details: `Created character "${character.name}"`,
    })
    localStorage.setItem("activityLog", JSON.stringify(activityLog))

    // Reset form and close dialog
    setNewCharacter({
      name: "",
      description: "",
      imageUrl: "",
      permissions: {
        view: [],
        edit: [],
      },
    })
    setSelectedFile(null)
    setPreviewUrl("")
    setCharacterDialogOpen(false)

    toast({
      title: "Success",
      description: "Character has been created.",
    })
  }

  const handleCreateStory = () => {
    if (!newStory.title) {
      toast({
        title: "Error",
        description: "Please enter a title for the story.",
        variant: "destructive",
      })
      return
    }

    const story: Story = {
      id: Date.now().toString(),
      title: newStory.title || "",
      description: newStory.description || "",
      content: storyContent || "",
      characters: newStory.characters || [],
      createdBy: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      permissions: {
        view: newStory.permissions?.view || [],
        edit: newStory.permissions?.edit || [],
      },
    }

    const updatedStories = [...stories, story]
    setStories(updatedStories)

    // Save to localStorage
    const allStories = JSON.parse(localStorage.getItem("stories") || "[]")
    localStorage.setItem("stories", JSON.stringify([...allStories, story]))

    // Add to activity log
    const activityLog = JSON.parse(localStorage.getItem("activityLog") || "[]")
    activityLog.unshift({
      id: Date.now().toString(),
      type: "story_created",
      userId: user.id,
      username: user.username,
      timestamp: new Date().toISOString(),
      details: `Created story "${story.title}"`,
    })
    localStorage.setItem("activityLog", JSON.stringify(activityLog))

    // Reset form and close dialog
    setNewStory({
      title: "",
      description: "",
      content: "",
      characters: [],
      permissions: {
        view: [],
        edit: [],
      },
    })
    setStoryContent("")
    setStoryDialogOpen(false)

    toast({
      title: "Success",
      description: "Story has been created.",
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
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-3xl font-bold tracking-tight">Stories & Characters</h2>
          <div className="flex flex-col md:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
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
                      Character
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Character</DialogTitle>
                      <DialogDescription>Create a new character for your stories.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={newCharacter.name}
                          onChange={(e) => setNewCharacter({ ...newCharacter, name: e.target.value })}
                          placeholder="Character name"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={newCharacter.description}
                          onChange={(e) => setNewCharacter({ ...newCharacter, description: e.target.value })}
                          placeholder="Character description"
                          rows={4}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="image">Character Image</Label>
                        <div className="flex items-center gap-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById("character-image")?.click()}
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Image
                          </Button>
                          <Input
                            id="character-image"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                          />
                          {previewUrl && (
                            <div className="relative h-16 w-16 rounded-md overflow-hidden border">
                              <img
                                src={previewUrl || "/placeholder.svg"}
                                alt="Preview"
                                className="h-full w-full object-cover"
                              />
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">Upload an image for your character (max 2MB)</p>
                      </div>

                      {(user.role === "owner" || user.role === "co-owner") && (
                        <div className="grid gap-2">
                          <Label>Permissions</Label>
                          <div className="space-y-2">
                            <Label htmlFor="view-permissions" className="text-sm">
                              Users who can view
                            </Label>
                            <select
                              id="view-permissions"
                              multiple
                              className="w-full h-20 rounded-md border border-input bg-background px-3 py-2 text-sm"
                              value={newCharacter.permissions?.view || []}
                              onChange={(e) => {
                                const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value)
                                setNewCharacter({
                                  ...newCharacter,
                                  permissions: {
                                    ...newCharacter.permissions,
                                    view: selectedOptions,
                                  },
                                })
                              }}
                            >
                              {allUsers
                                .filter((u) => u.id !== user.id && !u.banned)
                                .map((u) => (
                                  <option key={`view-${u.id}`} value={u.id}>
                                    {u.username} ({u.role})
                                  </option>
                                ))}
                            </select>

                            <Label htmlFor="edit-permissions" className="text-sm">
                              Users who can edit
                            </Label>
                            <select
                              id="edit-permissions"
                              multiple
                              className="w-full h-20 rounded-md border border-input bg-background px-3 py-2 text-sm"
                              value={newCharacter.permissions?.edit || []}
                              onChange={(e) => {
                                const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value)
                                setNewCharacter({
                                  ...newCharacter,
                                  permissions: {
                                    ...newCharacter.permissions,
                                    edit: selectedOptions,
                                  },
                                })
                              }}
                            >
                              {allUsers
                                .filter((u) => u.id !== user.id && !u.banned)
                                .map((u) => (
                                  <option key={`edit-${u.id}`} value={u.id}>
                                    {u.username} ({u.role})
                                  </option>
                                ))}
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                    <DialogFooter>
                      <Button onClick={handleCreateCharacter}>Create Character</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog open={storyDialogOpen} onOpenChange={setStoryDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      New Story
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>Create New Story</DialogTitle>
                      <DialogDescription>Create a new story with rich text formatting.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={newStory.title}
                          onChange={(e) => setNewStory({ ...newStory, title: e.target.value })}
                          placeholder="Story title"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="storyDescription">Description</Label>
                        <Textarea
                          id="storyDescription"
                          value={newStory.description}
                          onChange={(e) => setNewStory({ ...newStory, description: e.target.value })}
                          placeholder="Story description"
                          rows={2}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="characters">Characters</Label>
                        <select
                          id="characters"
                          multiple
                          className="w-full h-20 rounded-md border border-input bg-background px-3 py-2 text-sm"
                          value={newStory.characters || []}
                          onChange={(e) => {
                            const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value)
                            setNewStory({
                              ...newStory,
                              characters: selectedOptions,
                            })
                          }}
                        >
                          {characters.map((character) => (
                            <option key={character.id} value={character.id}>
                              {character.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {(user.role === "owner" || user.role === "co-owner") && (
                        <div className="grid gap-2">
                          <Label>Permissions</Label>
                          <div className="space-y-2">
                            <Label htmlFor="story-view-permissions" className="text-sm">
                              Users who can view
                            </Label>
                            <select
                              id="story-view-permissions"
                              multiple
                              className="w-full h-20 rounded-md border border-input bg-background px-3 py-2 text-sm"
                              value={newStory.permissions?.view || []}
                              onChange={(e) => {
                                const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value)
                                setNewStory({
                                  ...newStory,
                                  permissions: {
                                    ...newStory.permissions,
                                    view: selectedOptions,
                                  },
                                })
                              }}
                            >
                              {allUsers
                                .filter((u) => u.id !== user.id && !u.banned)
                                .map((u) => (
                                  <option key={`story-view-${u.id}`} value={u.id}>
                                    {u.username} ({u.role})
                                  </option>
                                ))}
                            </select>

                            <Label htmlFor="story-edit-permissions" className="text-sm">
                              Users who can edit
                            </Label>
                            <select
                              id="story-edit-permissions"
                              multiple
                              className="w-full h-20 rounded-md border border-input bg-background px-3 py-2 text-sm"
                              value={newStory.permissions?.edit || []}
                              onChange={(e) => {
                                const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value)
                                setNewStory({
                                  ...newStory,
                                  permissions: {
                                    ...newStory.permissions,
                                    edit: selectedOptions,
                                  },
                                })
                              }}
                            >
                              {allUsers
                                .filter((u) => u.id !== user.id && !u.banned)
                                .map((u) => (
                                  <option key={`story-edit-${u.id}`} value={u.id}>
                                    {u.username} ({u.role})
                                  </option>
                                ))}
                            </select>
                          </div>
                        </div>
                      )}

                      <div className="grid gap-2">
                        <Label htmlFor="content">Story Content</Label>
                        <RichTextEditor value={storyContent} onChange={setStoryContent} />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleCreateStory}>Create Story</Button>
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
              Stories
            </TabsTrigger>
            <TabsTrigger value="characters">
              <User className="mr-2 h-4 w-4" />
              Characters
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stories" className="space-y-4 mt-4">
            {filteredStories.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredStories.map((story) => (
                  <Card key={story.id}>
                    <CardHeader>
                      <CardTitle>{story.title}</CardTitle>
                      <CardDescription>Created on {new Date(story.createdAt).toLocaleDateString()}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {story.description || "No description available."}
                      </p>
                      <div className="mt-4">
                        <p className="text-sm font-medium">Characters: {story.characters.length}</p>
                        {story.characters.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {story.characters.map((charId) => {
                              const character = characters.find((c) => c.id === charId)
                              return character ? (
                                <Badge key={charId} variant="outline">
                                  {character.name}
                                </Badge>
                              ) : null
                            })}
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        <FileEdit className="mr-2 h-4 w-4" />
                        Open Story
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <BookOpen className="mx-auto h-10 w-10 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No Stories Found</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {searchQuery ? "No stories found matching your search." : "No stories have been created yet."}
                </p>
                {canManageStories && !searchQuery && (
                  <Button onClick={() => setStoryDialogOpen(true)} className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    New Story
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
                        {character.description || "No description available."}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        <FileEdit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <User className="mx-auto h-10 w-10 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No Characters Found</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {searchQuery ? "No characters found matching your search." : "No characters have been created yet."}
                </p>
                {canManageStories && !searchQuery && (
                  <Button onClick={() => setCharacterDialogOpen(true)} className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    New Character
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


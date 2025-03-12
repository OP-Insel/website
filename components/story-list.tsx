"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Edit, BookOpen, Trash, Users, FileText, Calendar } from "lucide-react"
import { EnhancedStoryEditor } from "@/components/enhanced-story-editor"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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

type StoryListProps = {
  stories: Story[]
  characters: Character[]
}

export function StoryList({ stories, characters }: StoryListProps) {
  const [expandedStory, setExpandedStory] = useState<string | null>(null)
  const [editingStory, setEditingStory] = useState<Story | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [storyToDelete, setStoryToDelete] = useState<Story | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (userData) {
      setCurrentUser(JSON.parse(userData))
    }
  }, [])

  const toggleExpand = (storyId: string) => {
    if (expandedStory === storyId) {
      setExpandedStory(null)
    } else {
      setExpandedStory(storyId)
    }
  }

  const handleDeleteStory = (story: Story) => {
    setStoryToDelete(story)
    setShowDeleteDialog(true)
  }

  const confirmDeleteStory = () => {
    if (!storyToDelete) return

    // Remove story from localStorage
    const storedStories = JSON.parse(localStorage.getItem("stories") || "[]")
    const updatedStories = storedStories.filter((s: Story) => s.id !== storyToDelete.id)
    localStorage.setItem("stories", JSON.stringify(updatedStories))

    // Add activity
    const activities = JSON.parse(localStorage.getItem("activities") || "[]")
    const newActivity = {
      id: Date.now(),
      user: currentUser?.username,
      action: `hat die Story "${storyToDelete.title}" gelöscht`,
      timestamp: Date.now(),
    }
    localStorage.setItem("activities", JSON.stringify([newActivity, ...activities]))

    toast({
      title: "Story gelöscht",
      description: "Die Story wurde erfolgreich gelöscht.",
    })

    setShowDeleteDialog(false)
    setStoryToDelete(null)

    // Refresh the page to show updated stories
    window.location.reload()
  }

  const canEditStory = (story: Story) => {
    if (!currentUser) return false

    // Owner can always edit
    if (story.author === currentUser.username) return true

    // Check permissions
    const permission = story.permissions?.find((p) => p.userId === currentUser.username)
    return permission?.canEdit || false
  }

  const canDeleteStory = (story: Story) => {
    if (!currentUser) return false

    // Owner can always delete
    if (story.author === currentUser.username) return true

    // Check permissions
    const permission = story.permissions?.find((p) => p.userId === currentUser.username)
    return permission?.canDelete || false
  }

  const isStoryOwner = (story: Story) => {
    return currentUser?.username === story.author
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("de-DE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-4 mt-4">
      {stories.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">Keine Storys gefunden</p>
      ) : (
        stories.map((story) => {
          // Ensure story has all required fields
          const enhancedStory = {
            ...story,
            createdAt: story.createdAt || Date.now(),
            updatedAt: story.updatedAt || Date.now(),
            files: story.files || [],
            permissions: story.permissions || [],
            tasks: story.tasks || [],
            pointsPerContribution: story.pointsPerContribution || 5,
          }

          const completedTasks = enhancedStory.tasks?.filter((t) => t.completed).length || 0
          const totalTasks = enhancedStory.tasks?.length || 0

          return (
            <Card key={story.id} className="border border-border hover:border-primary/50 transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg">{story.title}</h3>
                      {story.files?.length > 0 && (
                        <Badge variant="outline" className="text-xs">
                          <FileText className="h-3 w-3 mr-1" />
                          {story.files.length} Dateien
                        </Badge>
                      )}
                      {enhancedStory.tasks?.length > 0 && (
                        <Badge variant="outline" className="text-xs">
                          <Calendar className="h-3 w-3 mr-1" />
                          {completedTasks}/{totalTasks} Aufgaben
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={`https://mc-heads.net/avatar/${story.author}`} alt={story.author} />
                        <AvatarFallback>{story.author.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <p className="text-sm text-muted-foreground">
                        Von {story.author} • Erstellt am {formatDate(enhancedStory.createdAt)}
                        {enhancedStory.updatedAt !== enhancedStory.createdAt &&
                          ` • Aktualisiert am ${formatDate(enhancedStory.updatedAt)}`}
                      </p>
                    </div>
                    <div className="mt-2" dangerouslySetInnerHTML={{ __html: story.description }} />

                    {story.characters.length > 0 && (
                      <div className="flex items-center gap-1 mt-3">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Charaktere:{" "}
                          {story.characters
                            .map((charId) => {
                              const char = characters.find((c) => c.id === charId)
                              return char ? char.name : "Unbekannt"
                            })
                            .join(", ")}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {canEditStory(story) && (
                      <Button variant="ghost" size="icon" onClick={() => setEditingStory(enhancedStory)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    {canDeleteStory(story) && (
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteStory(enhancedStory)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => toggleExpand(story.id)}>
                      {expandedStory === story.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {expandedStory === story.id && (
                  <div className="mt-4 space-y-4">
                    {story.chapters.length === 0 ? (
                      <p className="text-center text-muted-foreground py-2">Keine Kapitel vorhanden</p>
                    ) : (
                      story.chapters.map((chapter) => (
                        <div key={chapter.id} className="space-y-2">
                          <h4 className="font-medium">Kapitel: {chapter.title}</h4>
                          {chapter.scenes.map((scene) => (
                            <div key={scene.id} className="border-l-2 border-muted pl-4 py-2">
                              <h5 className="text-sm font-medium">{scene.title}</h5>
                              <div
                                className="text-sm mt-1 prose prose-sm max-w-none dark:prose-invert"
                                dangerouslySetInnerHTML={{ __html: scene.content }}
                              />
                            </div>
                          ))}
                        </div>
                      ))
                    )}

                    {/* Display files if any */}
                    {story.files && story.files.length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-medium mb-2">Dateien</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {story.files.map((file) => (
                            <a
                              key={file.id}
                              href={file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="border rounded-md p-2 hover:bg-muted/50 transition-colors"
                            >
                              {file.type.startsWith("image/") ? (
                                <div className="aspect-square relative rounded-md overflow-hidden mb-2">
                                  <img
                                    src={file.url || "/placeholder.svg"}
                                    alt={file.name}
                                    className="object-cover w-full h-full"
                                  />
                                </div>
                              ) : (
                                <div className="aspect-square flex items-center justify-center bg-muted/50 rounded-md mb-2">
                                  <FileText className="h-8 w-8 text-muted-foreground" />
                                </div>
                              )}
                              <p className="text-xs truncate">{file.name}</p>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
              <CardFooter className="bg-muted/50 px-6 py-3">
                <Button variant="outline" size="sm" className="w-full" onClick={() => toggleExpand(story.id)}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  {expandedStory === story.id ? "Zuklappen" : "Lesen"}
                </Button>
              </CardFooter>
            </Card>
          )
        })
      )}

      {editingStory && (
        <Card className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <CardContent className="w-full max-w-4xl p-6 max-h-[90vh] overflow-auto">
            <EnhancedStoryEditor
              story={editingStory}
              characters={characters}
              onClose={() => setEditingStory(null)}
              isOwner={isStoryOwner(editingStory)}
            />
          </CardContent>
        </Card>
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Story löschen</AlertDialogTitle>
            <AlertDialogDescription>
              Bist du sicher, dass du die Story "{storyToDelete?.title}" löschen möchtest? Diese Aktion kann nicht
              rückgängig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteStory} className="bg-destructive text-destructive-foreground">
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}


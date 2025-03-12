"use client"

import { Textarea } from "@/components/ui/textarea"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, X, ChevronDown, ChevronUp, Users, Settings, FileText, ImageIcon, Calendar, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import dynamic from "next/dynamic"
import "react-quill/dist/quill.snow.css"
import { FileUpload, type FileData } from "@/components/file-upload"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Dynamischer Import von React Quill für Rich Text Editing
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false })

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
    ["clean"],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
  ],
}

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "link",
  "image",
  "color",
  "background",
  "align",
]

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

type User = {
  username: string
  role: string
  points: number
  permissions: string[]
}

type EnhancedStoryEditorProps = {
  story: Story
  characters: Character[]
  onClose: () => void
  isOwner: boolean
}

export function EnhancedStoryEditor({ story, characters, onClose, isOwner }: EnhancedStoryEditorProps) {
  const [title, setTitle] = useState(story.title)
  const [description, setDescription] = useState(story.description)
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>(story.characters)
  const [chapters, setChapters] = useState(story.chapters)
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null)
  const [files, setFiles] = useState<FileData[]>(story.files || [])
  const [permissions, setPermissions] = useState<StoryPermission[]>(story.permissions || [])
  const [tasks, setTasks] = useState<StoryTask[]>(story.tasks || [])
  const [pointsPerContribution, setPointsPerContribution] = useState(story.pointsPerContribution || 5)
  const [activeTab, setActiveTab] = useState("content")
  const [users, setUsers] = useState<User[]>([])
  const [showPermissionDialog, setShowPermissionDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState("")
  const [selectedRole, setSelectedRole] = useState<"viewer" | "editor" | "admin">("viewer")
  const [showTaskDialog, setShowTaskDialog] = useState(false)
  const [currentTask, setCurrentTask] = useState<StoryTask | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Load users
    const storedUsers = localStorage.getItem("users")
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers))
    }
  }, [])

  const handleCharacterToggle = (characterId: string) => {
    setSelectedCharacters((prev) => {
      if (prev.includes(characterId)) {
        return prev.filter((id) => id !== characterId)
      } else {
        return [...prev, characterId]
      }
    })
  }

  const handleAddChapter = () => {
    const newChapter = {
      id: Date.now().toString(),
      title: `Kapitel ${chapters.length + 1}`,
      scenes: [],
    }
    setChapters([...chapters, newChapter])
    setExpandedChapter(newChapter.id)
  }

  const handleRemoveChapter = (chapterId: string) => {
    setChapters(chapters.filter((chapter) => chapter.id !== chapterId))
    if (expandedChapter === chapterId) {
      setExpandedChapter(null)
    }
  }

  const handleUpdateChapterTitle = (chapterId: string, newTitle: string) => {
    setChapters(chapters.map((chapter) => (chapter.id === chapterId ? { ...chapter, title: newTitle } : chapter)))
  }

  const handleAddScene = (chapterId: string) => {
    const chapter = chapters.find((c) => c.id === chapterId)
    if (!chapter) return

    const newScene = {
      id: Date.now().toString(),
      title: `Szene ${chapter.scenes.length + 1}`,
      content: "",
    }

    setChapters(chapters.map((c) => (c.id === chapterId ? { ...c, scenes: [...c.scenes, newScene] } : c)))
  }

  const handleRemoveScene = (chapterId: string, sceneId: string) => {
    setChapters(
      chapters.map((chapter) =>
        chapter.id === chapterId
          ? {
              ...chapter,
              scenes: chapter.scenes.filter((scene) => scene.id !== sceneId),
            }
          : chapter,
      ),
    )
  }

  const handleUpdateSceneTitle = (chapterId: string, sceneId: string, newTitle: string) => {
    setChapters(
      chapters.map((chapter) =>
        chapter.id === chapterId
          ? {
              ...chapter,
              scenes: chapter.scenes.map((scene) => (scene.id === sceneId ? { ...scene, title: newTitle } : scene)),
            }
          : chapter,
      ),
    )
  }

  const handleUpdateSceneContent = useCallback((chapterId: string, sceneId: string, newContent: string) => {
    setChapters((prevChapters) =>
      prevChapters.map((chapter) =>
        chapter.id === chapterId
          ? {
              ...chapter,
              scenes: chapter.scenes.map((scene) => (scene.id === sceneId ? { ...scene, content: newContent } : scene)),
            }
          : chapter,
      ),
    )
  }, [])

  const handleFileUpload = (uploadedFiles: FileData[]) => {
    setFiles(uploadedFiles)
  }

  const handleAddPermission = () => {
    if (!selectedUser || permissions.some((p) => p.userId === selectedUser)) {
      return
    }

    const user = users.find((u) => u.username === selectedUser)
    if (!user) return

    const newPermission: StoryPermission = {
      userId: user.username,
      username: user.username,
      role: selectedRole,
      canEdit: selectedRole === "editor" || selectedRole === "admin",
      canDelete: selectedRole === "admin",
      canInvite: selectedRole === "admin",
    }

    setPermissions([...permissions, newPermission])
    setShowPermissionDialog(false)
    setSelectedUser("")
    setSelectedRole("viewer")
  }

  const handleRemovePermission = (userId: string) => {
    setPermissions(permissions.filter((p) => p.userId !== userId))
  }

  const handleUpdatePermission = (userId: string, field: keyof StoryPermission, value: any) => {
    setPermissions(permissions.map((p) => (p.userId === userId ? { ...p, [field]: value } : p)))
  }

  const handleAddTask = () => {
    setCurrentTask({
      id: Date.now().toString(),
      title: "",
      description: "",
      assignee: "",
      dueDate: new Date().toISOString().split("T")[0],
      completed: false,
      points: 5,
    })
    setShowTaskDialog(true)
  }

  const handleEditTask = (task: StoryTask) => {
    setCurrentTask(task)
    setShowTaskDialog(true)
  }

  const handleRemoveTask = (taskId: string) => {
    setTasks(tasks.filter((t) => t.id !== taskId))
  }

  const handleSaveTask = () => {
    if (!currentTask || !currentTask.title) return

    if (tasks.some((t) => t.id === currentTask.id)) {
      setTasks(tasks.map((t) => (t.id === currentTask.id ? currentTask : t)))
    } else {
      setTasks([...tasks, currentTask])
    }

    setShowTaskDialog(false)
    setCurrentTask(null)
  }

  // Verbesserte handleSave-Funktion mit korrekter Speicherung
  const handleSave = () => {
    const updatedStory: Story = {
      ...story,
      title,
      description,
      characters: selectedCharacters,
      chapters,
      files,
      permissions,
      tasks,
      pointsPerContribution,
      updatedAt: Date.now(),
    }

    // Update stories in localStorage
    const stories = JSON.parse(localStorage.getItem("stories") || "[]")
    const updatedStories = stories.map((s: Story) => (s.id === story.id ? updatedStory : s))
    localStorage.setItem("stories", JSON.stringify(updatedStories))

    // Add activity
    const activities = JSON.parse(localStorage.getItem("activities") || "[]")
    const newActivity = {
      id: Date.now(),
      user: story.author,
      action: `hat die Story "${story.title}" bearbeitet`,
      timestamp: Date.now(),
    }
    localStorage.setItem("activities", JSON.stringify([newActivity, ...activities]))

    // Update current user if they earned points for contribution
    if (story.author !== updatedStory.author) {
      const currentUserData = localStorage.getItem("currentUser")
      if (currentUserData) {
        const currentUser = JSON.parse(currentUserData)
        if (currentUser.username === updatedStory.author) {
          // Add points for contribution
          currentUser.points += pointsPerContribution
          localStorage.setItem("currentUser", JSON.stringify(currentUser))

          // Update user in users list
          const users = JSON.parse(localStorage.getItem("users") || "[]")
          const updatedUsers = users.map((u: any) =>
            u.username === currentUser.username ? { ...u, points: currentUser.points } : u,
          )
          localStorage.setItem("users", JSON.stringify(updatedUsers))
        }
      }
    }

    toast({
      title: "Story gespeichert",
      description: "Die Story wurde erfolgreich gespeichert.",
    })

    onClose()
  }

  const handleDeleteStory = () => {
    if (!isOwner) return

    // Remove story from localStorage
    const stories = JSON.parse(localStorage.getItem("stories") || "[]")
    const updatedStories = stories.filter((s: Story) => s.id !== story.id)
    localStorage.setItem("stories", JSON.stringify(updatedStories))

    // Add activity
    const activities = JSON.parse(localStorage.getItem("activities") || "[]")
    const newActivity = {
      id: Date.now(),
      user: story.author,
      action: `hat die Story "${story.title}" gelöscht`,
      timestamp: Date.now(),
    }
    localStorage.setItem("activities", JSON.stringify([newActivity, ...activities]))

    toast({
      title: "Story gelöscht",
      description: "Die Story wurde erfolgreich gelöscht.",
    })

    onClose()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Story bearbeiten</h2>
        <div className="flex gap-2">
          {isOwner && (
            <Button variant="destructive" size="sm" onClick={handleDeleteStory}>
              Löschen
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={onClose}>
            Schließen
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="content">
            <FileText className="h-4 w-4 mr-2" />
            Inhalt
          </TabsTrigger>
          <TabsTrigger value="files">
            <ImageIcon className="h-4 w-4 mr-2" />
            Dateien
          </TabsTrigger>
          <TabsTrigger value="tasks">
            <Calendar className="h-4 w-4 mr-2" />
            Aufgaben
          </TabsTrigger>
          {isOwner && (
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Einstellungen
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="content" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titel</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Beschreibung</Label>
            <ReactQuill
              theme="snow"
              value={description}
              onChange={setDescription}
              modules={{
                toolbar: [["bold", "italic", "underline"], [{ list: "ordered" }, { list: "bullet" }], ["link"]],
              }}
              formats={["bold", "italic", "underline", "list", "bullet", "link"]}
              className="bg-background"
            />
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

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Kapitel</Label>
              <Button type="button" variant="outline" size="sm" onClick={handleAddChapter}>
                <Plus className="h-4 w-4 mr-1" /> Kapitel
              </Button>
            </div>

            <div className="space-y-4">
              {chapters.length === 0 ? (
                <p className="text-center text-muted-foreground py-4 border rounded-md">Keine Kapitel vorhanden</p>
              ) : (
                chapters.map((chapter) => (
                  <div key={chapter.id} className="border rounded-md overflow-hidden">
                    <div className="flex items-center justify-between bg-muted p-2">
                      <Input
                        value={chapter.title}
                        onChange={(e) => handleUpdateChapterTitle(chapter.id, e.target.value)}
                        className="h-8 w-auto max-w-[70%] bg-background"
                      />
                      <div className="flex gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            if (expandedChapter === chapter.id) {
                              setExpandedChapter(null)
                            } else {
                              setExpandedChapter(chapter.id)
                            }
                          }}
                        >
                          {expandedChapter === chapter.id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleRemoveChapter(chapter.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {expandedChapter === chapter.id && (
                      <div className="p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>Szenen</Label>
                          <Button type="button" variant="outline" size="sm" onClick={() => handleAddScene(chapter.id)}>
                            <Plus className="h-4 w-4 mr-1" /> Szene
                          </Button>
                        </div>

                        <div className="space-y-4">
                          {chapter.scenes.length === 0 ? (
                            <p className="text-center text-muted-foreground py-4 border rounded-md">
                              Keine Szenen vorhanden
                            </p>
                          ) : (
                            chapter.scenes.map((scene) => (
                              <div key={scene.id} className="border rounded-md p-4 space-y-2">
                                <div className="flex items-center justify-between">
                                  <Input
                                    value={scene.title}
                                    onChange={(e) => handleUpdateSceneTitle(chapter.id, scene.id, e.target.value)}
                                    className="h-8 w-auto max-w-[70%]"
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-destructive"
                                    onClick={() => handleRemoveScene(chapter.id, scene.id)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                                <ReactQuill
                                  theme="snow"
                                  value={scene.content}
                                  onChange={(content) => handleUpdateSceneContent(chapter.id, scene.id, content)}
                                  modules={modules}
                                  formats={formats}
                                  className="bg-background"
                                />
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="files" className="mt-4">
          <FileUpload onFileUpload={handleFileUpload} existingFiles={files} />
        </TabsContent>

        <TabsContent value="tasks" className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Aufgaben</h3>
            <Button onClick={handleAddTask} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Neue Aufgabe
            </Button>
          </div>

          {tasks.length === 0 ? (
            <div className="text-center py-8 border rounded-md">
              <p className="text-muted-foreground">Keine Aufgaben vorhanden</p>
              <Button onClick={handleAddTask} variant="outline" className="mt-4">
                Erste Aufgabe erstellen
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="border rounded-md p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={(checked) => {
                            setTasks(tasks.map((t) => (t.id === task.id ? { ...t, completed: checked as boolean } : t)))
                          }}
                          id={`task-${task.id}`}
                        />
                        <label
                          htmlFor={`task-${task.id}`}
                          className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}
                        >
                          {task.title}
                        </label>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditTask(task)}>
                        Bearbeiten
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => handleRemoveTask(task.id)}
                      >
                        Löschen
                      </Button>
                    </div>
                  </div>
                  <div className="flex gap-4 mt-3 text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{task.assignee || "Nicht zugewiesen"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "Kein Datum"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{task.points} Punkte</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Dialog open={showTaskDialog} onOpenChange={setShowTaskDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{currentTask?.id ? "Aufgabe bearbeiten" : "Neue Aufgabe"}</DialogTitle>
                <DialogDescription>Erstelle oder bearbeite eine Aufgabe für diese Story.</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="task-title">Titel</Label>
                  <Input
                    id="task-title"
                    value={currentTask?.title || ""}
                    onChange={(e) => setCurrentTask((prev) => (prev ? { ...prev, title: e.target.value } : null))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="task-description">Beschreibung</Label>
                  <Textarea
                    id="task-description"
                    value={currentTask?.description || ""}
                    onChange={(e) => setCurrentTask((prev) => (prev ? { ...prev, description: e.target.value } : null))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="task-assignee">Zugewiesen an</Label>
                  <Select
                    value={currentTask?.assignee || ""}
                    onValueChange={(value) => setCurrentTask((prev) => (prev ? { ...prev, assignee: value } : null))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Wähle einen Benutzer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nicht zugewiesen</SelectItem>
                      {users.map((user) => (
                        <SelectItem key={user.username} value={user.username}>
                          {user.username}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="task-due-date">Fälligkeitsdatum</Label>
                  <Input
                    id="task-due-date"
                    type="date"
                    value={currentTask?.dueDate || ""}
                    onChange={(e) => setCurrentTask((prev) => (prev ? { ...prev, dueDate: e.target.value } : null))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="task-points">Punkte</Label>
                  <Input
                    id="task-points"
                    type="number"
                    min="1"
                    value={currentTask?.points || 5}
                    onChange={(e) =>
                      setCurrentTask((prev) =>
                        prev ? { ...prev, points: Number.parseInt(e.target.value) || 1 } : null,
                      )
                    }
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowTaskDialog(false)}>
                  Abbrechen
                </Button>
                <Button onClick={handleSaveTask}>Speichern</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {isOwner && (
          <TabsContent value="settings" className="mt-4 space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Berechtigungen</h3>

              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">Wer kann diese Story sehen und bearbeiten?</p>
                <Button variant="outline" size="sm" onClick={() => setShowPermissionDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Benutzer hinzufügen
                </Button>
              </div>

              <div className="border rounded-md divide-y">
                {/* Owner row - cannot be modified */}
                <div className="p-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`https://mc-heads.net/avatar/${story.author}`} alt={story.author} />
                      <AvatarFallback>{story.author.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{story.author} (Besitzer)</p>
                      <p className="text-xs text-muted-foreground">Voller Zugriff</p>
                    </div>
                  </div>
                </div>

                {/* Other users with permissions */}
                {permissions.map((permission) => (
                  <div key={permission.userId} className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={`https://mc-heads.net/avatar/${permission.username}`}
                            alt={permission.username}
                          />
                          <AvatarFallback>{permission.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{permission.username}</p>
                          <p className="text-xs text-muted-foreground">
                            {permission.role === "admin"
                              ? "Administrator"
                              : permission.role === "editor"
                                ? "Bearbeiter"
                                : "Betrachter"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() => handleRemovePermission(permission.userId)}
                        >
                          Entfernen
                        </Button>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={`perm-edit-${permission.userId}`} className="text-sm">
                          Bearbeiten
                        </Label>
                        <Switch
                          id={`perm-edit-${permission.userId}`}
                          checked={permission.canEdit}
                          onCheckedChange={(checked) => handleUpdatePermission(permission.userId, "canEdit", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor={`perm-delete-${permission.userId}`} className="text-sm">
                          Löschen
                        </Label>
                        <Switch
                          id={`perm-delete-${permission.userId}`}
                          checked={permission.canDelete}
                          onCheckedChange={(checked) => handleUpdatePermission(permission.userId, "canDelete", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor={`perm-invite-${permission.userId}`} className="text-sm">
                          Einladen
                        </Label>
                        <Switch
                          id={`perm-invite-${permission.userId}`}
                          checked={permission.canInvite}
                          onCheckedChange={(checked) => handleUpdatePermission(permission.userId, "canInvite", checked)}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {permissions.length === 0 && (
                  <div className="p-4 text-center text-muted-foreground">
                    Keine weiteren Benutzer haben Zugriff auf diese Story.
                  </div>
                )}
              </div>

              <Dialog open={showPermissionDialog} onOpenChange={setShowPermissionDialog}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Benutzer hinzufügen</DialogTitle>
                    <DialogDescription>Füge einen Benutzer hinzu und lege seine Berechtigungen fest.</DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Benutzer</Label>
                      <Select value={selectedUser} onValueChange={setSelectedUser}>
                        <SelectTrigger>
                          <SelectValue placeholder="Wähle einen Benutzer" />
                        </SelectTrigger>
                        <SelectContent>
                          {users
                            .filter(
                              (user) =>
                                user.username !== story.author && !permissions.some((p) => p.userId === user.username),
                            )
                            .map((user) => (
                              <SelectItem key={user.username} value={user.username}>
                                {user.username}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Rolle</Label>
                      <Select
                        value={selectedRole}
                        onValueChange={(value: "viewer" | "editor" | "admin") => setSelectedRole(value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Wähle eine Rolle" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="viewer">Betrachter (nur lesen)</SelectItem>
                          <SelectItem value="editor">Bearbeiter (lesen & bearbeiten)</SelectItem>
                          <SelectItem value="admin">Administrator (voller Zugriff)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowPermissionDialog(false)}>
                      Abbrechen
                    </Button>
                    <Button onClick={handleAddPermission}>Hinzufügen</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Punktesystem</h3>

              <div className="space-y-2">
                <Label htmlFor="points-per-contribution">Punkte pro Beitrag</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="points-per-contribution"
                    type="number"
                    min="1"
                    value={pointsPerContribution}
                    onChange={(e) => setPointsPerContribution(Number.parseInt(e.target.value) || 1)}
                    className="max-w-[200px]"
                  />
                  <p className="text-sm text-muted-foreground">
                    Punkte, die Benutzer für Beiträge zu dieser Story erhalten.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        )}
      </Tabs>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Abbrechen
        </Button>
        <Button type="button" onClick={handleSave}>
          Speichern
        </Button>
      </div>
    </div>
  )
}


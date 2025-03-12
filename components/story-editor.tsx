"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, X, ChevronDown, ChevronUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import dynamic from "next/dynamic"
import "react-quill/dist/quill.snow.css"

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

type StoryEditorProps = {
  story: Story
  characters: Character[]
  onClose: () => void
}

export function StoryEditor({ story, characters, onClose }: StoryEditorProps) {
  const [title, setTitle] = useState(story.title)
  const [description, setDescription] = useState(story.description)
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>(story.characters)
  const [chapters, setChapters] = useState(story.chapters)
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null)
  const { toast } = useToast()

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

  const handleUpdateSceneContent = useCallback(
    (chapterId: string, sceneId: string, newContent: string) => {
      setChapters(
        chapters.map((chapter) =>
          chapter.id === chapterId
            ? {
                ...chapter,
                scenes: chapter.scenes.map((scene) =>
                  scene.id === sceneId ? { ...scene, content: newContent } : scene,
                ),
              }
            : chapter,
        ),
      )
    },
    [chapters],
  )

  const handleSave = () => {
    const updatedStory: Story = {
      ...story,
      title,
      description,
      characters: selectedCharacters,
      chapters,
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

    toast({
      title: "Story gespeichert",
      description: "Die Story wurde erfolgreich gespeichert.",
    })

    onClose()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Story bearbeiten</h2>
        <Button variant="outline" size="sm" onClick={onClose}>
          Schließen
        </Button>
      </div>

      <div className="space-y-4">
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
      </div>

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


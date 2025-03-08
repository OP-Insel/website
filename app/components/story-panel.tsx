"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { BookOpen, Edit, Plus, Scroll } from "lucide-react"

export function StoryPanel({ stories, isAdmin, isOperator, onAddStory, onUpdateStory }) {
  const [selectedStory, setSelectedStory] = useState(null)
  const [newStory, setNewStory] = useState({
    title: "",
    description: "",
    content: "",
    status: "draft",
    chapter: 1,
  })
  const [editStory, setEditStory] = useState(null)

  const handleNewStoryChange = (e) => {
    const { name, value } = e.target
    setNewStory((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditStoryChange = (e) => {
    const { name, value } = e.target
    setEditStory((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddStory = () => {
    onAddStory(newStory)
    setNewStory({
      title: "",
      description: "",
      content: "",
      status: "draft",
      chapter: 1,
    })
  }

  const handleUpdateStory = () => {
    onUpdateStory(editStory)
    setEditStory(null)
  }

  const handleEditClick = (story) => {
    setEditStory({ ...story })
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-1 bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle>Story Chapters</CardTitle>
          <CardDescription className="text-zinc-400">OP-Insel server storyline</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {stories.length > 0 ? (
              stories.map((story) => (
                <div
                  key={story.id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-zinc-800 transition-colors ${
                    selectedStory?.id === story.id ? "bg-zinc-800" : ""
                  }`}
                  onClick={() => setSelectedStory(story)}
                >
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-800">
                    <BookOpen className="h-4 w-4 text-zinc-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{story.title}</p>
                      <Badge
                        className={
                          story.status === "published"
                            ? "bg-green-600"
                            : story.status === "draft"
                              ? "bg-yellow-600"
                              : "bg-blue-600"
                        }
                      >
                        {story.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-zinc-400 truncate">
                      Chapter {story.chapter} • {formatDate(story.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-zinc-500">No story chapters yet</div>
            )}
          </div>

          {isAdmin && (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Chapter
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Story Chapter</DialogTitle>
                  <DialogDescription>Create a new chapter for the OP-Insel storyline</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Chapter Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={newStory.title}
                      onChange={handleNewStoryChange}
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="chapter">Chapter Number</Label>
                      <Input
                        id="chapter"
                        name="chapter"
                        type="number"
                        value={newStory.chapter}
                        onChange={handleNewStoryChange}
                        className="bg-zinc-800 border-zinc-700"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="status">Status</Label>
                      <select
                        id="status"
                        name="status"
                        value={newStory.status}
                        onChange={handleNewStoryChange}
                        className="bg-zinc-800 border-zinc-700 rounded-md p-2 text-white"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="upcoming">Upcoming</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Short Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={newStory.description}
                      onChange={handleNewStoryChange}
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="content">Story Content</Label>
                    <Textarea
                      id="content"
                      name="content"
                      value={newStory.content}
                      onChange={handleNewStoryChange}
                      className="min-h-[150px] bg-zinc-800 border-zinc-700"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button onClick={handleAddStory}>Add Chapter</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </CardContent>
      </Card>

      <Card className="md:col-span-2 bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle>{selectedStory ? selectedStory.title : "Story Details"}</CardTitle>
          <CardDescription className="text-zinc-400">
            {selectedStory
              ? `Chapter ${selectedStory.chapter} • ${formatDate(selectedStory.createdAt)}`
              : "Select a chapter to view details"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedStory ? (
            <Tabs defaultValue="story">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="story">Story</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>

              <TabsContent value="story" className="space-y-4">
                <div className="prose prose-invert max-w-none">
                  <div className="flex items-center gap-2 mb-4">
                    <Scroll className="h-5 w-5 text-zinc-400" />
                    <h3 className="text-xl font-semibold m-0">
                      Chapter {selectedStory.chapter}: {selectedStory.title}
                    </h3>
                  </div>

                  <div className="bg-zinc-800 p-4 rounded-lg mb-4">
                    <p className="italic text-zinc-300">{selectedStory.description}</p>
                  </div>

                  <div className="whitespace-pre-line">{selectedStory.content}</div>
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Chapter Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>Title:</span>
                        <span className="font-medium">{selectedStory.title}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Chapter:</span>
                        <span className="font-medium">{selectedStory.chapter}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Status:</span>
                        <Badge
                          className={
                            selectedStory.status === "published"
                              ? "bg-green-600"
                              : selectedStory.status === "draft"
                                ? "bg-yellow-600"
                                : "bg-blue-600"
                          }
                        >
                          {selectedStory.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Created:</span>
                        <span className="font-medium">{formatDate(selectedStory.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Story Locations</h3>
                    <div className="space-y-2">
                      <div className="p-2 bg-zinc-800 rounded-lg">
                        <p className="font-medium">The Lost Kingdom</p>
                        <p className="text-sm text-zinc-400">x: 250, y: 70, z: -420</p>
                      </div>
                      <div className="p-2 bg-zinc-800 rounded-lg">
                        <p className="font-medium">Ancient Temple</p>
                        <p className="text-sm text-zinc-400">x: 500, y: 40, z: -200</p>
                      </div>
                      <div className="p-2 bg-zinc-800 rounded-lg">
                        <p className="font-medium">Dragon's Lair</p>
                        <p className="text-sm text-zinc-400">x: -300, y: 60, z: 150</p>
                      </div>
                    </div>
                  </div>
                </div>

                {isAdmin && (
                  <div className="flex justify-end gap-2 pt-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" onClick={() => handleEditClick(selectedStory)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Chapter
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Edit Story Chapter</DialogTitle>
                          <DialogDescription>Update the details for this chapter</DialogDescription>
                        </DialogHeader>
                        {editStory && (
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="edit-title">Chapter Title</Label>
                              <Input
                                id="edit-title"
                                name="title"
                                value={editStory.title}
                                onChange={handleEditStoryChange}
                                className="bg-zinc-800 border-zinc-700"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                <Label htmlFor="edit-chapter">Chapter Number</Label>
                                <Input
                                  id="edit-chapter"
                                  name="chapter"
                                  type="number"
                                  value={editStory.chapter}
                                  onChange={handleEditStoryChange}
                                  className="bg-zinc-800 border-zinc-700"
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="edit-status">Status</Label>
                                <select
                                  id="edit-status"
                                  name="status"
                                  value={editStory.status}
                                  onChange={handleEditStoryChange}
                                  className="bg-zinc-800 border-zinc-700 rounded-md p-2 text-white"
                                >
                                  <option value="draft">Draft</option>
                                  <option value="published">Published</option>
                                  <option value="upcoming">Upcoming</option>
                                </select>
                              </div>
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="edit-description">Short Description</Label>
                              <Textarea
                                id="edit-description"
                                name="description"
                                value={editStory.description}
                                onChange={handleEditStoryChange}
                                className="bg-zinc-800 border-zinc-700"
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="edit-content">Story Content</Label>
                              <Textarea
                                id="edit-content"
                                name="content"
                                value={editStory.content}
                                onChange={handleEditStoryChange}
                                className="min-h-[150px] bg-zinc-800 border-zinc-700"
                              />
                            </div>
                          </div>
                        )}
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setEditStory(null)}>
                            Cancel
                          </Button>
                          <Button onClick={handleUpdateStory}>Save Changes</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    {isOperator && selectedStory.status !== "published" && <Button>Publish Chapter</Button>}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          ) : (
            <div className="text-center py-16 text-zinc-500 flex flex-col items-center">
              <BookOpen className="h-12 w-12 mb-4" />
              <p className="text-lg">Select a chapter from the list to view its details</p>
              {stories.length === 0 && isAdmin && <p className="mt-2">Or add a new chapter to get started</p>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


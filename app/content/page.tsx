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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { FileText, Plus, Search, Edit, Trash2, Eye, User, AlertTriangle, Calendar, Filter } from "lucide-react"
import { RichTextEditor } from "@/components/rich-text-editor"
import {
  getContent,
  getRoles,
  addActivityLogEntry,
  canModifyContent,
  updateContent,
  deleteContent,
  getUsers,
} from "@/lib/store"
import type { Content, Role } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export default function ContentPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<User | null>(null)
  const [content, setContent] = useState<Content[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [contentType, setContentType] = useState<string>("all")

  // New content state
  const [newContent, setNewContent] = useState<Partial<Content>>({
    title: "",
    body: "",
    type: "post",
    permissions: {
      view: [],
      edit: [],
      delete: [],
    },
  })

  // Edit content state
  const [editingContent, setEditingContent] = useState<Content | null>(null)
  const [editContentBody, setEditContentBody] = useState("")

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [viewingContent, setViewingContent] = useState<Content | null>(null)

  // Permission management
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [permissionType, setPermissionType] = useState<"view" | "edit" | "delete">("view")

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
    setAllUsers(getUsers())

    // Get all roles
    setRoles(getRoles())

    // Get content from localStorage
    const allContent = getContent()

    // Filter content based on permissions
    const filteredContent = allContent.filter(
      (item) =>
        // Content creator can always see their content
        item.createdBy === userData.id ||
        // Check view permissions
        canModifyContent(userData.id, item, "view") ||
        // Owners and co-owners can see all content
        userData.role === "owner" ||
        userData.role === "co-owner",
    )

    setContent(filteredContent)
    setLoading(false)
  }, [router])

  const handleCreateContent = () => {
    if (!user) return

    if (!newContent.title || !newContent.body) {
      toast({
        title: "Error",
        description: "Please provide both a title and content.",
        variant: "destructive",
      })
      return
    }

    const now = new Date().toISOString()

    // Create new content object
    const contentItem: Content = {
      id: Date.now().toString(),
      type: newContent.type as "story" | "character" | "post" | "comment",
      title: newContent.title,
      body: newContent.body || "",
      createdAt: now,
      updatedAt: now,
      createdBy: user.id,
      permissions: {
        view: [...(newContent.permissions?.view || [])],
        edit: [...(newContent.permissions?.edit || [])],
        delete: [...(newContent.permissions?.delete || [])],
      },
    }

    // Add to content array
    const updatedContent = [...content, contentItem]

    // Save to localStorage
    const allContent = getContent()
    localStorage.setItem("content", JSON.stringify([...allContent, contentItem]))

    // Update state
    setContent(updatedContent)

    // Add to activity log
    addActivityLogEntry({
      id: Date.now().toString(),
      type: "content_created",
      userId: user.id,
      username: user.username,
      timestamp: now,
      details: `Created ${contentItem.type}: ${contentItem.title}`,
    })

    // Reset form and close dialog
    setNewContent({
      title: "",
      body: "",
      type: "post",
      permissions: {
        view: [],
        edit: [],
        delete: [],
      },
    })
    setCreateDialogOpen(false)

    toast({
      title: "Success",
      description: "Content has been created.",
    })
  }

  const handleEditContent = () => {
    if (!user || !editingContent) return

    if (!editingContent.title || !editContentBody) {
      toast({
        title: "Error",
        description: "Please provide both a title and content.",
        variant: "destructive",
      })
      return
    }

    // Check if user has permission to edit
    if (!canModifyContent(user.id, editingContent, "edit")) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to edit this content.",
        variant: "destructive",
      })
      return
    }

    // Update content
    const updatedContentItem: Content = {
      ...editingContent,
      body: editContentBody,
      updatedAt: new Date().toISOString(),
    }

    // Update in localStorage
    updateContent(updatedContentItem)

    // Update in state
    const updatedContent = content.map((item) => (item.id === updatedContentItem.id ? updatedContentItem : item))
    setContent(updatedContent)

    // Add to activity log
    addActivityLogEntry({
      id: Date.now().toString(),
      type: "content_edited",
      userId: user.id,
      username: user.username,
      timestamp: new Date().toISOString(),
      details: `Edited ${updatedContentItem.type}: ${updatedContentItem.title}`,
    })

    // Reset form and close dialog
    setEditingContent(null)
    setEditContentBody("")
    setEditDialogOpen(false)

    toast({
      title: "Success",
      description: "Content has been updated.",
    })
  }

  const handleDeleteContent = () => {
    if (!user || !editingContent) return

    // Check if user has permission to delete
    if (!canModifyContent(user.id, editingContent, "delete")) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to delete this content.",
        variant: "destructive",
      })
      return
    }

    // Delete from localStorage
    deleteContent(editingContent.id)

    // Update state
    const updatedContent = content.filter((item) => item.id !== editingContent.id)
    setContent(updatedContent)

    // Add to activity log
    addActivityLogEntry({
      id: Date.now().toString(),
      type: "content_deleted",
      userId: user.id,
      username: user.username,
      timestamp: new Date().toISOString(),
      details: `Deleted ${editingContent.type}: ${editingContent.title}`,
    })

    // Reset form and close dialogs
    setEditingContent(null)
    setDeleteDialogOpen(false)
    setEditDialogOpen(false)

    toast({
      title: "Success",
      description: "Content has been deleted.",
    })
  }

  const handlePermissionChange = (type: "view" | "edit" | "delete", roleIds: string[], userIds: string[]) => {
    if (editingContent) {
      // For editing existing content
      const updatedContent = {
        ...editingContent,
        permissions: {
          ...editingContent.permissions,
          [type]: [...roleIds, ...userIds],
        },
      }
      setEditingContent(updatedContent)
    } else {
      // For new content
      setNewContent({
        ...newContent,
        permissions: {
          ...newContent.permissions,
          [type]: [...roleIds, ...userIds],
        },
      })
    }
  }

  const filteredContent = content.filter((item) => {
    const matchesSearch =
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.body.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = contentType === "all" || item.type === contentType

    return matchesSearch && matchesType
  })

  const getContentOwner = (createdById: string) => {
    const contentOwner = allUsers.find((u) => u.id === createdById)
    return contentOwner?.username || "Unknown"
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-3xl font-bold tracking-tight">Content Management</h2>
          <div className="flex flex-col md:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search content..."
                className="pl-8 w-full md:w-[200px] lg:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={contentType} onValueChange={setContentType}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="post">Posts</SelectItem>
                <SelectItem value="story">Stories</SelectItem>
                <SelectItem value="character">Characters</SelectItem>
                <SelectItem value="comment">Comments</SelectItem>
              </SelectContent>
            </Select>
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Content
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Create New Content</DialogTitle>
                  <DialogDescription>Create a new post, story, or other content.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-3">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={newContent.title}
                        onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                        placeholder="Content title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Type</Label>
                      <Select
                        value={newContent.type}
                        onValueChange={(value) => setNewContent({ ...newContent, type: value })}
                      >
                        <SelectTrigger id="type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="post">Post</SelectItem>
                          <SelectItem value="story">Story</SelectItem>
                          <SelectItem value="character">Character</SelectItem>
                          <SelectItem value="comment">Comment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="content">Content</Label>
                    <RichTextEditor
                      value={newContent.body || ""}
                      onChange={(value) => setNewContent({ ...newContent, body: value })}
                      minHeight="300px"
                    />
                  </div>

                  <div>
                    <Label>Permissions</Label>
                    <Tabs defaultValue="view">
                      <TabsList className="mb-2">
                        <TabsTrigger value="view">View</TabsTrigger>
                        <TabsTrigger value="edit">Edit</TabsTrigger>
                        <TabsTrigger value="delete">Delete</TabsTrigger>
                      </TabsList>
                      <TabsContent value="view">
                        <div className="space-y-2">
                          <Label>Roles who can view</Label>
                          <div className="grid grid-cols-2 gap-2">
                            {roles.map((role) => (
                              <div key={`view-role-${role.id}`} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`view-role-${role.id}`}
                                  checked={newContent.permissions?.view?.includes(role.id)}
                                  onCheckedChange={(checked) => {
                                    const currentRoles =
                                      newContent.permissions?.view?.filter((id) => roles.some((r) => r.id === id)) || []

                                    const updatedRoles = checked
                                      ? [...currentRoles, role.id]
                                      : currentRoles.filter((id) => id !== role.id)

                                    handlePermissionChange(
                                      "view",
                                      updatedRoles,
                                      newContent.permissions?.view?.filter((id) => !roles.some((r) => r.id === id)) ||
                                        [],
                                    )
                                  }}
                                />
                                <label htmlFor={`view-role-${role.id}`}>{role.name}</label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="edit">
                        <div className="space-y-2">
                          <Label>Roles who can edit</Label>
                          <div className="grid grid-cols-2 gap-2">
                            {roles.map((role) => (
                              <div key={`edit-role-${role.id}`} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`edit-role-${role.id}`}
                                  checked={newContent.permissions?.edit?.includes(role.id)}
                                  onCheckedChange={(checked) => {
                                    const currentRoles =
                                      newContent.permissions?.edit?.filter((id) => roles.some((r) => r.id === id)) || []

                                    const updatedRoles = checked
                                      ? [...currentRoles, role.id]
                                      : currentRoles.filter((id) => id !== role.id)

                                    handlePermissionChange(
                                      "edit",
                                      updatedRoles,
                                      newContent.permissions?.edit?.filter((id) => !roles.some((r) => r.id === id)) ||
                                        [],
                                    )
                                  }}
                                />
                                <label htmlFor={`edit-role-${role.id}`}>{role.name}</label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="delete">
                        <div className="space-y-2">
                          <Label>Roles who can delete</Label>
                          <div className="grid grid-cols-2 gap-2">
                            {roles.map((role) => (
                              <div key={`delete-role-${role.id}`} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`delete-role-${role.id}`}
                                  checked={newContent.permissions?.delete?.includes(role.id)}
                                  onCheckedChange={(checked) => {
                                    const currentRoles =
                                      newContent.permissions?.delete?.filter((id) => roles.some((r) => r.id === id)) ||
                                      []

                                    const updatedRoles = checked
                                      ? [...currentRoles, role.id]
                                      : currentRoles.filter((id) => id !== role.id)

                                    handlePermissionChange(
                                      "delete",
                                      updatedRoles,
                                      newContent.permissions?.delete?.filter((id) => !roles.some((r) => r.id === id)) ||
                                        [],
                                    )
                                  }}
                                />
                                <label htmlFor={`delete-role-${role.id}`}>{role.name}</label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCreateContent}>Create Content</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {filteredContent.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredContent.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center">
                        <Badge variant="outline" className="mr-2">
                          {item.type}
                        </Badge>
                        {item.title}
                      </CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <User className="h-3 w-3 mr-1" />
                        {getContentOwner(item.createdBy)}
                        <span className="mx-1">•</span>
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(item.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div
                    className="text-sm text-muted-foreground line-clamp-3"
                    dangerouslySetInnerHTML={{
                      __html: item.body.length > 150 ? item.body.substring(0, 150) + "..." : item.body,
                    }}
                  />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setViewingContent(item)
                        setViewDialogOpen(true)
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    {canModifyContent(user?.id || "", item, "edit") && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingContent(item)
                          setEditContentBody(item.body)
                          setEditDialogOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    )}
                  </div>
                  {canModifyContent(user?.id || "", item, "delete") && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setEditingContent(item)
                        setDeleteDialogOpen(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No Content Found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {searchQuery ? "No content found matching your search." : "No content has been created yet."}
            </p>
            <Button onClick={() => setCreateDialogOpen(true)} className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Create Content
            </Button>
          </div>
        )}
      </div>

      {/* View Content Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{viewingContent?.title}</DialogTitle>
            <DialogDescription>
              Created by {getContentOwner(viewingContent?.createdBy || "")} on{" "}
              {viewingContent && new Date(viewingContent.createdAt).toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          <div className="prose prose-sm max-w-none">
            <div dangerouslySetInnerHTML={{ __html: viewingContent?.body || "" }} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Content Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Content</DialogTitle>
            <DialogDescription>Make changes to your content.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={editingContent?.title || ""}
                onChange={(e) => setEditingContent((prev) => (prev ? { ...prev, title: e.target.value } : null))}
                placeholder="Content title"
              />
            </div>
            <div>
              <Label htmlFor="edit-content">Content</Label>
              <RichTextEditor value={editContentBody} onChange={setEditContentBody} minHeight="300px" />
            </div>
          </div>
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditContent}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this content? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 py-4">
            <AlertTriangle className="h-6 w-6 text-destructive" />
            <p className="text-sm font-medium">This will permanently delete "{editingContent?.title}"</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteContent}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


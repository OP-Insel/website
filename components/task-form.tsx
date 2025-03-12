"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { X, Plus } from "lucide-react"

type Task = {
  id: string
  title: string
  description: string
  assignee: string
  completed: boolean
  priority: "low" | "medium" | "high"
  checklist: { id: string; text: string; completed: boolean }[]
}

type TaskFormProps = {
  task?: Task
  onSubmit: (task: Task) => void
  onCancel: () => void
}

export function TaskForm({ task, onSubmit, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title || "")
  const [description, setDescription] = useState(task?.description || "")
  const [assignee, setAssignee] = useState(task?.assignee || "")
  const [priority, setPriority] = useState<"low" | "medium" | "high">(task?.priority || "medium")
  const [checklist, setChecklist] = useState(task?.checklist || [])
  const [newItem, setNewItem] = useState("")
  const [users, setUsers] = useState<any[]>([])

  useEffect(() => {
    const storedUsers = localStorage.getItem("users")
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers))
    }
  }, [])

  const handleAddItem = () => {
    if (newItem.trim() === "") return

    setChecklist([...checklist, { id: Date.now().toString(), text: newItem, completed: false }])
    setNewItem("")
  }

  const handleRemoveItem = (id: string) => {
    setChecklist(checklist.filter((item) => item.id !== id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (title.trim() === "") return

    const updatedTask: Task = {
      id: task?.id || Date.now().toString(),
      title,
      description,
      assignee,
      completed: task?.completed || false,
      priority,
      checklist,
    }

    onSubmit(updatedTask)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold">{task ? "Aufgabe bearbeiten" : "Neue Aufgabe erstellen"}</h2>

      <div className="space-y-2">
        <Label htmlFor="title">Titel</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Beschreibung</Label>
        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="assignee">Zugewiesen an</Label>
        <Select value={assignee} onValueChange={setAssignee}>
          <SelectTrigger>
            <SelectValue placeholder="Wähle einen Benutzer" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle</SelectItem>
            {users
              .filter((user) => user.role !== "pending")
              .map((user) => (
                <SelectItem key={user.username} value={user.username}>
                  {user.username}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="priority">Priorität</Label>
        <Select value={priority} onValueChange={(value: "low" | "medium" | "high") => setPriority(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Wähle eine Priorität" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Niedrig</SelectItem>
            <SelectItem value="medium">Mittel</SelectItem>
            <SelectItem value="high">Hoch</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Checkliste</Label>
        <div className="space-y-2">
          {checklist.map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <Checkbox
                id={`form-item-${item.id}`}
                checked={item.completed}
                onCheckedChange={() => {
                  setChecklist(checklist.map((i) => (i.id === item.id ? { ...i, completed: !i.completed } : i)))
                }}
              />
              <Input
                value={item.text}
                onChange={(e) => {
                  setChecklist(checklist.map((i) => (i.id === item.id ? { ...i, text: e.target.value } : i)))
                }}
                className="flex-1"
              />
              <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <div className="flex items-center gap-2">
            <Input
              placeholder="Neues Element hinzufügen"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleAddItem()
                }
              }}
            />
            <Button type="button" variant="outline" size="icon" onClick={handleAddItem}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Abbrechen
        </Button>
        <Button type="submit">{task ? "Speichern" : "Erstellen"}</Button>
      </div>
    </form>
  )
}


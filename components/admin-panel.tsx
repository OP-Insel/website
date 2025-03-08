"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useStore } from "@/lib/store"
import type { Rule } from "@/lib/types"
import UserDialog from "./user-dialog"

export default function AdminPanel() {
  const { users, rules, addUser, updateRule, addRule, deleteRule, currentUser } = useStore()
  const [newRule, setNewRule] = useState("")
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false)
  const [editingRule, setEditingRule] = useState<Rule | null>(null)
  const [editingRuleText, setEditingRuleText] = useState("")

  const isOwner = currentUser?.rank === "Owner"

  const handleAddRule = () => {
    if (newRule.trim()) {
      addRule(newRule.trim())
      setNewRule("")
    }
  }

  const handleEditRule = (rule: Rule) => {
    setEditingRule(rule)
    setEditingRuleText(rule.text)
  }

  const handleSaveRule = () => {
    if (editingRule && editingRuleText.trim()) {
      updateRule(editingRule.id, editingRuleText.trim())
      setEditingRule(null)
      setEditingRuleText("")
    }
  }

  const handleCancelEdit = () => {
    setEditingRule(null)
    setEditingRuleText("")
  }

  const handleDeleteRule = (id: string) => {
    deleteRule(id)
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">Admin Panel</h2>

      <Tabs defaultValue="users">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users">Benutzer</TabsTrigger>
          <TabsTrigger value="rules">Regeln</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Benutzer verwalten</h3>
            {isOwner && <Button onClick={() => setIsUserDialogOpen(true)}>Neuen Benutzer hinzufügen</Button>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((user) => (
              <div key={user.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-10 h-10 bg-contain bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(https://mc-heads.net/avatar/${user.username})` }}
                  />
                  <div>
                    <p className="font-semibold">{user.username}</p>
                    <p className="text-sm text-muted-foreground">{user.rank}</p>
                  </div>
                </div>
                <p>Punkte: {user.points}</p>
                <p>Letzte Aktivität: {new Date(user.lastActive).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <h3 className="text-xl font-semibold">Regeln verwalten</h3>

          {isOwner && (
            <div className="flex space-x-2">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="new-rule">Neue Regel</Label>
                <Input
                  id="new-rule"
                  value={newRule}
                  onChange={(e) => setNewRule(e.target.value)}
                  placeholder="Regel eingeben..."
                />
              </div>
              <Button className="mt-auto" onClick={handleAddRule}>
                Hinzufügen
              </Button>
            </div>
          )}

          <div className="space-y-2">
            {rules.map((rule) => (
              <div key={rule.id} className="border rounded-lg p-3 space-y-2">
                {editingRule?.id === rule.id ? (
                  <div className="space-y-2">
                    <Input value={editingRuleText} onChange={(e) => setEditingRuleText(e.target.value)} />
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={handleSaveRule}>
                        Speichern
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                        Abbrechen
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start">
                    <p>{rule.text}</p>
                    {isOwner && (
                      <div className="flex space-x-1">
                        <Button size="icon" variant="ghost" onClick={() => handleEditRule(rule)}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-pencil"
                          >
                            <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                          </svg>
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleDeleteRule(rule.id)}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-trash-2"
                          >
                            <path d="M3 6h18" />
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                            <line x1="10" x2="10" y1="11" y2="17" />
                            <line x1="14" x2="14" y1="11" y2="17" />
                          </svg>
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <UserDialog
        open={isUserDialogOpen}
        onOpenChange={setIsUserDialogOpen}
        onSave={(userData) => {
          addUser(userData)
          setIsUserDialogOpen(false)
        }}
      />
    </div>
  )
}


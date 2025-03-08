"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { UserPlus, Users } from "lucide-react"

export function AdminPanel({ users, onAddUser, onUpdateUser }) {
  const [newUser, setNewUser] = useState({
    username: "",
    minecraftUsername: "",
    rank: "Jr. Supporter",
    points: 150,
    notes: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setNewUser((prev) => ({ ...prev, [name]: value }))
  }

  const handleRankChange = (value) => {
    setNewUser((prev) => ({ ...prev, rank: value }))
  }

  const handleAddUser = () => {
    if (newUser.username && newUser.minecraftUsername) {
      onAddUser(newUser)
      setNewUser({
        username: "",
        minecraftUsername: "",
        rank: "Jr. Supporter",
        points: 150,
        notes: "",
      })
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-1 bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle>Add Team Member</CardTitle>
          <CardDescription className="text-zinc-400">Create a new team member account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              value={newUser.username}
              onChange={handleChange}
              placeholder="Enter username"
              className="bg-zinc-800 border-zinc-700"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="minecraftUsername">Minecraft Username</Label>
            <Input
              id="minecraftUsername"
              name="minecraftUsername"
              value={newUser.minecraftUsername}
              onChange={handleChange}
              placeholder="Enter Minecraft username"
              className="bg-zinc-800 border-zinc-700"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rank">Rank</Label>
            <Select value={newUser.rank} onValueChange={handleRankChange}>
              <SelectTrigger className="bg-zinc-800 border-zinc-700">
                <SelectValue placeholder="Select rank" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Owner">Owner</SelectItem>
                <SelectItem value="Co-Owner">Co-Owner</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Jr. Admin">Jr. Admin</SelectItem>
                <SelectItem value="Moderator">Moderator</SelectItem>
                <SelectItem value="Jr. Moderator">Jr. Moderator</SelectItem>
                <SelectItem value="Supporter">Supporter</SelectItem>
                <SelectItem value="Jr. Supporter">Jr. Supporter</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={newUser.notes}
              onChange={handleChange}
              placeholder="Add notes about this team member..."
              className="min-h-[100px] bg-zinc-800 border-zinc-700"
            />
          </div>

          <Button className="w-full" onClick={handleAddUser} disabled={!newUser.username || !newUser.minecraftUsername}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Team Member
          </Button>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle>Team Overview</CardTitle>
          <CardDescription className="text-zinc-400">Manage your team members and their ranks</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="active">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="active">Active Members</TabsTrigger>
              <TabsTrigger value="removed">Removed Members</TabsTrigger>
            </TabsList>

            <TabsContent value="active">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-zinc-400" />
                    <h3 className="font-medium">
                      Active Team Members: {users.filter((u) => u.rank !== "Removed").length}
                    </h3>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-800">
                        <th className="text-left py-2 px-4">Username</th>
                        <th className="text-left py-2 px-4">Minecraft</th>
                        <th className="text-left py-2 px-4">Rank</th>
                        <th className="text-right py-2 px-4">Points</th>
                        <th className="text-right py-2 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users
                        .filter((user) => user.rank !== "Removed")
                        .map((user) => (
                          <tr key={user.id} className="border-b border-zinc-800">
                            <td className="py-2 px-4">{user.username}</td>
                            <td className="py-2 px-4">{user.minecraftUsername}</td>
                            <td className="py-2 px-4">{user.rank}</td>
                            <td className="text-right py-2 px-4">{user.points}</td>
                            <td className="text-right py-2 px-4">
                              <Button variant="ghost" size="sm">
                                Edit
                              </Button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="removed">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-zinc-400" />
                    <h3 className="font-medium">
                      Removed Team Members: {users.filter((u) => u.rank === "Removed").length}
                    </h3>
                  </div>
                </div>

                {users.filter((u) => u.rank === "Removed").length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-zinc-800">
                          <th className="text-left py-2 px-4">Username</th>
                          <th className="text-left py-2 px-4">Minecraft</th>
                          <th className="text-right py-2 px-4">Points</th>
                          <th className="text-right py-2 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users
                          .filter((user) => user.rank === "Removed")
                          .map((user) => (
                            <tr key={user.id} className="border-b border-zinc-800">
                              <td className="py-2 px-4">{user.username}</td>
                              <td className="py-2 px-4">{user.minecraftUsername}</td>
                              <td className="text-right py-2 px-4">{user.points}</td>
                              <td className="text-right py-2 px-4">
                                <Button variant="outline" size="sm">
                                  Restore
                                </Button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-zinc-500">No removed team members</div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}


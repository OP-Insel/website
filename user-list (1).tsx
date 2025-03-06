"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Edit, Trash2, UserPlus } from "lucide-react"

// Mock data for users
const initialUsers = [
  {
    id: 1,
    name: "Steve",
    minecraftName: "Steve123",
    rank: "Admin",
    points: 450,
    maxPoints: 500,
    minPoints: 400,
    nextRank: "Co-Owner",
    prevRank: "Jr. Admin",
  },
  {
    id: 2,
    name: "Alex",
    minecraftName: "Alex456",
    rank: "Moderator",
    points: 280,
    maxPoints: 300,
    minPoints: 250,
    nextRank: "Jr. Admin",
    prevRank: "Jr. Moderator",
  },
  {
    id: 3,
    name: "Notch",
    minecraftName: "Notch789",
    rank: "Owner",
    points: Number.POSITIVE_INFINITY,
    maxPoints: Number.POSITIVE_INFINITY,
    minPoints: Number.POSITIVE_INFINITY,
    nextRank: null,
    prevRank: null,
  },
  {
    id: 4,
    name: "Builder1",
    minecraftName: "Builder1",
    rank: "Builder",
    points: 180,
    maxPoints: 200,
    minPoints: 150,
    nextRank: "Sr. Builder",
    prevRank: "Jr. Supporter",
  },
  {
    id: 5,
    name: "Developer1",
    minecraftName: "Developer1",
    rank: "Developer",
    points: 230,
    maxPoints: 250,
    minPoints: 200,
    nextRank: "Sr. Builder",
    prevRank: "Builder",
  },
]

export function UserList({ currentUser }) {
  const [users, setUsers] = useState(initialUsers)
  const [selectedUser, setSelectedUser] = useState(null)

  const isAdmin = currentUser?.rank === "Owner" || currentUser?.rank === "Co-Owner"

  const getMoodEmoji = (user) => {
    if (user.points === Number.POSITIVE_INFINITY) return "👑"

    const progress = (user.points - user.minPoints) / (user.maxPoints - user.minPoints)
    if (progress > 0.8) return "😄"
    if (progress > 0.5) return "🙂"
    if (progress > 0.3) return "😐"
    return "😟"
  }

  const getRankColor = (rank) => {
    switch (rank) {
      case "Owner":
        return "bg-orange-500 hover:bg-orange-600"
      case "Co-Owner":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "Admin":
        return "bg-red-600 hover:bg-red-700"
      case "Jr. Admin":
        return "bg-red-500 hover:bg-red-600"
      case "Moderator":
        return "bg-blue-600 hover:bg-blue-700"
      case "Jr. Moderator":
        return "bg-blue-500 hover:bg-blue-600"
      case "Supporter":
        return "bg-gray-600 hover:bg-gray-700"
      case "Jr. Supporter":
        return "bg-gray-500 hover:bg-gray-600"
      case "Developer":
        return "bg-purple-600 hover:bg-purple-700"
      case "Sr. Builder":
        return "bg-cyan-600 hover:bg-cyan-700"
      case "Builder":
        return "bg-cyan-500 hover:bg-cyan-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h3 className="text-lg font-medium">Benutzer Liste</h3>
        {isAdmin && (
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                <UserPlus className="mr-2 h-4 w-4" />
                Benutzer hinzufügen
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Neuen Benutzer hinzufügen</DialogTitle>
                <DialogDescription>Füge einen neuen Benutzer zum System hinzu.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input id="name" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="minecraft" className="text-right">
                    Minecraft Name
                  </Label>
                  <Input id="minecraft" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="rank" className="text-right">
                    Rang
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Rang auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jr-supporter">Jr. Supporter</SelectItem>
                      <SelectItem value="supporter">Supporter</SelectItem>
                      <SelectItem value="jr-moderator">Jr. Moderator</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                      <SelectItem value="jr-admin">Jr. Admin</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="co-owner">Co-Owner</SelectItem>
                      <SelectItem value="builder">Builder</SelectItem>
                      <SelectItem value="sr-builder">Sr. Builder</SelectItem>
                      <SelectItem value="developer">Developer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="points" className="text-right">
                    Punkte
                  </Label>
                  <Input id="points" type="number" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Speichern</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <Card key={user.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className={`h-2 ${getRankColor(user.rank)}`} />
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12">
                      <Image
                        src={`https://mc-heads.net/avatar/${user.minecraftName}/64`}
                        alt={user.name}
                        fill
                        className="rounded-md object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold">{user.name}</h4>
                      <p className="text-sm text-muted-foreground">{user.minecraftName}</p>
                    </div>
                  </div>
                  <div className="text-2xl">{getMoodEmoji(user)}</div>
                </div>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className={getRankColor(user.rank) + " text-white"}>
                      {user.rank}
                    </Badge>
                    <span className="text-sm">
                      {user.points === Number.POSITIVE_INFINITY ? "∞" : user.points} Punkte
                    </span>
                  </div>
                  {user.points !== Number.POSITIVE_INFINITY && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>{user.prevRank || "Min"}</span>
                        <span>{user.nextRank || "Max"}</span>
                      </div>
                      <Progress value={((user.points - user.minPoints) / (user.maxPoints - user.minPoints)) * 100} />
                    </div>
                  )}
                  {isAdmin && (
                    <div className="flex justify-end gap-2 pt-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedUser(user)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Benutzer bearbeiten</DialogTitle>
                            <DialogDescription>Bearbeite die Informationen für diesen Benutzer.</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-name" className="text-right">
                                Name
                              </Label>
                              <Input id="edit-name" defaultValue={user.name} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-minecraft" className="text-right">
                                Minecraft Name
                              </Label>
                              <Input id="edit-minecraft" defaultValue={user.minecraftName} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-rank" className="text-right">
                                Rang
                              </Label>
                              <Select defaultValue={user.rank.toLowerCase().replace(". ", "-").replace(" ", "-")}>
                                <SelectTrigger className="col-span-3">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="jr-supporter">Jr. Supporter</SelectItem>
                                  <SelectItem value="supporter">Supporter</SelectItem>
                                  <SelectItem value="jr-moderator">Jr. Moderator</SelectItem>
                                  <SelectItem value="moderator">Moderator</SelectItem>
                                  <SelectItem value="jr-admin">Jr. Admin</SelectItem>
                                  <SelectItem value="admin">Admin</SelectItem>
                                  <SelectItem value="co-owner">Co-Owner</SelectItem>
                                  <SelectItem value="builder">Builder</SelectItem>
                                  <SelectItem value="sr-builder">Sr. Builder</SelectItem>
                                  <SelectItem value="developer">Developer</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-points" className="text-right">
                                Punkte
                              </Label>
                              <Input
                                id="edit-points"
                                type="number"
                                defaultValue={user.points === Number.POSITIVE_INFINITY ? 999999 : user.points}
                                className="col-span-3"
                                disabled={user.rank === "Owner"}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="submit">Speichern</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button variant="destructive" size="sm" disabled={user.rank === "Owner"}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}


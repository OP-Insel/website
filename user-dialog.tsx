"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUserStore } from "@/lib/store"
import { User } from "@/lib/types"
import { Trash, UserPlus, UserMinus } from 'lucide-react'

interface UserDialogProps {
  user: User | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserDialog({ user, open, onOpenChange }: UserDialogProps) {
  const { currentUser, addUser, updateUser, deleteUser, addPoints, subtractPoints } = useUserStore()
  const isAdmin = currentUser?.rank === "Owner" || currentUser?.rank === "Co-Owner"
  const isEditing = !!user
  
  const [formData, setFormData] = useState<Partial<User>>({
    name: "",
    minecraftName: "",
    rank: "Jr. Supporter",
    points: 100
  })
  
  const [pointsToAdd, setPointsToAdd] = useState(0)
  const [pointsToSubtract, setPointsToSubtract] = useState(0)
  
  useEffect(() => {
    if (user) {
      setFormData(user)
    } else {
      setFormData({
        name: "",
        minecraftName: "",
        rank: "Jr. Supporter",
        points: 100
      })
    }
  }, [user])
  
  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }
  
  const handleSubmit = () => {
    if (isEditing && user) {
      updateUser(user.id, formData as User)
    } else {
      addUser(formData as User)
    }
    onOpenChange(false)
  }
  
  const handleDelete = () => {
    if (user) {
      deleteUser(user.id)
      onOpenChange(false)
    }
  }
  
  const handleAddPoints = () => {
    if (user && pointsToAdd > 0) {
      addPoints(user.id, pointsToAdd)
      setPointsToAdd(0)
    }
  }
  
  const handleSubtractPoints = () => {
    if (user && pointsToSubtract > 0) {
      subtractPoints(user.id, pointsToSubtract)
      setPointsToSubtract(0)
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-800 max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Team Member" : "Add Team Member"}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {isEditing && (
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 rounded-full overflow-hidden">
                <div 
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(https://mc-heads.net/avatar/${user?.minecraftName}/128)` }}
                />
              </div>
            </div>
          )}
          
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name" 
              value={formData.name} 
              onChange={(e) => handleChange("name", e.target.value)} 
              className="bg-zinc-800 border-zinc-700"
              disabled={!isAdmin && isEditing}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="minecraftName">Minecraft Username</Label>
            <Input 
              id="minecraftName" 
              value={formData.minecraftName} 
              onChange={(e) => handleChange("minecraftName", e.target.value)} 
              className="bg-zinc-800 border-zinc-700"
              disabled={!isAdmin && isEditing}
            />
          </div>
          
          {isAdmin && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="rank">Rank</Label>
                <Select 
                  value={formData.rank} 
                  onValueChange={(value) => handleChange("rank", value)}
                  disabled={!isAdmin}
                >
                  <SelectTrigger id="rank" className="bg-zinc-800 border-zinc-700">
                    <SelectValue placeholder="Select rank" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
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
              
              <div className="grid gap-2">
                <Label htmlFor="points">Points</Label>
                <Input 
                  id="points" 
                  type="number" 
                  value={formData.points} 
                  onChange={(e) => handleChange("points", parseInt(e.target.value))} 
                  className="bg-zinc-800 border-zinc-700"
                  disabled={!isAdmin}
                />
              </div>
            </>
          )}
          
          {isAdmin && isEditing && (
            <>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <Label htmlFor="addPoints">Add Points</Label>
                  <div className="flex mt-1">
                    <Input 
                      id="addPoints" 
                      type="number" 
                      value={pointsToAdd} 
                      onChange={(e) => setPointsToAdd(parseInt(e.target.value) || 0)} 
                      className="bg-zinc-800 border-zinc-700 rounded-r-none"
                    />
                    <Button 
                      onClick={handleAddPoints} 
                      className="rounded-l-none"
                      variant="secondary"
                    >
                      <UserPlus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="subtractPoints">Subtract Points</Label>
                  <div className="flex mt-1">
                    <Input 
                      id="subtractPoints" 
                      type="number" 
                      value={pointsToSubtract} 
                      onChange={(e) => setPointsToSubtract(parseInt(e.target.value) || 0)} 
                      className="bg-zinc-800 border-zinc-700 rounded-r-none"
                    />
                    <Button 
                      onClick={handleSubtractPoints} 
                      className="rounded-l-none"
                      variant="secondary"
                    >
                      <UserMinus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        
        <DialogFooter className="flex justify-between">
          {isAdmin && isEditing && (
            <Button variant="destructive" onClick={handleDelete}>
              <Trash className="w-4 h-4 mr-2" />
              Delete
            </Button>
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>{isEditing ? "Save Changes" : "Add Member"}</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserCard } from "@/components/user-card"
import { useUserStore } from "@/lib/store"
import { UserDialog } from "@/components/user-dialog"
import { Plus } from 'lucide-react'
import { User } from "@/lib/types"

export function UserList() {
  const { users, currentUser } = useUserStore()
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showUserDialog, setShowUserDialog] = useState(false)
  const isAdmin = currentUser?.rank === "Owner" || currentUser?.rank === "Co-Owner"
  
  const handleUserClick = (user: User) => {
    setSelectedUser(user)
    setShowUserDialog(true)
  }
  
  const handleAddUser = () => {
    setSelectedUser(null)
    setShowUserDialog(true)
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Team Members</h2>
        {isAdmin && (
          <Button onClick={handleAddUser}>
            <Plus className="w-4 h-4 mr-2" />
            Add Member
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <UserCard 
            key={user.id} 
            user={user} 
            onClick={() => handleUserClick(user)} 
          />
        ))}
      </div>
      
      <UserDialog 
        user={selectedUser} 
        open={showUserDialog} 
        onOpenChange={setShowUserDialog} 
      />
    </div>
  )
}

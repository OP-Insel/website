"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserList } from "@/components/user-list"
import { RulesPanel } from "@/components/rules-panel"
import { SchedulePanel } from "@/components/schedule-panel"
import { AdminPanel } from "@/components/admin-panel"
import { useUserStore } from "@/lib/store"
import { Header } from "@/components/header"

export default function Dashboard() {
  const { currentUser } = useUserStore()
  const isAdmin = currentUser?.rank === "Owner" || currentUser?.rank === "Co-Owner"
  
  return (
    <div className="container mx-auto p-4">
      <Header />
      
      <Tabs defaultValue="users" className="mt-6">
        <TabsList className="grid w-full grid-cols-4 bg-zinc-800">
          <TabsTrigger value="users">Team Members</TabsTrigger>
          <TabsTrigger value="rules">Rules & Points</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          {isAdmin && <TabsTrigger value="admin">Admin Panel</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="users" className="mt-4">
          <UserList />
        </TabsContent>
        
        <TabsContent value="rules" className="mt-4">
          <RulesPanel />
        </TabsContent>
        
        <TabsContent value="schedule" className="mt-4">
          <SchedulePanel />
        </TabsContent>
        
        {isAdmin && (
          <TabsContent value="admin" className="mt-4">
            <AdminPanel />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}

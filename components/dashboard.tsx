"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "./header"
import UserList from "./user-list"
import RulesPanel from "./rules-panel"
import SchedulePanel from "./schedule-panel"
import AdminPanel from "./admin-panel"
import { useStore } from "@/lib/store"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("users")
  const { currentUser } = useStore()

  const isAdmin = currentUser?.rank === "Owner" || currentUser?.rank === "Co-Owner"

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto py-6 px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-4">
            <TabsTrigger value="users">Team</TabsTrigger>
            <TabsTrigger value="rules">Regeln</TabsTrigger>
            <TabsTrigger value="schedule">Termine</TabsTrigger>
            {isAdmin && <TabsTrigger value="admin">Admin</TabsTrigger>}
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <UserList />
          </TabsContent>

          <TabsContent value="rules" className="space-y-4">
            <RulesPanel />
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <SchedulePanel />
          </TabsContent>

          {isAdmin && (
            <TabsContent value="admin" className="space-y-4">
              <AdminPanel />
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  )
}


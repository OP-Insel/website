"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { UserList } from "@/components/user-list"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectTracker } from "@/components/project-tracker"
import { StoryAndCharacters } from "@/components/story-and-characters"
import { TaskBoard } from "@/components/task-board"
import { PointsSystem } from "@/components/points-system"
import { Loader2 } from "lucide-react"
import { AdminPanel } from "@/components/admin-panel"

// Mock authentication state
const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate checking local storage for user data
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  return { user, loading }
}

export default function Home() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [loading, user, router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  const isAdmin = user?.rank === "Owner" || user?.rank === "Co-Owner"

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={user} />
      <main className="flex-1 p-6">
        <div className="container mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight">OP-INSEL Team Dashboard</h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Willkommen im Team-Dashboard für den OP-INSEL Minecraft Server
            </p>
          </div>

          <Tabs defaultValue="users" className="space-y-4">
            <TabsList className="flex flex-wrap justify-center">
              <TabsTrigger value="users">Benutzer</TabsTrigger>
              <TabsTrigger value="points">Punktesystem</TabsTrigger>
              <TabsTrigger value="story">Story & Charaktere</TabsTrigger>
              <TabsTrigger value="tasks">Aufgaben</TabsTrigger>
              <TabsTrigger value="projects">Projekte</TabsTrigger>
              <TabsTrigger value="calendar">Termine</TabsTrigger>
              {isAdmin && <TabsTrigger value="admin">Admin Panel</TabsTrigger>}
            </TabsList>

            <TabsContent value="users" className="space-y-4">
              <h2 className="text-2xl font-bold">Benutzer Verwaltung</h2>
              <UserList currentUser={user} />
            </TabsContent>

            <TabsContent value="points" className="space-y-4">
              <h2 className="text-2xl font-bold">Punktesystem</h2>
              <PointsSystem currentUser={user} />
            </TabsContent>

            <TabsContent value="story" className="space-y-4">
              <h2 className="text-2xl font-bold">Story & Charaktere</h2>
              <StoryAndCharacters />
            </TabsContent>

            <TabsContent value="tasks" className="space-y-4">
              <h2 className="text-2xl font-bold">Aufgaben Board</h2>
              <TaskBoard />
            </TabsContent>

            <TabsContent value="projects" className="space-y-4">
              <h2 className="text-2xl font-bold">Projekt Tracking</h2>
              <ProjectTracker />
            </TabsContent>

            <TabsContent value="calendar" className="space-y-4">
              <h2 className="text-2xl font-bold">Terminplaner</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4">
                  <Calendar mode="single" className="mx-auto" />
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="mb-4 text-lg font-medium">Anstehende Termine</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center justify-between rounded-md bg-muted p-3">
                      <span>Team Meeting</span>
                      <span className="text-sm text-muted-foreground">Morgen, 14:00</span>
                    </li>
                    <li className="flex items-center justify-between rounded-md bg-muted p-3">
                      <span>Projekt Deadline</span>
                      <span className="text-sm text-muted-foreground">15.03.2025</span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            {isAdmin && (
              <TabsContent value="admin" className="space-y-4">
                <h2 className="text-2xl font-bold">Admin Panel</h2>
                <AdminPanel />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </main>
      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} OP-INSEL Minecraft Server. Alle Rechte vorbehalten.</p>
      </footer>
    </div>
  )
}


"use client"

import { useState } from "react"
import Sidebar from "./sidebar"
import DashboardContent from "./dashboard-content"
import ProfileContent from "./profile-content"
import TasksContent from "./tasks-content"
import TeamContent from "./team-content"
import AdminContent from "./admin-content"

type View = "dashboard" | "profile" | "tasks" | "team" | "admin"

export default function DashboardView({
  user,
  onLogout,
}: {
  user: any
  onLogout: () => void
}) {
  const [currentView, setCurrentView] = useState<View>("dashboard")

  return (
    <div className="flex min-h-[80vh] gap-6">
      <Sidebar user={user} currentView={currentView} onViewChange={setCurrentView} onLogout={onLogout} />

      <div className="flex-1 space-y-6">
        {currentView === "dashboard" && <DashboardContent user={user} />}
        {currentView === "profile" && <ProfileContent user={user} />}
        {currentView === "tasks" && <TasksContent user={user} />}
        {currentView === "team" && <TeamContent />}
        {currentView === "admin" && <AdminContent />}
      </div>
    </div>
  )
}


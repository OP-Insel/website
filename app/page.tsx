"use client"

import { useState } from "react"
import LoginView from "@/components/login-view"
import DashboardView from "@/components/dashboard-view"
import LoadingView from "@/components/loading-view"
import RestrictedView from "@/components/restricted-view"

export default function Home() {
  const [view, setView] = useState<"login" | "loading" | "restricted" | "dashboard">("login")
  const [user, setUser] = useState<any>(null)

  const handleLogin = async () => {
    setView("loading")
    // Simulate Discord OAuth login
    setTimeout(() => {
      // For demo, randomly show either dashboard or restricted
      if (Math.random() > 0.5) {
        setUser({
          name: "Steve",
          role: "Admin",
          points: 150,
          avatar: "/minecraft-avatar.png",
        })
        setView("dashboard")
      } else {
        setView("restricted")
      }
    }, 2000)
  }

  const handleLogout = () => {
    setUser(null)
    setView("login")
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {view === "login" && <LoginView onLogin={handleLogin} />}
        {view === "loading" && <LoadingView />}
        {view === "restricted" && <RestrictedView onLogout={handleLogout} />}
        {view === "dashboard" && <DashboardView user={user} onLogout={handleLogout} />}
      </div>
    </main>
  )
}


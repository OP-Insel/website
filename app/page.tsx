"use client"

import { useEffect, useState } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import Dashboard from "@/components/dashboard"
import LoginDialog from "@/components/login-dialog"
import Loading from "@/components/loading"
import { useStore } from "@/lib/store"

export default function Home() {
  const { currentUser, isLoading, fetchUsers, fetchRules, fetchSchedule } = useStore()
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const initializeApp = async () => {
      await Promise.all([fetchUsers(), fetchRules(), fetchSchedule()])
      setIsInitialized(true)
    }

    initializeApp()
  }, [fetchUsers, fetchRules, fetchSchedule])

  if (!isInitialized || isLoading) {
    return <Loading />
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <main className="min-h-screen bg-background">{currentUser ? <Dashboard /> : <LoginDialog />}</main>
    </ThemeProvider>
  )
}


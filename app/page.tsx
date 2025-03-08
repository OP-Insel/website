"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoginForm } from "./components/login-form"
import { Dashboard } from "./components/dashboard"
import { useLocalStorage } from "./hooks/use-local-storage"
import { initialUsers } from "./data/initial-users"
import { initialStories } from "./data/initial-stories"
import { initialTasks } from "./data/initial-tasks"
import { initialMessages } from "./data/initial-messages"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { LanguageProvider } from "./providers/language-provider"

export default function Home() {
  const [users, setUsers] = useLocalStorage("team-users", initialUsers)
  const [stories, setStories] = useLocalStorage("team-stories", initialStories)
  const [tasks, setTasks] = useLocalStorage("team-tasks", initialTasks)
  const [messages, setMessages] = useLocalStorage("team-messages", initialMessages)
  const [currentUser, setCurrentUser] = useLocalStorage("current-user", null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  // Check if user is logged in
  useEffect(() => {
    if (currentUser) {
      setIsLoggedIn(true)
    } else {
      setIsLoggedIn(false)
    }
  }, [currentUser])

  const handleLogin = (username, password) => {
    // In a real app, you would validate against a database
    const user = users.find((u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password)

    if (user) {
      setCurrentUser(user)
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.username}!`,
      })
      return true
    } else {
      toast({
        title: "Login failed",
        description: "Invalid username or password",
        variant: "destructive",
      })
      return false
    }
  }

  const handleLogout = () => {
    setCurrentUser(null)
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    })
  }

  const handleAddMessage = (message) => {
    const newMessage = {
      id: Date.now().toString(),
      content: message,
      sender: currentUser.id,
      timestamp: new Date().toISOString(),
    }
    setMessages([...messages, newMessage])
  }

  if (!isLoggedIn) {
    return (
      <LanguageProvider>
        <LoginForm onLogin={handleLogin} />
        <Toaster />
      </LanguageProvider>
    )
  }

  return (
    <LanguageProvider>
      <Dashboard
        users={users}
        setUsers={setUsers}
        stories={stories}
        setStories={setStories}
        tasks={tasks}
        setTasks={setTasks}
        messages={messages}
        setMessages={setMessages}
        currentUser={currentUser}
        onLogout={handleLogout}
        onAddMessage={handleAddMessage}
      />
      <Toaster />
    </LanguageProvider>
  )
}


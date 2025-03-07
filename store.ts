"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { User, Event } from "@/lib/types"

interface UserState {
  users: User[]
  currentUser: User | null
  login: (username: string, password: string) => void
  logout: () => void
  addUser: (user: User) => void
  updateUser: (id: string, updatedUser: User) => void
  deleteUser: (id: string) => void
  addPoints: (id: string, points: number) => void
  subtractPoints: (id: string, points: number) => void
  resetAllPoints: () => void
  exportData: () => void
  importData: (data: any) => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      users: [
        {
          id: "1",
          name: "Admin User",
          minecraftName: "AdminPlayer",
          rank: "Owner",
          points: 1000
        },
        {
          id: "2",
          name: "Moderator User",
          minecraftName: "ModPlayer",
          rank: "Moderator",
          points: 300
        },
        {
          id: "3",
          name: "Support User",
          minecraftName: "SupportPlayer",
          rank: "Jr. Supporter",
          points: 120
        }
      ],
      currentUser: null,
      
      login: (username, password) => {
        // In a real app, you would validate credentials
        // For demo purposes, just find a user with matching name
        const user = get().users.find(u => u.name.toLowerCase() === username.toLowerCase())
        if (user) {
          set({ currentUser: user })
        }
      },
      
      logout: () => {
        set({ currentUser: null })
      },
      
      addUser: (user) => {
        const newUser = {
          ...user,
          id: Date.now().toString()
        }
        set(state => ({ users: [...state.users, newUser] }))
      },
      
      updateUser: (id, updatedUser) => {
        set(state => ({
          users: state.users.map(user => 
            user.id === id ? { ...updatedUser, id } : user
          )
        }))
      },
      
      deleteUser: (id) => {
        set(state => ({
          users: state.users.filter(user => user.id !== id)
        }))
      },
      
      addPoints: (id, points) => {
        set(state => ({
          users: state.users.map(user => 
            user.id === id ? { ...user, points: user.points + points } : user
          )
        }))
      },
      
      subtractPoints: (id, points) => {
        set(state => ({
          users: state.users.map(user => {
            if (user.id === id) {
              const newPoints = Math.max(0, user.points - points)
              return { ...user, points: newPoints }
            }
            return user
          })
        }))
      },
      
      resetAllPoints: () => {
        set(state => ({
          users: state.users.map(user => ({
            ...user,
            points: getDegradationThreshold(user.rank) || 100
          }))
        }))
      },
      
      exportData: () => {
        const data = JSON.stringify(get().users, null, 2)
        const blob = new Blob([data], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        
        const a = document.createElement("a")
        a.href = url
        a.download = "minecraft-team-data.json"
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      },
      
      importData: (data) => {
        if (Array.isArray(data)) {
          set({ users: data })
        }
      }
    }),
    {
      name: "minecraft-team-storage"
    }
  )
)

interface ScheduleState {
  events: Event[]
  addEvent: (event: Event) => void
  updateEvent: (id: string, updatedEvent: Event) => void
  deleteEvent: (id: string) => void
}

export const useScheduleStore = create<ScheduleState>()(
  persist(
    (set) => ({
      events: [
        {
          id: "1",
          title: "Team Meeting",
          description: "Weekly team sync",
          date: new Date().toISOString(),
          time: "14:00",
          type: "meeting"
        },
        {
          id: "2",
          title: "Server Update",
          description: "Deploy new plugins",
          date: new Date().toISOString(),
          time: "18:00",
          type: "deadline"
        }
      ],
      
      addEvent: (event) => {
        set(state => ({ events: [...state.events, event] }))
      },
      
      updateEvent: (id, updatedEvent) => {
        set(state => ({
          events: state.events.map(event => 
            event.id === id ? { ...updatedEvent, id } : event
          )
        }))
      },
      
      deleteEvent: (id) => {
        set(state => ({
          events: state.events.filter(event => event.id !== id)
        }))
      }
    }),
    {
      name: "minecraft-schedule-storage"
    }
  )
)

function getDegradationThreshold(rank: string): number | null {
  switch (rank) {
    case "Co-Owner": return 500
    case "Admin": return 400
    case "Jr. Admin": return 300
    case "Moderator": return 250
    case "Jr. Moderator": return 200
    case "Supporter": return 150
    case "Jr. Supporter": return 100
    default: return null
  }
}

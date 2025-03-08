"use client"

import { create } from "zustand"
import type { User, Rule, ScheduleEvent, NewUser } from "./types"
import * as api from "./api-client"

interface StoreState {
  users: User[]
  rules: Rule[]
  schedule: ScheduleEvent[]
  currentUser: User | null
  isLoading: boolean

  // User actions
  fetchUsers: () => Promise<void>
  login: (username: string) => Promise<boolean>
  logout: () => void
  addUser: (userData: NewUser) => Promise<void>
  updateUser: (userId: string, userData: Partial<User>) => Promise<void>
  updateLastActive: (userId: string) => Promise<void>

  // Rules actions
  fetchRules: () => Promise<void>
  addRule: (text: string) => Promise<void>
  updateRule: (id: string, text: string) => Promise<void>
  deleteRule: (id: string) => Promise<void>

  // Schedule actions
  fetchSchedule: () => Promise<void>
  addEvent: (event: ScheduleEvent) => Promise<void>
  deleteEvent: (id: string) => Promise<void>
}

export const useStore = create<StoreState>((set, get) => ({
  users: [],
  rules: [],
  schedule: [],
  currentUser: null,
  isLoading: false,

  // User actions
  fetchUsers: async () => {
    set({ isLoading: true })
    try {
      const users = await api.fetchUsers()
      set({ users, isLoading: false })
    } catch (error) {
      console.error("Error fetching users:", error)
      set({ isLoading: false })
    }
  },

  login: async (username: string) => {
    set({ isLoading: true })
    try {
      const user = await api.fetchUserByUsername(username)
      if (user) {
        // Update last active timestamp
        await api.updateUser(user.id, { lastActive: new Date().toISOString() })

        // Refresh users list to get updated data
        const users = await api.fetchUsers()

        // Find the updated user
        const updatedUser = users.find((u) => u.id === user.id) || user

        set({ currentUser: updatedUser, users, isLoading: false })
        return true
      } else {
        set({ isLoading: false })
        return false
      }
    } catch (error) {
      console.error("Error logging in:", error)
      set({ isLoading: false })
      return false
    }
  },

  logout: () => {
    set({ currentUser: null })
  },

  addUser: async (userData: NewUser) => {
    set({ isLoading: true })
    try {
      const newUser = await api.addUser(userData)
      set((state) => ({
        users: [...state.users, newUser],
        isLoading: false,
      }))
    } catch (error) {
      console.error("Error adding user:", error)
      set({ isLoading: false })
    }
  },

  updateUser: async (userId: string, userData: Partial<User>) => {
    set({ isLoading: true })
    try {
      const updatedUser = await api.updateUser(userId, userData)
      set((state) => ({
        users: state.users.map((user) => (user.id === userId ? updatedUser : user)),
        currentUser: state.currentUser?.id === userId ? updatedUser : state.currentUser,
        isLoading: false,
      }))
    } catch (error) {
      console.error("Error updating user:", error)
      set({ isLoading: false })
    }
  },

  updateLastActive: async (userId: string) => {
    try {
      const lastActive = new Date().toISOString()
      const updatedUser = await api.updateUser(userId, { lastActive })
      set((state) => ({
        users: state.users.map((user) => (user.id === userId ? updatedUser : user)),
        currentUser: state.currentUser?.id === userId ? updatedUser : state.currentUser,
      }))
    } catch (error) {
      console.error("Error updating last active:", error)
    }
  },

  // Rules actions
  fetchRules: async () => {
    set({ isLoading: true })
    try {
      const rules = await api.fetchRules()
      set({ rules, isLoading: false })
    } catch (error) {
      console.error("Error fetching rules:", error)
      set({ isLoading: false })
    }
  },

  addRule: async (text: string) => {
    set({ isLoading: true })
    try {
      const newRule = await api.addRule(text)
      set((state) => ({
        rules: [...state.rules, newRule],
        isLoading: false,
      }))
    } catch (error) {
      console.error("Error adding rule:", error)
      set({ isLoading: false })
    }
  },

  updateRule: async (id: string, text: string) => {
    set({ isLoading: true })
    try {
      const updatedRule = await api.updateRule(id, text)
      set((state) => ({
        rules: state.rules.map((rule) => (rule.id === id ? updatedRule : rule)),
        isLoading: false,
      }))
    } catch (error) {
      console.error("Error updating rule:", error)
      set({ isLoading: false })
    }
  },

  deleteRule: async (id: string) => {
    set({ isLoading: true })
    try {
      await api.deleteRule(id)
      set((state) => ({
        rules: state.rules.filter((rule) => rule.id !== id),
        isLoading: false,
      }))
    } catch (error) {
      console.error("Error deleting rule:", error)
      set({ isLoading: false })
    }
  },

  // Schedule actions
  fetchSchedule: async () => {
    set({ isLoading: true })
    try {
      const schedule = await api.fetchSchedule()
      set({ schedule, isLoading: false })
    } catch (error) {
      console.error("Error fetching schedule:", error)
      set({ isLoading: false })
    }
  },

  addEvent: async (event: ScheduleEvent) => {
    set({ isLoading: true })
    try {
      const newEvent = await api.addEvent(event)
      set((state) => ({
        schedule: [...state.schedule, newEvent],
        isLoading: false,
      }))
    } catch (error) {
      console.error("Error adding event:", error)
      set({ isLoading: false })
    }
  },

  deleteEvent: async (id: string) => {
    set({ isLoading: true })
    try {
      await api.deleteEvent(id)
      set((state) => ({
        schedule: state.schedule.filter((event) => event.id !== id),
        isLoading: false,
      }))
    } catch (error) {
      console.error("Error deleting event:", error)
      set({ isLoading: false })
    }
  },
}))


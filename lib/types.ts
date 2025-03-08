export interface User {
  id: string
  username: string
  rank: string
  points: number
  lastActive: string
}

export type NewUser = Omit<User, "id" | "lastActive">

export interface Rule {
  id: string
  text: string
}

export interface ScheduleEvent {
  id: string
  title: string
  description: string
  date: string
  createdBy: string
}


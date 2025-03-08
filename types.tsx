export interface User {
  id: string
  name: string
  minecraftName: string
  rank: string
  points: number
}

export interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  type: "meeting" | "deadline"
}


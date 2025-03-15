// Benutzertypen
export interface User {
  id: string
  username: string
  password: string
  role: string
  points: number
  createdAt: string
  lastPointReset: string
  permissions: string[]
  banned: boolean
  approved: boolean
  pointsHistory: PointHistoryEntry[]
  interactionHistory: UserInteraction[]
  roleExpirations: RoleExpiration[]
  tasks?: Task[]
}

export interface PointHistoryEntry {
  amount: number
  reason: string
  timestamp: string
  awardedBy: string
}

export interface UserInteraction {
  id: string
  type: string
  timestamp: string
  reason: string
  performedBy: string
  details?: string
  points?: number
}

export interface RoleExpiration {
  roleId: string
  expiresAt: string
  assignedAt?: string
  assignedBy?: string
}

// Rollentypen
export interface Role {
  id: string
  name: string
  description: string
  pointThreshold: number
  permissions: string[]
  isTemporary: boolean
  expirationDays?: number
}

// Inhaltstypen
export interface Content {
  id: string
  title: string
  body: string
  createdAt: string
  updatedAt: string
  createdBy: string
  type: string
  permissions: ContentPermissions
}

export interface ContentPermissions {
  view: string[]
  edit: string[]
  delete: string[]
}

// Aktivitätsprotokoll
export interface ActivityLogEntry {
  id: string
  type: string
  userId: string
  username: string
  timestamp: string
  target?: string
  details: string
}

// Systemeinstellungen
export interface SystemSettings {
  lastRoleResetDate: string
  pointResetDay: number
  roleResetDay: number
  systemVersion: string
  maintenanceMode: boolean
}

// Aufgaben
export interface Task {
  id: string
  title: string
  description: string
  assignedTo: string[]
  createdBy: string
  createdAt: string
  dueDate: string
  status: "pending" | "in_progress" | "completed" | "cancelled"
  priority: "low" | "medium" | "high" | "urgent"
  tags: string[]
}

// Regelverstoß
export interface Violation {
  id: string
  name: string
  pointsDeduction: number
  description?: string
}

// Punktabzugsantrag
export interface PointDeductionRequest {
  id: string
  userId: string
  requestedBy: string
  requestedAt: string
  reason: string
  violationType: string
  points: number
  status: "pending" | "approved" | "rejected"
  reviewedBy?: string
  reviewedAt?: string
  reviewNotes?: string
}

// Server-Daten
export interface ServerStats {
  online: boolean
  players: {
    online: number
    max: number
    list: string[]
  }
  version: string
  lastUpdated: Date
  tps: number
  memoryUsage: number
  memoryMax: number
  uptime: number
}


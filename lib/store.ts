import type {
  User,
  Role,
  Content,
  ActivityLogEntry,
  SystemSettings,
  UserInteraction,
  Violation,
  PointDeductionRequest,
  Task,
} from "./types"

// Initialize localStorage with default data if it doesn't exist
export function initializeStore() {
  // Check if store is already initialized
  if (localStorage.getItem("storeInitialized")) {
    return
  }

  // Default roles
  const defaultRoles: Role[] = [
    {
      id: "owner",
      name: "Owner",
      description: "Full access to all features and settings",
      pointThreshold: Number.POSITIVE_INFINITY,
      permissions: [
        "manage_users",
        "manage_roles",
        "manage_points",
        "create_content",
        "delete_content",
        "edit_content",
        "ban_users",
        "view_admin",
        "assign_roles",
        "manage_stories",
        "reset_points",
        "view_logs",
        "manage_permissions",
        "edit_any_content",
        "delete_any_content",
        "create_tasks",
        "delete_tasks",
        "assign_tasks",
      ],
      isTemporary: false,
    },
    {
      id: "co-owner",
      name: "Co-Owner",
      description: "Almost full access, reports to owner",
      pointThreshold: 1000,
      permissions: [
        "manage_users",
        "manage_roles",
        "manage_points",
        "create_content",
        "delete_content",
        "edit_content",
        "ban_users",
        "view_admin",
        "assign_roles",
        "manage_stories",
        "view_logs",
        "manage_permissions",
        "edit_any_content",
        "create_tasks",
        "delete_tasks",
        "assign_tasks",
      ],
      isTemporary: false,
    },
    {
      id: "admin",
      name: "Administrator",
      description: "Administrative access to most features",
      pointThreshold: 500,
      permissions: [
        "manage_users",
        "manage_points",
        "create_content",
        "delete_content",
        "edit_content",
        "ban_users",
        "view_admin",
        "manage_stories",
        "view_logs",
        "create_tasks",
        "delete_tasks",
        "assign_tasks",
      ],
      isTemporary: true,
      expirationDays: 30,
    },
    {
      id: "moderator",
      name: "Moderator",
      description: "Can moderate content and users",
      pointThreshold: 250,
      permissions: ["create_content", "edit_content", "view_admin", "manage_stories", "create_tasks", "assign_tasks"],
      isTemporary: true,
      expirationDays: 60,
    },
    {
      id: "member",
      name: "Member",
      description: "Regular member with basic privileges",
      pointThreshold: 100,
      permissions: ["create_content", "create_tasks"],
      isTemporary: true,
      expirationDays: 90,
    },
    {
      id: "user",
      name: "User",
      description: "Basic user with minimal privileges",
      pointThreshold: 0,
      permissions: [],
      isTemporary: false,
    },
  ]

  // Default admin user
  const defaultAdmin: User = {
    id: "1",
    username: "admin",
    password: "admin123", // Simple password for testing
    role: "owner",
    points: 1000,
    createdAt: new Date().toISOString(),
    lastPointReset: new Date().toISOString(),
    permissions: [],
    banned: false,
    approved: true, // Admin is automatically approved
    pointsHistory: [
      {
        amount: 1000,
        reason: "Initial points",
        timestamp: new Date().toISOString(),
        awardedBy: "system",
      },
    ],
    interactionHistory: [],
    roleExpirations: [],
  }

  // Default system settings
  const defaultSettings: SystemSettings = {
    lastRoleResetDate: new Date().toISOString(),
    pointResetDay: 1, // First day of the month
    roleResetDay: 1, // First day of the month
    systemVersion: "1.0.0",
    maintenanceMode: false,
  }

  // Default violations
  const defaultViolations: Violation[] = [
    {
      id: "spam",
      name: "Spamming",
      pointsDeduction: 50,
      description: "Repeatedly sending the same message or flooding chat",
    },
    {
      id: "harassment",
      name: "Harassment",
      pointsDeduction: 100,
      description: "Targeting other players with unwanted behavior",
    },
    {
      id: "inappropriate_content",
      name: "Inappropriate Content",
      pointsDeduction: 75,
      description: "Sharing content that violates server rules",
    },
    {
      id: "rule_breaking",
      name: "Breaking Server Rules",
      pointsDeduction: 60,
      description: "Violating established server rules",
    },
    {
      id: "griefing",
      name: "Griefing",
      pointsDeduction: 80,
      description: "Deliberately damaging other players' builds",
    },
  ]

  // Initialize localStorage with default data
  localStorage.setItem("roles", JSON.stringify(defaultRoles))
  localStorage.setItem("users", JSON.stringify([defaultAdmin]))
  localStorage.setItem("content", JSON.stringify([]))
  localStorage.setItem("activityLog", JSON.stringify([]))
  localStorage.setItem("systemSettings", JSON.stringify(defaultSettings))
  localStorage.setItem("violations", JSON.stringify(defaultViolations))
  localStorage.setItem("pointDeductionRequests", JSON.stringify([]))
  localStorage.setItem("tasks", JSON.stringify([]))
  localStorage.setItem("storeInitialized", "true")

  // Set current user to admin for testing
  localStorage.setItem("currentUser", JSON.stringify(defaultAdmin))
}

// User Management
export function getUsers(): User[] {
  return JSON.parse(localStorage.getItem("users") || "[]")
}

export function saveUsers(users: User[]) {
  localStorage.setItem("users", JSON.stringify(users))
}

export function getUserById(userId: string): User | undefined {
  const users = getUsers()
  return users.find((user) => user.id === userId)
}

export function updateUser(updatedUser: User) {
  const users = getUsers()
  const index = users.findIndex((user) => user.id === updatedUser.id)

  if (index !== -1) {
    users[index] = updatedUser
    saveUsers(users)

    // If this is the current user, update currentUser in localStorage
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null")
    if (currentUser && currentUser.id === updatedUser.id) {
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))
    }

    return true
  }

  return false
}

export function deleteUser(userId: string) {
  const users = getUsers()
  const filteredUsers = users.filter((user) => user.id !== userId)

  if (filteredUsers.length !== users.length) {
    saveUsers(filteredUsers)
    return true
  }

  return false
}

export function createUser(newUser: User) {
  const users = getUsers()
  users.push(newUser)
  saveUsers(users)
  return true
}

export function getCurrentUser(): User | null {
  const currentUser = localStorage.getItem("currentUser")
  return currentUser ? JSON.parse(currentUser) : null
}

export function setCurrentUser(user: User | null) {
  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user))
  } else {
    localStorage.removeItem("currentUser")
  }
}

export function loginUser(username: string, password: string): User | null {
  const users = getUsers()
  const user = users.find((u) => u.username === username && u.password === password)

  if (user) {
    // Check if user is banned
    if (user.banned) {
      return null
    }

    // Check if user is approved
    if (!user.approved) {
      return null
    }

    setCurrentUser(user)
    return user
  }

  return null
}

export function logoutUser() {
  setCurrentUser(null)
}

// Role Management
export function getRoles(): Role[] {
  return JSON.parse(localStorage.getItem("roles") || "[]")
}

export function saveRoles(roles: Role[]) {
  localStorage.setItem("roles", JSON.stringify(roles))
}

export function getRoleById(roleId: string): Role | undefined {
  const roles = getRoles()
  return roles.find((role) => role.id === roleId)
}

export function updateRole(updatedRole: Role) {
  const roles = getRoles()
  const index = roles.findIndex((role) => role.id === updatedRole.id)

  if (index !== -1) {
    roles[index] = updatedRole
    saveRoles(roles)
    return true
  }

  return false
}

export function createRole(newRole: Role) {
  const roles = getRoles()
  roles.push(newRole)
  saveRoles(roles)
  return true
}

export function deleteRole(roleId: string) {
  const roles = getRoles()
  const filteredRoles = roles.filter((role) => role.id !== roleId)

  if (filteredRoles.length !== roles.length) {
    saveRoles(filteredRoles)
    return true
  }

  return false
}

// Content Management
export function getContent(): Content[] {
  return JSON.parse(localStorage.getItem("content") || "[]")
}

export function saveContent(content: Content[]) {
  localStorage.setItem("content", JSON.stringify(content))
}

export function getContentById(contentId: string): Content | undefined {
  const content = getContent()
  return content.find((item) => item.id === contentId)
}

export function updateContent(updatedContent: Content) {
  const content = getContent()
  const index = content.findIndex((item) => item.id === updatedContent.id)

  if (index !== -1) {
    content[index] = updatedContent
    saveContent(content)
    return true
  }

  return false
}

export function createContent(newContent: Content) {
  const content = getContent()
  content.push(newContent)
  saveContent(content)
  return true
}

export function deleteContent(contentId: string) {
  const content = getContent()
  const filteredContent = content.filter((item) => item.id !== contentId)

  if (filteredContent.length !== content.length) {
    saveContent(filteredContent)
    return true
  }

  return false
}

// Activity Log Management
export function getActivityLog(): ActivityLogEntry[] {
  return JSON.parse(localStorage.getItem("activityLog") || "[]")
}

export function saveActivityLog(log: ActivityLogEntry[]) {
  localStorage.setItem("activityLog", JSON.stringify(log))
}

export function addActivityLogEntry(entry: ActivityLogEntry) {
  const log = getActivityLog()
  log.unshift(entry) // Add to beginning of array
  saveActivityLog(log)
}

// System Settings Management
export function getSystemSettings(): SystemSettings {
  return JSON.parse(localStorage.getItem("systemSettings") || "{}")
}

export function saveSystemSettings(settings: SystemSettings) {
  localStorage.setItem("systemSettings", JSON.stringify(settings))
}

// User Interactions
export function addUserInteraction(userId: string, interaction: UserInteraction) {
  const user = getUserById(userId)

  if (user) {
    user.interactionHistory = [interaction, ...user.interactionHistory]
    updateUser(user)

    // Log the interaction in the activity log
    addActivityLogEntry({
      id: Date.now().toString(),
      type: `user_${interaction.type}`,
      userId: interaction.performedBy,
      username: getUserById(interaction.performedBy)?.username || "System",
      timestamp: interaction.timestamp,
      target: userId,
      details: interaction.reason,
    })

    return true
  }

  return false
}

// Check and handle role expirations
export function checkRoleExpirations() {
  const users = getUsers()
  const roles = getRoles()
  const settings = getSystemSettings()
  const now = new Date()

  // Check if it's time for the monthly role reset
  const lastReset = new Date(settings.lastRoleResetDate)
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  const resetDay = settings.roleResetDay

  // If it's a new month and we're on or past the reset day
  if (
    (currentMonth > lastReset.getMonth() || (currentMonth === 0 && lastReset.getMonth() === 11)) &&
    now.getDate() >= resetDay
  ) {
    // Update users with temporary roles
    const updatedUsers = users.map((user) => {
      const userRole = roles.find((r) => r.id === user.role)

      // If the user has a temporary role, reset it to 'user'
      if (userRole?.isTemporary) {
        // Add to interaction history
        user.interactionHistory.unshift({
          id: Date.now().toString(),
          type: "role_change",
          timestamp: now.toISOString(),
          reason: "Monthly role expiration",
          performedBy: "system",
          details: `Role changed from ${user.role} to user due to monthly expiration`,
        })

        // Reset role to user
        user.role = "user"

        // Clear role expirations
        user.roleExpirations = user.roleExpirations.filter(
          (exp) => !roles.find((r) => r.id === exp.roleId)?.isTemporary,
        )
      }

      return user
    })

    // Save updated users
    saveUsers(updatedUsers)

    // Update last reset date
    settings.lastRoleResetDate = now.toISOString()
    saveSystemSettings(settings)

    // Log the reset
    addActivityLogEntry({
      id: Date.now().toString(),
      type: "system_role_reset",
      userId: "system",
      username: "System",
      timestamp: now.toISOString(),
      details: "Monthly role reset performed",
    })
  }

  // Check individual role expirations
  const updatedUsers = users.map((user) => {
    if (user.roleExpirations && user.roleExpirations.length > 0) {
      const expiredRoles = user.roleExpirations.filter((exp) => new Date(exp.expiresAt) <= now)

      if (expiredRoles.length > 0) {
        // Add to interaction history for each expired role
        expiredRoles.forEach((exp) => {
          user.interactionHistory.unshift({
            id: Date.now().toString(),
            type: "role_change",
            timestamp: now.toISOString(),
            reason: "Role expiration",
            performedBy: "system",
            details: `Role ${exp.roleId} expired`,
          })
        })

        // Remove expired roles
        user.roleExpirations = user.roleExpirations.filter((exp) => new Date(exp.expiresAt) > now)
      }
    }

    return user
  })

  // Save updated users if there were changes
  if (JSON.stringify(updatedUsers) !== JSON.stringify(users)) {
    saveUsers(updatedUsers)
  }
}

// Check and handle user demotions based on points
export function checkPointBasedDemotions() {
  const users = getUsers()
  const roles = getRoles()
  let updated = false

  // Sort roles by point threshold (descending)
  const sortedRoles = [...roles].sort((a, b) => b.pointThreshold - a.pointThreshold)

  const updatedUsers = users.map((user) => {
    const currentRole = roles.find((r) => r.id === user.role)

    // Skip if user is owner or doesn't have a valid role
    if (user.role === "owner" || !currentRole) {
      return user
    }

    // Check if user's points are below their current role's threshold
    if (user.points < currentRole.pointThreshold) {
      // Find the appropriate role based on points
      const newRole = sortedRoles.find((r) => user.points >= r.pointThreshold)

      if (newRole && newRole.id !== user.role) {
        // Add to interaction history
        user.interactionHistory.unshift({
          id: Date.now().toString(),
          type: "role_change",
          timestamp: new Date().toISOString(),
          reason: "Insufficient points for current role",
          performedBy: "system",
          details: `Role changed from ${user.role} to ${newRole.id} due to insufficient points`,
        })

        // Log the demotion
        addActivityLogEntry({
          id: Date.now().toString(),
          type: "user_demoted",
          userId: "system",
          username: "System",
          timestamp: new Date().toISOString(),
          details: `User demoted from ${user.role} to ${newRole.id} due to insufficient points`,
        })

        // Update the user's role
        user.role = newRole.id
        updated = true
      }
    }

    return user
  })

  // Save updated users if there were changes
  if (updated) {
    saveUsers(updatedUsers)
  }
}

// Reset points but maintain demotions
export function resetPoints() {
  const users = getUsers()
  const now = new Date().toISOString()

  const updatedUsers = users.map((user) => {
    // Create a points history entry for the reset
    const historyEntry = {
      amount: -user.points,
      reason: "Monthly points reset",
      timestamp: now,
      awardedBy: "system",
    }

    // Reset points but keep the current role (don't promote)
    return {
      ...user,
      points: 0,
      pointsHistory: [historyEntry, ...user.pointsHistory],
      lastPointReset: now,
    }
  })

  saveUsers(updatedUsers)

  // Log the reset
  addActivityLogEntry({
    id: Date.now().toString(),
    type: "system_points_reset",
    userId: "system",
    username: "System",
    timestamp: now,
    details: "Monthly points reset performed",
  })

  return true
}

// Check if a user has permission to perform an action
export function userHasPermission(userId: string, permission: string): boolean {
  const user = getUserById(userId)
  if (!user) return false

  // Check if user has the specific permission
  if (user.permissions && user.permissions.includes(permission)) {
    return true
  }

  // Check if user's role has the permission
  const userRole = getRoleById(user.role)
  return Boolean(userRole && userRole.permissions && userRole.permissions.includes(permission))
}

// Check if a user can modify specific content
export function canModifyContent(userId: string, content: Content, action: "view" | "edit" | "delete"): boolean {
  const user = getUserById(userId)
  if (!user) return false

  // Owners and co-owners can do anything
  if (user.role === "owner" || user.role === "co-owner") {
    return true
  }

  // Content creators can always modify their own content
  if (content.createdBy === userId) {
    return true
  }

  // Check specific content permissions
  if (content.permissions[action].includes(userId) || content.permissions[action].includes(user.role)) {
    return true
  }

  // Check if user has global permissions
  if (action === "edit" && userHasPermission(userId, "edit_any_content")) {
    return true
  }

  if (action === "delete" && userHasPermission(userId, "delete_any_content")) {
    return true
  }

  return false
}

// Violations Management
export function getViolations(): Violation[] {
  return JSON.parse(localStorage.getItem("violations") || "[]")
}

export function saveViolations(violations: Violation[]) {
  localStorage.setItem("violations", JSON.stringify(violations))
}

export function getViolationById(violationId: string): Violation | undefined {
  const violations = getViolations()
  return violations.find((v) => v.id === violationId)
}

export function updateViolation(updatedViolation: Violation) {
  const violations = getViolations()
  const index = violations.findIndex((v) => v.id === updatedViolation.id)

  if (index !== -1) {
    violations[index] = updatedViolation
    saveViolations(violations)
    return true
  }

  return false
}

export function createViolation(newViolation: Violation) {
  const violations = getViolations()
  violations.push(newViolation)
  saveViolations(violations)
  return true
}

export function deleteViolation(violationId: string) {
  const violations = getViolations()
  const filteredViolations = violations.filter((v) => v.id !== violationId)

  if (filteredViolations.length !== violations.length) {
    saveViolations(filteredViolations)
    return true
  }

  return false
}

// Point Deduction Requests Management
export function getPointDeductionRequests(): PointDeductionRequest[] {
  return JSON.parse(localStorage.getItem("pointDeductionRequests") || "[]")
}

export function savePointDeductionRequests(requests: PointDeductionRequest[]) {
  localStorage.setItem("pointDeductionRequests", JSON.stringify(requests))
}

export function getPointDeductionRequestById(requestId: string): PointDeductionRequest | undefined {
  const requests = getPointDeductionRequests()
  return requests.find((r) => r.id === requestId)
}

export function createPointDeductionRequest(newRequest: PointDeductionRequest) {
  const requests = getPointDeductionRequests()
  requests.push(newRequest)
  savePointDeductionRequests(requests)
  return true
}

export function updatePointDeductionRequest(updatedRequest: PointDeductionRequest) {
  const requests = getPointDeductionRequests()
  const index = requests.findIndex((r) => r.id === updatedRequest.id)

  if (index !== -1) {
    requests[index] = updatedRequest
    savePointDeductionRequests(requests)
    return true
  }

  return false
}

export function approvePointDeductionRequest(requestId: string, approvedBy: string) {
  const request = getPointDeductionRequestById(requestId)
  if (!request) return false

  // Update request status
  request.status = "approved"
  request.resolvedBy = approvedBy
  request.resolvedAt = new Date().toISOString()
  updatePointDeductionRequest(request)

  // Apply point deduction to user
  const user = getUserById(request.userId)
  if (!user) return false

  // Create points history entry
  const historyEntry = {
    amount: -request.points,
    reason: request.reason,
    timestamp: new Date().toISOString(),
    awardedBy: approvedBy,
  }

  // Update user points
  user.points = Math.max(0, user.points - request.points)
  user.pointsHistory = [historyEntry, ...(user.pointsHistory || [])]
  updateUser(user)

  // Log the action
  addActivityLogEntry({
    id: Date.now().toString(),
    type: "point_deduction_approved",
    userId: approvedBy,
    username: getUserById(approvedBy)?.username || "System",
    timestamp: new Date().toISOString(),
    target: request.userId,
    details: `Approved point deduction of ${request.points} points for ${request.reason}`,
  })

  return true
}

export function rejectPointDeductionRequest(requestId: string, rejectedBy: string, reason?: string) {
  const request = getPointDeductionRequestById(requestId)
  if (!request) return false

  // Update request status
  request.status = "rejected"
  request.resolvedBy = rejectedBy
  request.resolvedAt = new Date().toISOString()
  request.comments = reason || "No reason provided"
  updatePointDeductionRequest(request)

  // Log the action
  addActivityLogEntry({
    id: Date.now().toString(),
    type: "point_deduction_rejected",
    userId: rejectedBy,
    username: getUserById(rejectedBy)?.username || "System",
    timestamp: new Date().toISOString(),
    target: request.userId,
    details: `Rejected point deduction request: ${reason || "No reason provided"}`,
  })

  return true
}

// Tasks Management
export function getTasks(): Task[] {
  return JSON.parse(localStorage.getItem("tasks") || "[]")
}

export function saveTasks(tasks: Task[]) {
  localStorage.setItem("tasks", JSON.stringify(tasks))
}

export function getTaskById(taskId: string): Task | undefined {
  const tasks = getTasks()
  return tasks.find((t) => t.id === taskId)
}

export function createTask(newTask: Task) {
  const tasks = getTasks()
  tasks.push(newTask)
  saveTasks(tasks)
  return true
}

export function updateTask(updatedTask: Task) {
  const tasks = getTasks()
  const index = tasks.findIndex((t) => t.id === updatedTask.id)

  if (index !== -1) {
    tasks[index] = updatedTask
    saveTasks(tasks)
    return true
  }

  return false
}

export function deleteTask(taskId: string) {
  const tasks = getTasks()
  const filteredTasks = tasks.filter((t) => t.id !== taskId)

  if (filteredTasks.length !== tasks.length) {
    saveTasks(filteredTasks)
    return true
  }

  return false
}

export function getTasksDueToday(): Task[] {
  const tasks = getTasks()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  return tasks.filter((task) => {
    const dueDate = new Date(task.dueDate)
    dueDate.setHours(0, 0, 0, 0)
    return dueDate >= today && dueDate < tomorrow && task.status !== "completed" && task.status !== "cancelled"
  })
}

export function getTasksAssignedToUser(userId: string): Task[] {
  const tasks = getTasks()
  return tasks.filter((task) => task.assignedTo.includes(userId))
}

// Initialize the store
export function initializeApp() {
  initializeStore()
  checkRoleExpirations()
  checkPointBasedDemotions()
}


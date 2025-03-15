import { getUserById, getUsers, createUser, loginUser, logoutUser, updateUser } from "./store"
import type { User } from "./types"

// In a real application, you would use a proper hashing library like bcrypt
// For this example, we'll simulate password hashing

export async function hashPassword(password: string): Promise<string> {
  // This is a simplified version for demonstration purposes
  // In a real app, use bcrypt or Argon2
  return `hashed_${password}_${Date.now()}`
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  // For demo purposes, we'll check if the hashed password contains the original password
  // In a real app, use bcrypt.compare or equivalent
  if (hashedPassword.startsWith("hashed_")) {
    const parts = hashedPassword.split("_")
    return parts[1] === password
  }

  // For users created before hashing was implemented
  return password === hashedPassword
}

// Register a new user
export function registerUser(username: string, password: string): { success: boolean; message: string; user?: User } {
  // Check if username already exists
  const users = getUsers()
  const existingUser = users.find((u) => u.username === username)

  if (existingUser) {
    return {
      success: false,
      message: "Username already exists",
    }
  }

  // Create new user
  const newUser: User = {
    id: Date.now().toString(),
    username,
    password, // In a real app, this should be hashed
    role: "user",
    points: 100, // Default starting points
    createdAt: new Date().toISOString(),
    lastPointReset: new Date().toISOString(),
    permissions: [],
    banned: false,
    approved: false, // New users need approval
    pointsHistory: [
      {
        amount: 100,
        reason: "Initial points",
        timestamp: new Date().toISOString(),
        awardedBy: "system",
      },
    ],
    interactionHistory: [],
    roleExpirations: [],
  }

  // Add user to the store
  createUser(newUser)

  return {
    success: true,
    message: "Registration successful. Your account is pending approval.",
    user: newUser,
  }
}

// Login a user
export function login(username: string, password: string): { success: boolean; message: string; user?: User } {
  const user = loginUser(username, password)

  if (!user) {
    return {
      success: false,
      message: "Invalid username or password, or your account is not approved yet.",
    }
  }

  return {
    success: true,
    message: "Login successful",
    user,
  }
}

// Logout the current user
export function logout(): { success: boolean; message: string } {
  logoutUser()
  return {
    success: true,
    message: "Logout successful",
  }
}

// Change user password
export function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
): { success: boolean; message: string } {
  const user = getUserById(userId)

  if (!user) {
    return {
      success: false,
      message: "User not found",
    }
  }

  // Verify current password
  if (user.password !== currentPassword) {
    return {
      success: false,
      message: "Current password is incorrect",
    }
  }

  // Update password
  user.password = newPassword
  updateUser(user)

  return {
    success: true,
    message: "Password changed successfully",
  }
}

// Approve a user
export function approveUser(userId: string, approvedBy: string): { success: boolean; message: string } {
  const user = getUserById(userId)

  if (!user) {
    return {
      success: false,
      message: "User not found",
    }
  }

  // Update user
  user.approved = true
  user.interactionHistory.unshift({
    id: Date.now().toString(),
    type: "approval",
    timestamp: new Date().toISOString(),
    reason: "User approved",
    performedBy: approvedBy,
    details: "Account approved by administrator",
  })

  updateUser(user)

  return {
    success: true,
    message: "User approved successfully",
  }
}

// Ban a user
export function banUser(userId: string, bannedBy: string, reason: string): { success: boolean; message: string } {
  const user = getUserById(userId)

  if (!user) {
    return {
      success: false,
      message: "User not found",
    }
  }

  // Cannot ban owner
  if (user.role === "owner") {
    return {
      success: false,
      message: "Cannot ban the owner",
    }
  }

  // Update user
  user.banned = true
  user.interactionHistory.unshift({
    id: Date.now().toString(),
    type: "ban",
    timestamp: new Date().toISOString(),
    reason,
    performedBy: bannedBy,
    details: `User banned: ${reason}`,
  })

  updateUser(user)

  return {
    success: true,
    message: "User banned successfully",
  }
}

// Unban a user
export function unbanUser(userId: string, unbannedBy: string): { success: boolean; message: string } {
  const user = getUserById(userId)

  if (!user) {
    return {
      success: false,
      message: "User not found",
    }
  }

  // Update user
  user.banned = false
  user.interactionHistory.unshift({
    id: Date.now().toString(),
    type: "unban",
    timestamp: new Date().toISOString(),
    reason: "User unbanned",
    performedBy: unbannedBy,
    details: "User unbanned by administrator",
  })

  updateUser(user)

  return {
    success: true,
    message: "User unbanned successfully",
  }
}


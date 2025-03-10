import { db } from "@/lib/db"
import { hashPassword, verifyPassword } from "@/lib/password"
import { generateSecurePassword } from "@/lib/utils"

/**
 * Checks if an owner account already exists
 */
export async function checkOwnerExists(): Promise<boolean> {
  const ownerCount = await db.user.count({
    where: {
      role: "owner",
    },
  })

  return ownerCount > 0
}

/**
 * Creates an owner account with a secure random password
 */
export async function createOwnerAccount(): Promise<{ email: string; password: string }> {
  const email = "owner@example.com"
  const password = generateSecurePassword()
  const hashedPassword = await hashPassword(password)

  await db.user.create({
    data: {
      email,
      name: "System Owner",
      password: hashedPassword,
      role: "owner",
    },
  })

  return { email, password }
}

/**
 * Updates the owner's password
 */
export async function updateOwnerPassword(userId: string, newPassword: string): Promise<boolean> {
  const hashedPassword = await hashPassword(newPassword)

  await db.user.update({
    where: {
      id: userId,
    },
    data: {
      password: hashedPassword,
    },
  })

  return true
}

/**
 * Validates the current password for a user
 */
export async function validateUserPassword(userId: string, password: string): Promise<boolean> {
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      password: true,
    },
  })

  if (!user) {
    return false
  }

  return await verifyPassword(password, user.password)
}


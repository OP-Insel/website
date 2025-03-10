"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { validateUserPassword, updateOwnerPassword } from "@/lib/user"

/**
 * Server action to change the user's password
 */
export async function changePassword(currentPassword: string, newPassword: string) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user.id) {
      return { success: false, error: "Not authenticated" }
    }

    // Validate current password
    const isValid = await validateUserPassword(session.user.id, currentPassword)

    if (!isValid) {
      return { success: false, error: "Current password is incorrect" }
    }

    // Update password
    await updateOwnerPassword(session.user.id, newPassword)

    return { success: true }
  } catch (error) {
    console.error("Password change error:", error)
    return { success: false, error: "Failed to change password" }
  }
}


import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines class names with Tailwind CSS
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generates a secure random password
 */
export function generateSecurePassword(length = 16): string {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+"
  let password = ""

  // Ensure at least one character from each category
  password += getRandomChar("ABCDEFGHIJKLMNOPQRSTUVWXYZ")
  password += getRandomChar("abcdefghijklmnopqrstuvwxyz")
  password += getRandomChar("0123456789")
  password += getRandomChar("!@#$%^&*()-_=+")

  // Fill the rest of the password
  for (let i = password.length; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length)
    password += charset[randomIndex]
  }

  // Shuffle the password
  return shuffleString(password)
}

/**
 * Gets a random character from a string
 */
function getRandomChar(characters: string): string {
  const randomIndex = Math.floor(Math.random() * characters.length)
  return characters[randomIndex]
}

/**
 * Shuffles a string
 */
function shuffleString(str: string): string {
  const array = str.split("")
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array.join("")
}


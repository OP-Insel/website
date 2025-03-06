import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import type { User } from "@/lib/types"

export function getRankColor(rank: string): string {
  switch (rank) {
    case "Owner":
      return "bg-black text-white dark:bg-white dark:text-black"
    case "Co-Owner":
      return "bg-gray-800 text-white dark:bg-gray-200 dark:text-black"
    case "Developer":
      return "bg-gray-700 text-white dark:bg-gray-300 dark:text-black"
    case "Admin":
      return "bg-gray-700 text-white dark:bg-gray-300 dark:text-black"
    case "Jr. Admin":
      return "bg-gray-600 text-white dark:bg-gray-400 dark:text-black"
    case "MOD":
      return "bg-gray-600 text-white dark:bg-gray-400 dark:text-black"
    case "Jr. Moderator":
      return "bg-gray-500 text-white dark:bg-gray-500 dark:text-white"
    case "Sr. Builder":
      return "bg-gray-500 text-white dark:bg-gray-500 dark:text-white"
    case "Builder":
      return "bg-gray-400 text-black dark:bg-gray-600 dark:text-white"
    case "Supporter":
      return "bg-gray-400 text-black dark:bg-gray-600 dark:text-white"
    case "Jr. Supporter":
      return "bg-gray-300 text-black dark:bg-gray-700 dark:text-white"
    default:
      return "bg-gray-700 text-white dark:bg-gray-300 dark:text-black"
  }
}

export function getMoodEmoji(user: User): string {
  // Find the rank's minimum points
  const rankMinPoints = getRankMinPoints(user.rank)

  if (rankMinPoints === Number.POSITIVE_INFINITY) {
    return "😎" // Owner is always cool
  }

  // Calculate how close they are to demotion
  const pointsAboveMinimum = user.points - rankMinPoints

  if (pointsAboveMinimum <= 0) {
    return "😱" // Already below minimum
  } else if (pointsAboveMinimum <= 20) {
    return "😰" // Very close to demotion
  } else if (pointsAboveMinimum <= 50) {
    return "😟" // Getting close to demotion
  } else if (pointsAboveMinimum <= 100) {
    return "😐" // Neutral
  } else {
    return "😄" // Far from demotion
  }
}

function getRankMinPoints(rank: string): number {
  switch (rank) {
    case "Owner":
      return Number.POSITIVE_INFINITY
    case "Co-Owner":
      return 750
    case "Developer":
      return 250
    case "Admin":
      return 500
    case "Jr. Admin":
      return 400
    case "MOD":
      return 300
    case "Jr. Moderator":
      return 250
    case "Sr. Builder":
      return 300
    case "Builder":
      return 200
    case "Supporter":
      return 200
    case "Jr. Supporter":
      return 150
    default:
      return 0
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


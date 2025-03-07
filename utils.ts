export function getRankColor(rank: string): string {
  switch (rank) {
    case "Owner":
      return "bg-red-500 hover:bg-red-600"
    case "Co-Owner":
      return "bg-orange-500 hover:bg-orange-600"
    case "Admin":
      return "bg-amber-500 hover:bg-amber-600"
    case "Jr. Admin":
      return "bg-yellow-500 hover:bg-yellow-600"
    case "Moderator":
      return "bg-lime-500 hover:bg-lime-600"
    case "Jr. Moderator":
      return "bg-green-500 hover:bg-green-600"
    case "Supporter":
      return "bg-teal-500 hover:bg-teal-600"
    case "Jr. Supporter":
      return "bg-cyan-500 hover:bg-cyan-600"
    default:
      return "bg-blue-500 hover:bg-blue-600"
  }
}

export function getPointsEmoji(points: number, rank: string): string {
  // Get degradation threshold for the rank
  let threshold = 0
  switch (rank) {
    case "Co-Owner": threshold = 500; break
    case "Admin": threshold = 400; break
    case "Jr. Admin": threshold = 300; break
    case "Moderator": threshold = 250; break
    case "Jr. Moderator": threshold = 200; break
    case "Supporter": threshold = 150; break
    case "Jr. Supporter": threshold = 100; break
    default: threshold = 100; break
  }
  
  // Calculate percentage of points relative to threshold
  const percentage = (points / threshold) * 100
  
  if (percentage <= 25) return "😱" // Very close to degradation
  if (percentage <= 50) return "😨" // Close to degradation
  if (percentage <= 75) return "😐" // Neutral
  if (percentage <= 90) return "🙂" // Good
  return "😄" // Excellent
}

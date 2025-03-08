// Format: [currentRank, nextRank, threshold]
export const rankConfig = [
  ["Co-Owner", "Admin", 500],
  ["Admin", "Jr. Admin", 400],
  ["Jr. Admin", "Moderator", 300],
  ["Moderator", "Jr. Moderator", 250],
  ["Jr. Moderator", "Supporter", 200],
  ["Supporter", "Jr. Supporter", 150],
  ["Jr. Supporter", "Removed", 0],
]


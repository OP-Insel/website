export const initialTasks = [
  {
    id: "1",
    title: "Complete the Dragon's Lair build",
    description:
      "Finish building the Dragon's Lair area for Chapter 3 of the story. Need to add lava rivers and treasure pile.",
    type: "build",
    priority: "high",
    status: "pending",
    assignedTo: "2", // CoOwnerUser
    createdAt: "2023-06-01T10:00:00Z",
    createdBy: "1", // OwnerUser
  },
  {
    id: "2",
    title: "Set up command blocks for temple puzzles",
    description: "Create the command block sequences for the Ancient Temple puzzles in Chapter 2.",
    type: "task",
    priority: "medium",
    status: "completed",
    assignedTo: "3", // AdminUser
    createdAt: "2023-05-25T14:30:00Z",
    createdBy: "1", // OwnerUser
    completedAt: "2023-05-28T16:45:00Z",
    completedBy: "3", // AdminUser
  },
  {
    id: "3",
    title: "Announce weekend event",
    description: "Create an announcement for the weekend event where we'll be launching Chapter 3 of the story.",
    type: "chat",
    priority: "medium",
    status: "pending",
    assignedTo: "all",
    createdAt: "2023-06-02T09:15:00Z",
    createdBy: "2", // CoOwnerUser
  },
  {
    id: "4",
    title: "Ban player for griefing",
    description: "Player 'GrieferDude123' was caught destroying parts of the spawn area. Please ban and document.",
    type: "task",
    priority: "high",
    status: "completed",
    assignedTo: "4", // ModeratorUser
    createdAt: "2023-06-03T15:20:00Z",
    createdBy: "3", // AdminUser
    completedAt: "2023-06-03T15:45:00Z",
    completedBy: "4", // ModeratorUser
  },
]


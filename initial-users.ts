export const initialUsers = [
  {
    id: "1",
    username: "OwnerUser",
    minecraftUsername: "MinecraftOwner",
    rank: "Owner",
    points: 1000,
    notes: "Server owner and administrator",
    history: [
      {
        date: "2023-05-15T12:00:00Z",
        action: "User created",
        pointsChange: 0,
      },
    ],
    shifts: [
      {
        title: "Server Maintenance",
        date: "2023-06-15",
        time: "18:00-20:00",
      },
    ],
  },
  {
    id: "2",
    username: "CoOwnerUser",
    minecraftUsername: "MinecraftCoOwner",
    rank: "Co-Owner",
    points: 800,
    notes: "Co-owner with administrative privileges",
    history: [
      {
        date: "2023-05-16T12:00:00Z",
        action: "User created",
        pointsChange: 0,
      },
      {
        date: "2023-05-20T14:30:00Z",
        action: "Promoted to Co-Owner",
        pointsChange: 200,
      },
    ],
    shifts: [
      {
        title: "Team Meeting",
        date: "2023-06-20",
        time: "19:00-20:00",
      },
    ],
  },
  {
    id: "3",
    username: "AdminUser",
    minecraftUsername: "MinecraftAdmin",
    rank: "Admin",
    points: 450,
    notes: "Senior administrator",
    history: [
      {
        date: "2023-05-17T12:00:00Z",
        action: "User created",
        pointsChange: 0,
      },
      {
        date: "2023-05-25T10:15:00Z",
        action: "Deducted 10 points: Inactive without notice",
        pointsChange: -10,
      },
    ],
  },
  {
    id: "4",
    username: "ModeratorUser",
    minecraftUsername: "MinecraftMod",
    rank: "Moderator",
    points: 280,
    notes: "Experienced moderator",
    history: [
      {
        date: "2023-05-18T12:00:00Z",
        action: "User created",
        pointsChange: 0,
      },
      {
        date: "2023-05-28T16:45:00Z",
        action: "Deducted 5 points: Command spamming",
        pointsChange: -5,
      },
    ],
  },
  {
    id: "5",
    username: "SupporterUser",
    minecraftUsername: "MinecraftSupport",
    rank: "Supporter",
    points: 160,
    notes: "New team member",
    history: [
      {
        date: "2023-05-19T12:00:00Z",
        action: "User created",
        pointsChange: 0,
      },
    ],
  },
  {
    id: "6",
    username: "RemovedUser",
    minecraftUsername: "MinecraftRemoved",
    rank: "Removed",
    points: -10,
    notes: "Removed due to inactivity",
    history: [
      {
        date: "2023-05-10T12:00:00Z",
        action: "User created",
        pointsChange: 0,
      },
      {
        date: "2023-05-20T09:30:00Z",
        action: "Deducted 20 points: Abuse of admin rights",
        pointsChange: -20,
      },
      {
        date: "2023-05-25T11:45:00Z",
        action: "Removed from team due to negative points",
        pointsChange: 0,
      },
    ],
  },
]


"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserList } from "./components/user-list"
import { UserForm } from "./components/user-form"
import { AdminPanel } from "./components/admin-panel"
import { Calendar } from "./components/calendar"
import { useLocalStorage } from "./hooks/use-local-storage"
import { initialUsers } from "./data/initial-users"
import { rankConfig } from "./data/rank-config"
import { Header } from "./components/header"

export default function Home() {
  const [users, setUsers] = useLocalStorage("team-users", initialUsers)
  const [currentUser, setCurrentUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [activeTab, setActiveTab] = useState("users")

  // Check if current user is admin or co-owner
  useEffect(() => {
    if (currentUser) {
      setIsAdmin(["Owner", "Co-Owner"].includes(currentUser.rank))
    } else {
      // For demo purposes, default to admin view
      setIsAdmin(true)
    }
  }, [currentUser])

  const handleUserSelect = (user) => {
    setCurrentUser(user)
  }

  const handleUserUpdate = (updatedUser) => {
    setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)))
  }

  const handlePointDeduction = (userId, points, reason) => {
    setUsers(
      users.map((user) => {
        if (user.id === userId) {
          const newPoints = user.points - points
          let newRank = user.rank

          // Check for demotion
          if (newPoints <= 0) {
            newRank = "Removed"
          } else {
            for (const [currentRank, nextRank, threshold] of rankConfig) {
              if (user.rank === currentRank && newPoints < threshold) {
                newRank = nextRank
                break
              }
            }
          }

          return {
            ...user,
            points: newPoints,
            rank: newRank,
            history: [
              ...(user.history || []),
              {
                date: new Date().toISOString(),
                action: `Deducted ${points} points: ${reason}`,
                pointsChange: -points,
              },
            ],
          }
        }
        return user
      }),
    )
  }

  const handleAddUser = (newUser) => {
    setUsers([
      ...users,
      {
        ...newUser,
        id: Date.now().toString(),
        points:
          newUser.rank === "Owner"
            ? 1000
            : newUser.rank === "Co-Owner"
              ? 600
              : newUser.rank === "Admin"
                ? 500
                : newUser.rank === "Jr. Admin"
                  ? 400
                  : newUser.rank === "Moderator"
                    ? 300
                    : newUser.rank === "Jr. Moderator"
                      ? 250
                      : newUser.rank === "Supporter"
                        ? 200
                        : 150,
        history: [
          {
            date: new Date().toISOString(),
            action: "User added to team",
            pointsChange: 0,
          },
        ],
      },
    ])
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="container mx-auto py-6 px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-4 gap-4">
            <TabsTrigger value="users">Team Members</TabsTrigger>
            <TabsTrigger value="admin" disabled={!isAdmin}>
              Admin Panel
            </TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="rules">Rules & Points</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-1 bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription className="text-zinc-400">Select a user to view details</CardDescription>
                </CardHeader>
                <CardContent>
                  <UserList users={users} onUserSelect={handleUserSelect} />
                </CardContent>
              </Card>

              <Card className="md:col-span-2 bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle>User Details</CardTitle>
                  <CardDescription className="text-zinc-400">
                    {currentUser ? `Viewing ${currentUser.username}` : "Select a user to view details"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {currentUser ? (
                    <UserForm
                      user={currentUser}
                      onUpdate={handleUserUpdate}
                      isAdmin={isAdmin}
                      onPointDeduction={handlePointDeduction}
                    />
                  ) : (
                    <div className="text-center py-8 text-zinc-500">
                      Select a user from the list to view their details
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="admin">
            <AdminPanel users={users} onAddUser={handleAddUser} onUpdateUser={handleUserUpdate} />
          </TabsContent>

          <TabsContent value="calendar">
            <Calendar users={users} isAdmin={isAdmin} />
          </TabsContent>

          <TabsContent value="rules">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle>Rules & Point System</CardTitle>
                <CardDescription className="text-zinc-400">Team rules and point deduction system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">⚠ Point Deductions for Rule Violations</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-zinc-800">
                          <th className="text-left py-2 px-4">Violation</th>
                          <th className="text-right py-2 px-4">Point Deduction</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-zinc-800">
                          <td className="py-2 px-4">Ban without reason</td>
                          <td className="text-right py-2 px-4">-5 Points</td>
                        </tr>
                        <tr className="border-b border-zinc-800">
                          <td className="py-2 px-4">Unfair or unjustified punishment against players</td>
                          <td className="text-right py-2 px-4">-10 Points</td>
                        </tr>
                        <tr className="border-b border-zinc-800">
                          <td className="py-2 px-4">
                            Abuse of admin rights (e.g., giving yourself OP without permission)
                          </td>
                          <td className="text-right py-2 px-4">-20 Points</td>
                        </tr>
                        <tr className="border-b border-zinc-800">
                          <td className="py-2 px-4">Insulting or bad behavior towards players</td>
                          <td className="text-right py-2 px-4">-15 Points</td>
                        </tr>
                        <tr className="border-b border-zinc-800">
                          <td className="py-2 px-4">Inactive without notice (e.g., 2 weeks)</td>
                          <td className="text-right py-2 px-4">-10 Points</td>
                        </tr>
                        <tr className="border-b border-zinc-800">
                          <td className="py-2 px-4">Repeated misconduct despite warning</td>
                          <td className="text-right py-2 px-4">-30 Points</td>
                        </tr>
                        <tr className="border-b border-zinc-800">
                          <td className="py-2 px-4">Spamming commands or messages</td>
                          <td className="text-right py-2 px-4">-5 Points</td>
                        </tr>
                        <tr className="border-b border-zinc-800">
                          <td className="py-2 px-4">
                            Serious rule violations (e.g., manipulating server or player data)
                          </td>
                          <td className="text-right py-2 px-4">-20 Points</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">📉 Demotion System</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-zinc-800">
                          <th className="text-left py-2 px-4">Rank</th>
                          <th className="text-right py-2 px-4">Points for Automatic Demotion</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-zinc-800">
                          <td className="py-2 px-4">Co-Owner → Admin</td>
                          <td className="text-right py-2 px-4">500 Points</td>
                        </tr>
                        <tr className="border-b border-zinc-800">
                          <td className="py-2 px-4">Admin → Jr. Admin</td>
                          <td className="text-right py-2 px-4">400 Points</td>
                        </tr>
                        <tr className="border-b border-zinc-800">
                          <td className="py-2 px-4">Jr. Admin → Moderator</td>
                          <td className="text-right py-2 px-4">300 Points</td>
                        </tr>
                        <tr className="border-b border-zinc-800">
                          <td className="py-2 px-4">Moderator → Jr. Moderator</td>
                          <td className="text-right py-2 px-4">250 Points</td>
                        </tr>
                        <tr className="border-b border-zinc-800">
                          <td className="py-2 px-4">Jr. Moderator → Supporter</td>
                          <td className="text-right py-2 px-4">200 Points</td>
                        </tr>
                        <tr className="border-b border-zinc-800">
                          <td className="py-2 px-4">Supporter → Jr. Supporter</td>
                          <td className="text-right py-2 px-4">150 Points</td>
                        </tr>
                        <tr className="border-b border-zinc-800">
                          <td className="py-2 px-4">Jr. Supporter → Removed from Team</td>
                          <td className="text-right py-2 px-4">0 Points</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-2 text-red-400">
                    ⚠️ If a team member falls below 0 points, they will be directly removed from the team!
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">📌 Important Rules</h3>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Points are reset on the 1st of each month, but demotions remain in effect.</li>
                    <li>Admins and Co-Owners must log rule violations in Discord (e.g., when banning a player).</li>
                    <li>At 0 points or less, a team member will be removed.</li>
                    <li>Owner & Co-Owner can reset or award points if someone was treated unfairly.</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}


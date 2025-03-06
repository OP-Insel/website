"use client"

import { useState, useEffect } from "react"
import MainLayout from "./layout/main-layout"
import UserCard from "./user-card"
import AdminPanel from "./admin-panel"
import RankChart from "./rank-chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { PlusCircle, Settings, AlertTriangle } from "lucide-react"
import AddUserModal from "./add-user-modal"
import type { User } from "@/lib/types"
import { getUsers, saveUsers, getCurrentUser } from "@/lib/storage"
import { getUserPermissions } from "@/lib/permissions"
import { ranks } from "@/lib/data"
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function TeamDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(true) // For demo purposes, default to admin view
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [pendingDeductions, setPendingDeductions] = useState<number>(0)

  useEffect(() => {
    // Get users from storage
    const storedUsers = getUsers()
    setUsers(storedUsers)

    // Get current user
    const user = getCurrentUser()
    setCurrentUser(user)

    // Set admin view based on permissions
    if (user) {
      const permissions = getUserPermissions(user.rank)
      setIsAdmin(permissions.canManageUsers || permissions.canApproveDeduction)

      // For demo purposes, set pending deductions for owners and co-owners
      if (permissions.canApproveDeduction) {
        setPendingDeductions(3)
      }
    }
  }, [])

  const handleAddUser = (newUser: User) => {
    const updatedUsers = [...users, newUser]
    setUsers(updatedUsers)
    saveUsers(updatedUsers)
    setIsAddUserModalOpen(false)
    toast.success(`${newUser.name} added to the team`)
  }

  const handleUpdateUser = (updatedUser: User) => {
    const updatedUsers = users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    setUsers(updatedUsers)
    saveUsers(updatedUsers)
    setSelectedUser(null)
    toast.success(`${updatedUser.name}'s information updated`)
  }

  const handleDeleteUser = (userId: string) => {
    const userToDelete = users.find((user) => user.id === userId)
    const updatedUsers = users.filter((user) => user.id !== userId)
    setUsers(updatedUsers)
    saveUsers(updatedUsers)
    setSelectedUser(null)

    if (userToDelete) {
      toast.success(`${userToDelete.name} removed from the team`)
    }
  }

  const handlePointDeduction = (userId: string, points: number, reason: string) => {
    if (!currentUser) return

    const permissions = getUserPermissions(currentUser.rank)

    if (!permissions.canDeductPoints) {
      toast.error("You don't have permission to deduct points directly")
      return
    }

    setUsers(
      users.map((user) => {
        if (user.id === userId) {
          const newPoints = Math.max(0, user.points - points)

          // Check if user should be demoted
          let newRank = user.rank
          for (const rank of ranks) {
            if (rank.minPoints > newPoints && rank.name === user.rank) {
              // Find the next lower rank
              const rankIndex = ranks.findIndex((r) => r.name === user.rank)
              if (rankIndex > 0) {
                newRank = ranks[rankIndex - 1].name
              }
              break
            }
          }

          const updatedUser = {
            ...user,
            points: newPoints,
            rank: newRank,
            history: [
              { date: new Date().toISOString(), action: `Point deduction: -${points}`, reason },
              ...user.history,
            ],
          }

          return updatedUser
        }
        return user
      }),
    )

    // Save updated users to storage
    saveUsers(users)
    toast.success(`Deducted ${points} points from ${users.find((u) => u.id === userId)?.name}`)
  }

  // Get permissions for the current user
  const userPermissions = currentUser ? getUserPermissions(currentUser.rank) : null
  const canAddUsers = userPermissions?.canManageUsers || false
  const canManageUsers = userPermissions?.canManageUsers || false

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <header className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4 animate-slide-down">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Team Management</h1>
          <div className="flex gap-2">
            {canAddUsers && (
              <Button
                onClick={() => setIsAddUserModalOpen(true)}
                className="bg-black hover:bg-gray-800 text-white dark:bg-white dark:hover:bg-gray-200 dark:text-black transition-colors"
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Add Team Member
              </Button>
            )}
            {canManageUsers && (
              <Button
                variant="outline"
                onClick={() => setIsAdmin(!isAdmin)}
                className="border-gray-300 dark:border-gray-700 transition-colors"
              >
                <Settings className="mr-2 h-4 w-4" />
                {isAdmin ? "User View" : "Admin View"}
              </Button>
            )}
          </div>
        </header>

        {pendingDeductions > 0 && userPermissions?.canApproveDeduction && (
          <Alert className="mb-6 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/50 animate-fade-in">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
            <AlertTitle>Pending Requests</AlertTitle>
            <AlertDescription>
              You have {pendingDeductions} point deduction requests waiting for your approval.
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="team" className="w-full animate-fade-in">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-900 transition-colors">
            <TabsTrigger value="team" className="transition-colors">
              Team Members
            </TabsTrigger>
            <TabsTrigger value="ranks" className="transition-colors">
              Rank System
            </TabsTrigger>
            <TabsTrigger value="rules" className="transition-colors">
              Rules & Points
            </TabsTrigger>
          </TabsList>

          <TabsContent value="team" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {users.map((user, index) => (
                <div key={user.id} style={{ animationDelay: `${index * 50}ms` }}>
                  <UserCard user={user} onClick={() => setSelectedUser(user)} onPointDeduction={handlePointDeduction} />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="ranks">
            <RankChart />
          </TabsContent>

          <TabsContent value="rules">
            <div className="bg-white dark:bg-black p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-800 transition-colors animate-fade-in">
              <h2 className="text-2xl font-bold mb-4">⚠ Punktabzüge für Regelverstöße</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-300 dark:border-gray-700 transition-colors">
                      <th className="py-2 px-4">Verstoß</th>
                      <th className="py-2 px-4">Punktabzug</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-300 dark:border-gray-700 transition-colors">
                      <td className="py-2 px-4">Ban ohne Begründung</td>
                      <td className="py-2 px-4 text-red-500 dark:text-red-400">-5 Punkte</td>
                    </tr>
                    <tr className="border-b border-gray-300 dark:border-gray-700 transition-colors">
                      <td className="py-2 px-4">Unfaire oder ungerechtfertigte Strafe gegen Spieler</td>
                      <td className="py-2 px-4 text-red-500 dark:text-red-400">-10 Punkte</td>
                    </tr>
                    <tr className="border-b border-gray-300 dark:border-gray-700 transition-colors">
                      <td className="py-2 px-4">Missbrauch der Admin-Rechte (z. B. sich OP geben, ohne Erlaubnis)</td>
                      <td className="py-2 px-4 text-red-500 dark:text-red-400">-20 Punkte</td>
                    </tr>
                    <tr className="border-b border-gray-300 dark:border-gray-700 transition-colors">
                      <td className="py-2 px-4">Beleidigung oder schlechtes Verhalten gegenüber Spielern</td>
                      <td className="py-2 px-4 text-red-500 dark:text-red-400">-15 Punkte</td>
                    </tr>
                    <tr className="border-b border-gray-300 dark:border-gray-700 transition-colors">
                      <td className="py-2 px-4">Inaktiv ohne Abmeldung (z. B. 2 Wochen)</td>
                      <td className="py-2 px-4 text-red-500 dark:text-red-400">-10 Punkte</td>
                    </tr>
                    <tr className="border-b border-gray-300 dark:border-gray-700 transition-colors">
                      <td className="py-2 px-4">Wiederholtes Fehlverhalten trotz Ermahnung</td>
                      <td className="py-2 px-4 text-red-500 dark:text-red-400">-30 Punkte</td>
                    </tr>
                    <tr className="border-b border-gray-300 dark:border-gray-700 transition-colors">
                      <td className="py-2 px-4">Spamming von Befehlen oder Nachrichten</td>
                      <td className="py-2 px-4 text-red-500 dark:text-red-400">-5 Punkte</td>
                    </tr>
                    <tr className="border-b border-gray-300 dark:border-gray-700 transition-colors">
                      <td className="py-2 px-4">
                        Schwere Regelverstöße (z. B. Server- oder Spieler-Daten manipulieren)
                      </td>
                      <td className="py-2 px-4 text-red-500 dark:text-red-400">-20 Punkte</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2 className="text-2xl font-bold mt-8 mb-4">📉 Degradierungssystem</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-300 dark:border-gray-700 transition-colors">
                      <th className="py-2 px-4">Rang</th>
                      <th className="py-2 px-4">Punkte für automatische Degradierung</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-300 dark:border-gray-700 transition-colors">
                      <td className="py-2 px-4">Co-Owner → Admin</td>
                      <td className="py-2 px-4">500 Punkte</td>
                    </tr>
                    <tr className="border-b border-gray-300 dark:border-gray-700 transition-colors">
                      <td className="py-2 px-4">Admin → Jr. Admin</td>
                      <td className="py-2 px-4">400 Punkte</td>
                    </tr>
                    <tr className="border-b border-gray-300 dark:border-gray-700 transition-colors">
                      <td className="py-2 px-4">Jr. Admin → Moderator</td>
                      <td className="py-2 px-4">300 Punkte</td>
                    </tr>
                    <tr className="border-b border-gray-300 dark:border-gray-700 transition-colors">
                      <td className="py-2 px-4">Moderator → Jr. Moderator</td>
                      <td className="py-2 px-4">250 Punkte</td>
                    </tr>
                    <tr className="border-b border-gray-300 dark:border-gray-700 transition-colors">
                      <td className="py-2 px-4">Jr. Moderator → Supporter</td>
                      <td className="py-2 px-4">200 Punkte</td>
                    </tr>
                    <tr className="border-b border-gray-300 dark:border-gray-700 transition-colors">
                      <td className="py-2 px-4">Supporter → Jr. Supporter</td>
                      <td className="py-2 px-4">150 Punkte</td>
                    </tr>
                    <tr className="border-b border-gray-300 dark:border-gray-700 transition-colors">
                      <td className="py-2 px-4">Jr. Supporter → Entfernt aus dem Team</td>
                      <td className="py-2 px-4">0 Punkte</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-8 p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800/50 transition-colors">
                <p className="font-bold">
                  ⚠️ Wenn ein Teammitglied unter 0 Punkte fällt, wird es direkt aus dem Team entfernt!
                </p>
              </div>

              <h2 className="text-2xl font-bold mt-8 mb-4">📌 Wichtige Regeln</h2>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Punkte werden am 1. jedes Monats zurückgesetzt, aber runter Stufungen bleiben bestehend</li>
                <li>
                  Admins und Co-Owner müssen Regelverstöße im Discord protokollieren (z. B. wenn sie einen Spieler
                  bannen).
                </li>
                <li>Bei 0 Punkten oder weniger wird ein Teammitglied entfernt.</li>
                <li>Owner & Co-Owner können Punkte zurücksetzen oder vergeben, falls jemand unfair behandelt wurde.</li>
              </ol>
            </div>
          </TabsContent>
        </Tabs>

        {selectedUser && isAdmin && (
          <AdminPanel
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
            onUpdate={handleUpdateUser}
            onDelete={handleDeleteUser}
          />
        )}

        {isAddUserModalOpen && (
          <AddUserModal onClose={() => setIsAddUserModalOpen(false)} onAdd={handleAddUser} ranks={ranks} />
        )}
      </div>
    </MainLayout>
  )
}


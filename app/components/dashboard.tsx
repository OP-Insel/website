"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserList } from "./user-list"
import { UserForm } from "./user-form"
import { AdminPanel } from "./admin-panel"
import { Calendar } from "./calendar"
import { StoryPanel } from "./story-panel"
import { TasksPanel } from "./tasks-panel"
import { OverviewPanel } from "./overview-panel"
import { Header } from "./header"
import { rankConfig } from "../data/rank-config"
import { useLanguage } from "../hooks/use-language"
import { translations } from "../data/translations"

export function Dashboard({
  users,
  setUsers,
  stories,
  setStories,
  tasks,
  setTasks,
  messages,
  setMessages,
  currentUser,
  onLogout,
  onAddMessage,
}) {
  const [selectedUser, setSelectedUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isOperator, setIsOperator] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const { language } = useLanguage()
  const t = translations[language]

  // Check if current user is admin or operator
  useEffect(() => {
    if (currentUser) {
      setIsAdmin(["Owner", "Co-Owner", "Admin"].includes(currentUser.rank))
      setIsOperator(["Owner", "Co-Owner"].includes(currentUser.rank))
    }
  }, [currentUser])

  const handleUserSelect = (user) => {
    setSelectedUser(user)
  }

  const handleUserUpdate = (updatedUser) => {
    // Only allow users to update themselves unless they're operators
    if (updatedUser.id === currentUser.id || isOperator) {
      setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)))
    }
  }

  const handlePointDeductionRequest = (userId, points, reason) => {
    // For non-operators, create a deduction request
    const user = users.find((u) => u.id === userId)

    setTasks((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        type: "point_deduction",
        title: `${t.pointDeductionRequest}: ${user.username}`,
        description: `${t.requestToDeduct} ${points} ${t.pointsFrom} ${user.username} ${t.for}: ${reason}`,
        status: "pending",
        assignedTo: "operators", // Assigned to operators
        createdAt: new Date().toISOString(),
        createdBy: currentUser?.id || "system",
        metadata: {
          userId,
          points,
          reason,
        },
      },
    ])
  }

  const handlePointDeduction = (userId, points, reason) => {
    if (!isOperator) {
      handlePointDeductionRequest(userId, points, reason)
      return
    }

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
                action: `${t.deducted} ${points} ${t.points}: ${reason}`,
                pointsChange: -points,
                performedBy: currentUser?.username || "System",
              },
            ],
          }
        }
        return user
      }),
    )
  }

  const handleAddUser = (newUser) => {
    if (!isOperator) return

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
            action: t.userAddedToTeam,
            pointsChange: 0,
            performedBy: currentUser?.username || "System",
          },
        ],
      },
    ])
  }

  const handleAddStory = (newStory) => {
    if (!isAdmin) return

    setStories([
      ...stories,
      {
        ...newStory,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        createdBy: currentUser?.id || "system",
      },
    ])
  }

  const handleUpdateStory = (updatedStory) => {
    if (!isAdmin) return

    setStories(stories.map((story) => (story.id === updatedStory.id ? updatedStory : story)))
  }

  const handleAddTask = (newTask) => {
    if (!isAdmin) return

    setTasks([
      ...tasks,
      {
        ...newTask,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        createdBy: currentUser?.id || "system",
        status: "pending",
      },
    ])
  }

  const handleUpdateTask = (updatedTask) => {
    setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
  }

  const handleApproveDeduction = (taskId) => {
    if (!isOperator) return

    const task = tasks.find((t) => t.id === taskId && t.type === "point_deduction")
    if (task) {
      // Apply the deduction
      handlePointDeduction(task.metadata.userId, task.metadata.points, task.metadata.reason)

      // Update task status
      handleUpdateTask({
        ...task,
        status: "completed",
        completedAt: new Date().toISOString(),
        completedBy: currentUser?.id || "system",
      })
    }
  }

  const handleRejectDeduction = (taskId) => {
    if (!isOperator) return

    const task = tasks.find((t) => t.id === taskId)
    if (task) {
      handleUpdateTask({
        ...task,
        status: "rejected",
        completedAt: new Date().toISOString(),
        completedBy: currentUser?.id || "system",
      })
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Header serverName="OP-Insel" serverIp="OPInsel.de" currentUser={currentUser} onLogout={onLogout} />

      <main className="container mx-auto py-6 px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-7 gap-4">
            <TabsTrigger value="overview">{t.dashboard}</TabsTrigger>
            <TabsTrigger value="users">{t.teamMembers}</TabsTrigger>
            <TabsTrigger value="admin" disabled={!isOperator}>
              {t.adminPanel}
            </TabsTrigger>
            <TabsTrigger value="calendar">{t.calendar}</TabsTrigger>
            <TabsTrigger value="story">{t.story}</TabsTrigger>
            <TabsTrigger value="tasks">{t.tasks}</TabsTrigger>
            <TabsTrigger value="rules">{t.rulesAndPoints}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewPanel
              users={users}
              tasks={tasks}
              stories={stories}
              messages={messages}
              currentUser={currentUser}
              isAdmin={isAdmin}
              isOperator={isOperator}
              onApproveDeduction={handleApproveDeduction}
              onRejectDeduction={handleRejectDeduction}
              onAddMessage={onAddMessage}
            />
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-1 bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle>{t.teamMembers}</CardTitle>
                  <CardDescription className="text-zinc-400">{t.selectUserToViewDetails}</CardDescription>
                </CardHeader>
                <CardContent>
                  <UserList users={users} onUserSelect={handleUserSelect} />
                </CardContent>
              </Card>

              <Card className="md:col-span-2 bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle>{t.userDetails}</CardTitle>
                  <CardDescription className="text-zinc-400">
                    {selectedUser ? `${t.viewing} ${selectedUser.username}` : t.selectUserToViewDetails}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedUser ? (
                    <UserForm
                      user={selectedUser}
                      currentUser={currentUser}
                      onUpdate={handleUserUpdate}
                      isAdmin={isAdmin}
                      isOperator={isOperator}
                      onPointDeduction={handlePointDeduction}
                    />
                  ) : (
                    <div className="text-center py-8 text-zinc-500">{t.selectUserFromList}</div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="admin">
            <AdminPanel
              users={users}
              onAddUser={handleAddUser}
              onUpdateUser={handleUserUpdate}
              isOperator={isOperator}
            />
          </TabsContent>

          <TabsContent value="calendar">
            <Calendar users={users} isAdmin={isAdmin} />
          </TabsContent>

          <TabsContent value="story">
            <StoryPanel
              stories={stories}
              isAdmin={isAdmin}
              isOperator={isOperator}
              onAddStory={handleAddStory}
              onUpdateStory={handleUpdateStory}
            />
          </TabsContent>

          <TabsContent value="tasks">
            <TasksPanel
              tasks={tasks}
              users={users}
              isAdmin={isAdmin}
              isOperator={isOperator}
              currentUser={currentUser}
              onAddTask={handleAddTask}
              onUpdateTask={handleUpdateTask}
              onApproveDeduction={handleApproveDeduction}
              onRejectDeduction={handleRejectDeduction}
            />
          </TabsContent>

          <TabsContent value="rules">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle>{t.rulesAndPointSystem}</CardTitle>
                <CardDescription className="text-zinc-400">{t.teamRulesAndPointDeductionSystem}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">⚠ {t.pointDeductionsForRuleViolations}</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-zinc-800">
                          <th className="text-left py-2 px-4">{t.violation}</th>
                          <th className="text-right py-2 px-4">{t.pointDeduction}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-zinc-800">
                          <td className="py-2 px-4">{t.banWithoutReason}</td>
                          <td className="text-right py-2 px-4">-5 {t.points}</td>
                        </tr>
                        <tr className="border-b border-zinc-800">
                          <td className="py-2 px-4">{t.unfairPunishment}</td>
                          <td className="text-right py-2 px-4">-10 {t.points}</td>
                        </tr>
                        <tr className="border-b border-zinc-800">
                          <td className="py-2 px-4">{t.abuseOfAdminRights}</td>
                          <td className="text-right py-2 px-4">-20 {t.points}</td>
                        </tr>
                        <tr className="border-b border-zinc-800">
                          <td className="py-2 px-4">{t.insultingBehavior}</td>
                          <td className="text-right py-2 px-4">-15 {t.points}</td>
                        </tr>
                        <tr className="border-b border-zinc-800">
                          <td className="py-2 px-4">{t.inactiveWithoutNotice}</td>
                          <td className="text-right py-2 px-4">-10 {t.points}</td>
                        </tr>
                        <tr className="border-b border-zinc-800">
                          <td className="py-2 px-4">{t.repeatedMisconduct}</td>
                          <td className="text-right py-2 px-4">-30 {t.points}</td>
                        </tr>
                        <tr className="border-b border-zinc-800">
                          <td className="py-2 px-4">{t.spamming}</td>
                          <td className="text-right py-2 px-4">-5 {t.points}</td>
                        </tr>
                        <tr className="border-b border-zinc-800">
                          <td className="py-2 px-4">{t.seriousRuleViolations}</td>
                          <td className="text-right py-2 px-4">-20 {t.points}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">📉 {t.demotionSystem}</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-zinc-800">
                          <th className="text-left py-2 px-4">{t.rank}</th>
                          <th className="text-right py-2 px-4">{t.pointsForAutomaticDemotion}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-zinc-800">
                          <td className="py-2 px-4">Co-Owner → Admin</td>
                          <td className="text-right py-2 px-4">500 {t.points}</td>
                        </tr>
                        <tr className="border-b border-zinc-800">
                          <td className="py-2 px-4">Admin → Jr. Admin</td>
                          <td className="text-right py-2 px-4">400 {t.points}</td>
                        </tr>
                        <tr className="border-b border-zinc-800">
                          <td className="py-2 px-4">Jr. Admin → Moderator</td>
                          <td className="text-right py-2 px-4">300 {t.points}</td>
                        </tr>
                        <tr className="border-b border-zinc-800">
                          <td className="py-2 px-4">Moderator → Jr. Moderator</td>
                          <td className="text-right py-2 px-4">250 {t.points}</td>
                        </tr>
                        <tr className="border-b border-zinc-800">
                          <td className="py-2 px-4">Jr. Moderator → Supporter</td>
                          <td className="text-right py-2 px-4">200 {t.points}</td>
                        </tr>
                        <tr className="border-b border-zinc-800">
                          <td className="py-2 px-4">Supporter → Jr. Supporter</td>
                          <td className="text-right py-2 px-4">150 {t.points}</td>
                        </tr>
                        <tr className="border-b border-zinc-800">
                          <td className="py-2 px-4">Jr. Supporter → {t.removedFromTeam}</td>
                          <td className="text-right py-2 px-4">0 {t.points}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-2 text-red-400">⚠️ {t.belowZeroPointsWarning}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">📌 {t.importantRules}</h3>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>{t.pointsResetRule}</li>
                    <li>{t.logViolationsRule}</li>
                    <li>{t.zeroPointsRule}</li>
                    <li>{t.resetPointsRule}</li>
                    <li>{t.operatorRightsRule}</li>
                    <li>{t.suggestDeductionsRule}</li>
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


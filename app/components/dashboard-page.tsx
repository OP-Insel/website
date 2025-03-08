"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserList } from "./user/user-list"
import { UserForm } from "./user/user-form"
import { AdminPanel } from "./admin/admin-panel"
import { Calendar } from "./calendar/calendar"
import { Dashboard } from "./dashboard/dashboard"
import { StoryPanel } from "./story/story-panel"
import { TasksPanel } from "./tasks/tasks-panel"
import { Header } from "./layout/header"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "../hooks/use-auth"
import { db } from "../lib/database"
import { useTranslation } from "../hooks/use-translation"

export function DashboardPage() {
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  const [users, setUsers] = useState([])
  const [stories, setStories] = useState([])
  const [tasks, setTasks] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isOperator, setIsOperator] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  const { toast } = useToast()

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedUsers = await db.users.getAll()
        const fetchedStories = await db.stories.getAll()
        const fetchedTasks = await db.tasks.getAll()

        setUsers(fetchedUsers)
        setStories(fetchedStories)
        setTasks(fetchedTasks)

        // Set current user
        const userData = fetchedUsers.find((u) => u.id === user.id)
        if (userData) {
          setCurrentUser(userData)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: t("error.fetch_title"),
          description: t("error.fetch_description"),
          variant: "destructive",
        })
      }
    }

    fetchData()
  }, [user, toast, t])

  // Check if current user is admin or operator
  useEffect(() => {
    if (currentUser) {
      setIsAdmin(["Owner", "Co-Owner", "Admin"].includes(currentUser.rank))
      setIsOperator(["Owner", "Co-Owner"].includes(currentUser.rank))
    }
  }, [currentUser])

  const handleUserSelect = (user) => {
    setCurrentUser(user)
  }

  const handleUserUpdate = async (updatedUser) => {
    try {
      // Check permissions - users can only edit themselves unless they're operators
      if (updatedUser.id !== user.id && !isOperator) {
        toast({
          title: t("error.unauthorized_title"),
          description: t("error.unauthorized_edit_description"),
          variant: "destructive",
        })
        return
      }

      // If not an operator, only allow editing username
      if (!isOperator && updatedUser.id === user.id) {
        const originalUser = users.find((u) => u.id === user.id)
        if (originalUser) {
          // Only allow changing username, not rank, points, etc.
          updatedUser = {
            ...originalUser,
            username: updatedUser.username,
            notes: updatedUser.notes,
          }
        }
      }

      await db.users.update(updatedUser.id, updatedUser)

      // Update local state
      setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)))

      // If the updated user is the current user, update current user state
      if (updatedUser.id === currentUser.id) {
        setCurrentUser(updatedUser)
      }

      toast({
        title: t("user.update_success_title"),
        description: t("user.update_success_description", { username: updatedUser.username }),
      })
    } catch (error) {
      console.error("Error updating user:", error)
      toast({
        title: t("error.update_title"),
        description: t("error.update_description"),
        variant: "destructive",
      })
    }
  }

  const handlePointDeductionRequest = async (userId, points, reason) => {
    try {
      const targetUser = users.find((u) => u.id === userId)

      const newTask = {
        id: Date.now().toString(),
        type: "point_deduction",
        title: t("task.deduction_request_title", { username: targetUser.username }),
        description: t("task.deduction_request_description", { points, username: targetUser.username, reason }),
        status: "pending",
        assignedTo: "operators",
        createdAt: new Date().toISOString(),
        createdBy: currentUser.id,
        metadata: {
          userId,
          points,
          reason,
        },
      }

      await db.tasks.add(newTask)

      // Update local state
      setTasks([...tasks, newTask])

      toast({
        title: t("deduction.request_submitted_title"),
        description: t("deduction.request_submitted_description"),
      })
    } catch (error) {
      console.error("Error creating deduction request:", error)
      toast({
        title: t("error.request_title"),
        description: t("error.request_description"),
        variant: "destructive",
      })
    }
  }

  const handlePointDeduction = async (userId, points, reason) => {
    if (!isOperator) {
      handlePointDeductionRequest(userId, points, reason)
      return
    }

    try {
      const targetUser = users.find((u) => u.id === userId)
      if (!targetUser) {
        throw new Error("User not found")
      }

      const newPoints = targetUser.points - points
      let newRank = targetUser.rank

      // Check for demotion
      if (newPoints <= 0) {
        newRank = "Removed"
      } else {
        // Get rank config for demotions
        const rankConfig = await db.rankConfig.getAll()

        for (const [currentRank, nextRank, threshold] of rankConfig) {
          if (targetUser.rank === currentRank && newPoints < threshold) {
            newRank = nextRank
            break
          }
        }
      }

      // Create history entry
      const historyEntry = {
        date: new Date().toISOString(),
        action: t("history.points_deducted", { points, reason }),
        pointsChange: -points,
        performedBy: currentUser?.username || "System",
      }

      // Update user
      const updatedUser = {
        ...targetUser,
        points: newPoints,
        rank: newRank,
        history: [...(targetUser.history || []), historyEntry],
      }

      await db.users.update(targetUser.id, updatedUser)

      // Update local state
      setUsers(users.map((user) => (user.id === targetUser.id ? updatedUser : user)))

      // If the updated user is the current user, update current user state
      if (targetUser.id === currentUser.id) {
        setCurrentUser(updatedUser)
      }

      toast({
        title: t("deduction.applied_title"),
        description: t("deduction.applied_description", { points }),
      })
    } catch (error) {
      console.error("Error applying deduction:", error)
      toast({
        title: t("error.deduction_title"),
        description: t("error.deduction_description"),
        variant: "destructive",
      })
    }
  }

  const handleAddUser = async (newUser) => {
    // Only operators can add users
    if (!isOperator) {
      toast({
        title: t("error.unauthorized_title"),
        description: t("error.unauthorized_add_description"),
        variant: "destructive",
      })
      return
    }

    try {
      const rankPoints = {
        Owner: 1000,
        "Co-Owner": 600,
        Admin: 500,
        "Jr. Admin": 400,
        Moderator: 300,
        "Jr. Moderator": 250,
        Supporter: 200,
        "Jr. Supporter": 150,
      }

      const userToAdd = {
        ...newUser,
        id: Date.now().toString(),
        points: rankPoints[newUser.rank] || 150,
        history: [
          {
            date: new Date().toISOString(),
            action: t("history.user_added"),
            pointsChange: 0,
            performedBy: currentUser?.username || "System",
          },
        ],
      }

      await db.users.add(userToAdd)

      // Update local state
      setUsers([...users, userToAdd])

      toast({
        title: t("user.add_success_title"),
        description: t("user.add_success_description", { username: newUser.username }),
      })
    } catch (error) {
      console.error("Error adding user:", error)
      toast({
        title: t("error.add_user_title"),
        description: t("error.add_user_description"),
        variant: "destructive",
      })
    }
  }

  const handleAddStory = async (newStory) => {
    if (!isAdmin) {
      toast({
        title: t("error.unauthorized_title"),
        description: t("error.unauthorized_story_description"),
        variant: "destructive",
      })
      return
    }

    try {
      const storyToAdd = {
        ...newStory,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        createdBy: currentUser.id,
      }

      await db.stories.add(storyToAdd)

      // Update local state
      setStories([...stories, storyToAdd])

      toast({
        title: t("story.add_success_title"),
        description: t("story.add_success_description", { title: newStory.title }),
      })
    } catch (error) {
      console.error("Error adding story:", error)
      toast({
        title: t("error.add_story_title"),
        description: t("error.add_story_description"),
        variant: "destructive",
      })
    }
  }

  const handleUpdateStory = async (updatedStory) => {
    if (!isAdmin) {
      toast({
        title: t("error.unauthorized_title"),
        description: t("error.unauthorized_story_description"),
        variant: "destructive",
      })
      return
    }

    try {
      await db.stories.update(updatedStory.id, updatedStory)

      // Update local state
      setStories(stories.map((story) => (story.id === updatedStory.id ? updatedStory : story)))

      toast({
        title: t("story.update_success_title"),
        description: t("story.update_success_description", { title: updatedStory.title }),
      })
    } catch (error) {
      console.error("Error updating story:", error)
      toast({
        title: t("error.update_story_title"),
        description: t("error.update_story_description"),
        variant: "destructive",
      })
    }
  }

  const handleAddTask = async (newTask) => {
    if (!isAdmin) {
      toast({
        title: t("error.unauthorized_title"),
        description: t("error.unauthorized_task_description"),
        variant: "destructive",
      })
      return
    }

    try {
      const taskToAdd = {
        ...newTask,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        createdBy: currentUser.id,
        status: "pending",
      }

      await db.tasks.add(taskToAdd)

      // Update local state
      setTasks([...tasks, taskToAdd])

      toast({
        title: t("task.add_success_title"),
        description: t("task.add_success_description", { title: newTask.title }),
      })
    } catch (error) {
      console.error("Error adding task:", error)
      toast({
        title: t("error.add_task_title"),
        description: t("error.add_task_description"),
        variant: "destructive",
      })
    }
  }

  const handleUpdateTask = async (updatedTask) => {
    try {
      await db.tasks.update(updatedTask.id, updatedTask)

      // Update local state
      setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)))

      toast({
        title: t("task.update_success_title"),
        description: t("task.update_success_description", { title: updatedTask.title }),
      })
    } catch (error) {
      console.error("Error updating task:", error)
      toast({
        title: t("error.update_task_title"),
        description: t("error.update_task_description"),
        variant: "destructive",
      })
    }
  }

  const handleApproveDeduction = async (taskId) => {
    if (!isOperator) {
      toast({
        title: t("error.unauthorized_title"),
        description: t("error.unauthorized_approve_description"),
        variant: "destructive",
      })
      return
    }

    try {
      const task = tasks.find((t) => t.id === taskId && t.type === "point_deduction")
      if (!task) {
        throw new Error("Task not found")
      }

      // Apply the deduction
      await handlePointDeduction(task.metadata.userId, task.metadata.points, task.metadata.reason)

      // Update task status
      const updatedTask = {
        ...task,
        status: "completed",
        completedAt: new Date().toISOString(),
        completedBy: currentUser.id,
      }

      await db.tasks.update(task.id, updatedTask)

      // Update local state
      setTasks(tasks.map((t) => (t.id === task.id ? updatedTask : t)))

      toast({
        title: t("deduction.approved_title"),
        description: t("deduction.approved_description"),
      })
    } catch (error) {
      console.error("Error approving deduction:", error)
      toast({
        title: t("error.approve_deduction_title"),
        description: t("error.approve_deduction_description"),
        variant: "destructive",
      })
    }
  }

  const handleRejectDeduction = async (taskId) => {
    if (!isOperator) {
      toast({
        title: t("error.unauthorized_title"),
        description: t("error.unauthorized_reject_description"),
        variant: "destructive",
      })
      return
    }

    try {
      const task = tasks.find((t) => t.id === taskId)
      if (!task) {
        throw new Error("Task not found")
      }

      const updatedTask = {
        ...task,
        status: "rejected",
        completedAt: new Date().toISOString(),
        completedBy: currentUser.id,
      }

      await db.tasks.update(task.id, updatedTask)

      // Update local state
      setTasks(tasks.map((t) => (t.id === task.id ? updatedTask : t)))

      toast({
        title: t("deduction.rejected_title"),
        description: t("deduction.rejected_description"),
      })
    } catch (error) {
      console.error("Error rejecting deduction:", error)
      toast({
        title: t("error.reject_deduction_title"),
        description: t("error.reject_deduction_description"),
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header serverName="OP-Insel" serverIp="OPInsel.de" currentUser={currentUser} onLogout={logout} />

      <main className="container mx-auto py-6 px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-7 gap-4">
            <TabsTrigger value="dashboard">{t("nav.dashboard")}</TabsTrigger>
            <TabsTrigger value="users">{t("nav.team_members")}</TabsTrigger>
            <TabsTrigger value="admin" disabled={!isOperator}>
              {t("nav.admin_panel")}
            </TabsTrigger>
            <TabsTrigger value="calendar">{t("nav.calendar")}</TabsTrigger>
            <TabsTrigger value="story">{t("nav.story")}</TabsTrigger>
            <TabsTrigger value="tasks">{t("nav.tasks")}</TabsTrigger>
            <TabsTrigger value="rules">{t("nav.rules")}</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard
              users={users}
              tasks={tasks}
              stories={stories}
              isAdmin={isAdmin}
              isOperator={isOperator}
              onApproveDeduction={handleApproveDeduction}
              onRejectDeduction={handleRejectDeduction}
            />
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-1 bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle>{t("user.team_members")}</CardTitle>
                  <CardDescription className="text-zinc-400">{t("user.select_description")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <UserList users={users} onUserSelect={handleUserSelect} />
                </CardContent>
              </Card>

              <Card className="md:col-span-2 bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle>{t("user.details")}</CardTitle>
                  <CardDescription className="text-zinc-400">
                    {currentUser ? t("user.viewing_user", { username: currentUser.username }) : t("user.select_user")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {currentUser ? (
                    <UserForm
                      user={currentUser}
                      currentUserId={user.id}
                      onUpdate={handleUserUpdate}
                      isAdmin={isAdmin}
                      isOperator={isOperator}
                      onPointDeduction={handlePointDeduction}
                    />
                  ) : (
                    <div className="text-center py-8 text-zinc-500">{t("user.select_prompt")}</div>
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
                <CardTitle>{t("rules.title")}</CardTitle>
                <CardDescription className="text-zinc-400">{t("rules.description")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">⚠ {t("rules.point_deductions_title")}</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-zinc-800">
                          <th className="text-left py-2 px-4">{t("rules.violation")}</th>
                          <th className="text-right py-2 px-4">{t("rules.point_deduction")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-zinc-800">
                          <td className="py-2 px-4">{t("rules.ban_without_reason")}</td>
                          <td className="text-right py-2 px-4">-5 {t("rules.points")}</td>
                        </tr>
                        <tr className="border-b border-zinc-800">
                          <td className="py-2 px-4">{t("rules.unfair_punishment")}</td>
                          <td className="text-right py-2 px-4">-10 {t("rules.points")}</td>
                        </tr>
                        <tr className="border-b border-zinc-800">
                          <td className="py-2 px-4">{t("rules.abuse_admin_rights")}</td>
                          <td className="text-right py-2 px-4">-20 {t("rules.points")}</td>
                        </tr>
                        <tr className="border-b border-zinc-800">
                          <td className="py-2 px-4">{t("rules.insulting_behavior")}</td>
                          <td className="text-right py-2 px-4">-15 {t("rules.points")}</td>
                        </tr>
                        <tr className="border-b border-zinc-800">
                          <td className="py-2 px-4">{t("rules.inactive_without_notice")}</td>
                          <td className="text-right py-2 px-4">-10 {t("rules.points")}</td>
                        </tr>
                        <tr className="border-b border-zinc-800">
                          <td className="py-2 px-4">{t("rules.repeated_misconduct")}</td>
                          <td className="text-right py-2 px-4">-30 {t("rules.points")}</td>
                        </tr>
                        <tr className="border-b border-zinc-800">
                          <td className="py-2 px-4">{t("rules.spamming")}</td>
                          <td className="text-right py-2 px-4">-5 {t("rules.points")}</td>
                        </tr>
                        <tr className="border-b border-zinc-800">
                          <td className="py-2 px-4">{t("rules.serious_violations")}</td>
                          <td className="text-right py-2 px-4">-20 {t("rules.points")}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">📉 {t("rules.demotion_system")}</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-zinc-800">
                          <th className="text-left py-2 px-4">{t("rules.rank")}</th>
                          <th className="text-right py-2 px-4">{t("rules.points_for_demotion")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-zinc-800">
                          <td className="py-2 px-4">{t("rules.co_owner_to_admin")}</td>
                          <td className="text-right py-2 px-4">500 {t("rules.points")}</td>
                        </tr>
                        <tr className="border-b border-zinc-800">
                          <td className="py-2 px-4">{t("rules.admin_to_jr_admin")}</td>
                          <td className="text-right py-2 px-4">400 {t("rules.points")}</td>
                        </tr>
                        <tr className="border-b border-zinc-800">
                          <td className="py-2 px-4">{t("rules.jr_admin_to_moderator")}</td>
                          <td className="text-right py-2 px-4">300 {t("rules.points")}</td>
                        </tr>
                        <tr className="border-b border-zinc-800">
                          <td className="py-2 px-4">{t("rules.moderator_to_jr_moderator")}</td>
                          <td className="text-right py-2 px-4">250 {t("rules.points")}</td>
                        </tr>
                        <tr className="border-b border-zinc-800">
                          <td className="py-2 px-4">{t("rules.jr_moderator_to_supporter")}</td>
                          <td className="text-right py-2 px-4">200 {t("rules.points")}</td>
                        </tr>
                        <tr className="border-b border-zinc-800">
                          <td className="py-2 px-4">{t("rules.supporter_to_jr_supporter")}</td>
                          <td className="text-right py-2 px-4">150 {t("rules.points")}</td>
                        </tr>
                        <tr className="border-b border-zinc-800">
                          <td className="py-2 px-4">{t("rules.jr_supporter_to_removed")}</td>
                          <td className="text-right py-2 px-4">0 {t("rules.points")}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-2 text-red-400">⚠️ {t("rules.zero_points_warning")}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">📌 {t("rules.important_rules")}</h3>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>{t("rules.monthly_reset")}</li>
                    <li>{t("rules.document_violations")}</li>
                    <li>{t("rules.removal_at_zero")}</li>
                    <li>{t("rules.operator_reset_points")}</li>
                    <li>{t("rules.operator_rights")}</li>
                    <li>{t("rules.suggestion_only")}</li>
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


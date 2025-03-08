"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { useLanguage } from "../hooks/use-language"
import { translations } from "../data/translations"
import {
  AlertTriangle,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  MessageSquare,
  ThumbsDown,
  ThumbsUp,
  Users,
} from "lucide-react"

export function OverviewPanel({
  users,
  tasks,
  stories,
  messages,
  currentUser,
  isAdmin,
  isOperator,
  onApproveDeduction,
  onRejectDeduction,
  onAddMessage,
}) {
  const [activeTab, setActiveTab] = useState("overview")
  const [newMessage, setNewMessage] = useState("")
  const { language } = useLanguage()
  const t = translations[language]

  // Calculate statistics
  const activeUsers = users.filter((user) => user.rank !== "Removed").length
  const removedUsers = users.filter((user) => user.rank === "Removed").length
  const pendingTasks = tasks.filter((task) => task.status === "pending").length
  const completedTasks = tasks.filter((task) => task.status === "completed").length
  const pendingDeductions = tasks.filter((task) => task.type === "point_deduction" && task.status === "pending").length

  // Get recent activities
  const recentActivities = [
    ...users.flatMap((user) =>
      (user.history || []).map((history) => ({
        type: "user_history",
        date: new Date(history.date),
        user,
        history,
      })),
    ),
    ...tasks.map((task) => ({
      type: "task",
      date: new Date(task.createdAt),
      task,
    })),
  ]
    .sort((a, b) => b.date - a.date)
    .slice(0, 10)

  // Get pending deduction requests
  const deductionRequests = tasks
    .filter((task) => task.type === "point_deduction" && task.status === "pending")
    .map((task) => {
      const user = users.find((u) => u.id === task.metadata.userId)
      return { task, user }
    })

  const formatDate = (date) => {
    return new Intl.DateTimeFormat(language === "de" ? "de-DE" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getRankDistribution = () => {
    const distribution = {}
    users
      .filter((user) => user.rank !== "Removed")
      .forEach((user) => {
        distribution[user.rank] = (distribution[user.rank] || 0) + 1
      })
    return distribution
  }

  const rankDistribution = getRankDistribution()

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (newMessage.trim()) {
      onAddMessage(newMessage)
      setNewMessage("")
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Users className="mr-2 h-5 w-5 text-primary" />
              {t.teamMembers}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeUsers}</div>
            <p className="text-xs text-zinc-400 mt-1">{t.activeTeamMembers}</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <FileText className="mr-2 h-5 w-5 text-primary" />
              {t.tasks}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingTasks}</div>
            <p className="text-xs text-zinc-400 mt-1">{t.pendingTasks}</p>
            <div className="mt-2">
              <Progress value={(completedTasks / (pendingTasks + completedTasks || 1)) * 100} className="h-2" />
              <p className="text-xs text-zinc-400 mt-1">
                {completedTasks} {t.completed} / {pendingTasks + completedTasks} {t.total}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <BookOpen className="mr-2 h-5 w-5 text-primary" />
              {t.stories}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stories.length}</div>
            <p className="text-xs text-zinc-400 mt-1">{t.storyChapters}</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-primary" />
              {t.deductionRequests}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingDeductions}</div>
            <p className="text-xs text-zinc-400 mt-1">{t.pendingApproval}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-zinc-900 border-zinc-800 lg:col-span-2">
          <CardHeader>
            <CardTitle>{t.dashboard}</CardTitle>
            <CardDescription className="text-zinc-400">{t.overviewOfOpInsel}</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 w-full rounded-none border-b border-zinc-800">
                <TabsTrigger value="overview" className="rounded-none">
                  {t.overview}
                </TabsTrigger>
                <TabsTrigger value="activity" className="rounded-none">
                  {t.recentActivity}
                </TabsTrigger>
                <TabsTrigger value="stats" className="rounded-none">
                  {t.statistics}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="p-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{t.serverStatus}</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span>{t.serverName}:</span>
                          <span className="font-medium">OP-Insel</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>{t.status}:</span>
                          <Badge className="bg-green-600">{t.online}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>{t.playersOnline}:</span>
                          <span className="font-medium">12/50</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>{t.currentStoryChapter}:</span>
                          <span className="font-medium">{t.theLostKingdom}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">{t.teamOverview}</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span>{t.activeMembers}:</span>
                          <span className="font-medium">{activeUsers}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>{t.operators}:</span>
                          <span className="font-medium">
                            {users.filter((u) => ["Owner", "Co-Owner"].includes(u.rank)).length}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>{t.admins}:</span>
                          <span className="font-medium">
                            {users.filter((u) => ["Admin", "Jr. Admin"].includes(u.rank)).length}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>{t.moderators}:</span>
                          <span className="font-medium">
                            {users.filter((u) => ["Moderator", "Jr. Moderator"].includes(u.rank)).length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {pendingDeductions > 0 && isOperator && (
                    <Alert className="bg-amber-900/20 border-amber-800">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>{t.pendingDeductionRequests}</AlertTitle>
                      <AlertDescription>
                        {t.thereAre} {pendingDeductions} {t.pointDeductionRequestsWaiting}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div>
                    <h3 className="text-lg font-semibold mb-2">{t.upcomingEvents}</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800">
                        <Calendar className="h-5 w-5 text-zinc-400" />
                        <div className="flex-1">
                          <p className="font-medium">{t.serverMaintenance}</p>
                          <div className="flex items-center text-sm text-zinc-400">
                            <Clock className="mr-1 h-3 w-3" />
                            {t.tomorrow} • 18:00-20:00
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800">
                        <Calendar className="h-5 w-5 text-zinc-400" />
                        <div className="flex-1">
                          <p className="font-medium">{t.teamMeeting}</p>
                          <div className="flex items-center text-sm text-zinc-400">
                            <Clock className="mr-1 h-3 w-3" />
                            {t.friday} • 19:00-20:00
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800">
                        <Calendar className="h-5 w-5 text-zinc-400" />
                        <div className="flex-1">
                          <p className="font-medium">{t.storyChapterRelease}</p>
                          <div className="flex items-center text-sm text-zinc-400">
                            <Clock className="mr-1 h-3 w-3" />
                            {t.saturday} • 15:00
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="activity" className="p-4">
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex gap-3 pb-3 border-b border-zinc-800">
                      {activity.type === "user_history" ? (
                        <>
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={`https://mc-heads.net/avatar/${activity.user.minecraftUsername}`} />
                            <AvatarFallback>{activity.user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{activity.user.username}</span>
                              <span className="text-xs text-zinc-400">{formatDate(activity.date)}</span>
                              {activity.history.pointsChange !== 0 && (
                                <Badge className={activity.history.pointsChange > 0 ? "bg-green-600" : "bg-red-600"}>
                                  {activity.history.pointsChange > 0 ? "+" : ""}
                                  {activity.history.pointsChange} {t.points}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-zinc-300 mt-1">{activity.history.action}</p>
                            {activity.history.performedBy && (
                              <p className="text-xs text-zinc-400 mt-1">
                                {t.by}: {activity.history.performedBy}
                              </p>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-800">
                            <FileText className="h-4 w-4 text-zinc-400" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{activity.task.title}</span>
                              <span className="text-xs text-zinc-400">{formatDate(activity.date)}</span>
                              <Badge
                                className={
                                  activity.task.status === "pending"
                                    ? "bg-yellow-600"
                                    : activity.task.status === "completed"
                                      ? "bg-green-600"
                                      : "bg-red-600"
                                }
                              >
                                {activity.task.status === "pending"
                                  ? t.pending
                                  : activity.task.status === "completed"
                                    ? t.completed
                                    : t.rejected}
                              </Badge>
                            </div>
                            <p className="text-sm text-zinc-300 mt-1">{activity.task.description}</p>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="stats" className="p-4">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">{t.teamRankDistribution}</h3>
                    <div className="space-y-3">
                      {Object.entries(rankDistribution).map(([rank, count]) => (
                        <div key={rank} className="space-y-1">
                          <div className="flex justify-between">
                            <span>{rank}</span>
                            <span>
                              {count} {t.members}
                            </span>
                          </div>
                          <Progress value={(count / activeUsers) * 100} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">{t.taskCompletionRate}</h3>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>{t.completed}</span>
                        <span>
                          {completedTasks} {t.tasks}
                        </span>
                      </div>
                      <Progress value={(completedTasks / (pendingTasks + completedTasks || 1)) * 100} className="h-2" />
                      <p className="text-xs text-zinc-400 mt-1">
                        {((completedTasks / (pendingTasks + completedTasks || 1)) * 100).toFixed(0)}% {t.completionRate}
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle>{t.pendingApprovals}</CardTitle>
            <CardDescription className="text-zinc-400">{t.pointDeductionRequestsAwaitingApproval}</CardDescription>
          </CardHeader>
          <CardContent>
            {deductionRequests.length > 0 ? (
              <div className="space-y-4">
                {deductionRequests.map(({ task, user }) => (
                  <div key={task.id} className="p-3 rounded-lg bg-zinc-800 space-y-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={`https://mc-heads.net/avatar/${user?.minecraftUsername}`} />
                        <AvatarFallback>{user?.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user?.username}</span>
                      <Badge className="bg-red-600 ml-auto">
                        -{task.metadata.points} {t.pts}
                      </Badge>
                    </div>
                    <p className="text-sm">{task.metadata.reason}</p>
                    <p className="text-xs text-zinc-400">
                      {t.requested}: {formatDate(new Date(task.createdAt))}
                    </p>

                    {isOperator && (
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => onRejectDeduction(task.id)}
                        >
                          <ThumbsDown className="mr-1 h-3 w-3" />
                          {t.reject}
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          className="w-full"
                          onClick={() => onApproveDeduction(task.id)}
                        >
                          <ThumbsUp className="mr-1 h-3 w-3" />
                          {t.approve}
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-zinc-500 flex flex-col items-center">
                <CheckCircle2 className="h-8 w-8 mb-2" />
                {t.noPendingDeductionRequests}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle>{t.teamChat}</CardTitle>
          <CardDescription className="text-zinc-400">{t.teamCommunication}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-[300px] overflow-y-auto">
            {messages.map((message) => {
              const sender = users.find((u) => u.id === message.sender)
              return (
                <div key={message.id} className="flex gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={`https://mc-heads.net/avatar/${sender?.minecraftUsername}`} />
                    <AvatarFallback>{sender?.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 bg-zinc-800 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{sender?.username}</span>
                      <span className="text-xs text-zinc-400">{formatDate(new Date(message.timestamp))}</span>
                    </div>
                    <p className="mt-1">{message.content}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
        <CardFooter className="border-t border-zinc-800 pt-4">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2 w-full">
            <Input
              placeholder={t.typeAMessage}
              className="bg-zinc-800 border-zinc-700"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <Button type="submit">
              <MessageSquare className="mr-2 h-4 w-4" />
              {t.send}
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}


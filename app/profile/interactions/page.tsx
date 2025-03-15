"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { getUserById } from "@/lib/store"
import type { User, UserInteraction, PointsHistoryEntry } from "@/lib/types"
import { Shield, AlertTriangle, TrendingDown, Info } from "lucide-react"

export default function UserInteractionsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      router.push("/")
      return
    }

    const userData = JSON.parse(currentUser)
    setUser(userData)
    setLoading(false)
  }, [router])

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  // Filter interactions by type
  const warnings = user?.interactionHistory?.filter((interaction) => interaction.type === "warning") || []

  const pointDeductions =
    user?.interactionHistory?.filter((interaction) => interaction.type === "point_deduction") || []

  const roleChanges = user?.interactionHistory?.filter((interaction) => interaction.type === "role_change") || []

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Your Interaction History</h2>
          <Button variant="outline" onClick={() => router.push("/profile")}>
            Back to Profile
          </Button>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Interactions</TabsTrigger>
            <TabsTrigger value="warnings">Warnings</TabsTrigger>
            <TabsTrigger value="points">Point Deductions</TabsTrigger>
            <TabsTrigger value="roles">Role Changes</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 mt-4">
            {user?.interactionHistory && user.interactionHistory.length > 0 ? (
              <div className="space-y-4">
                {user.interactionHistory.map((interaction, index) => (
                  <InteractionCard key={index} interaction={interaction} />
                ))}
              </div>
            ) : (
              <EmptyState message="You have no recorded interactions." />
            )}
          </TabsContent>

          <TabsContent value="warnings" className="space-y-4 mt-4">
            {warnings.length > 0 ? (
              <div className="space-y-4">
                {warnings.map((interaction, index) => (
                  <InteractionCard key={index} interaction={interaction} />
                ))}
              </div>
            ) : (
              <EmptyState message="You have no warnings." />
            )}
          </TabsContent>

          <TabsContent value="points" className="space-y-4 mt-4">
            {pointDeductions.length > 0 ? (
              <div className="space-y-4">
                {pointDeductions.map((interaction, index) => (
                  <InteractionCard key={index} interaction={interaction} />
                ))}
              </div>
            ) : (
              <EmptyState message="You have no point deductions." />
            )}
          </TabsContent>

          <TabsContent value="roles" className="space-y-4 mt-4">
            {roleChanges.length > 0 ? (
              <div className="space-y-4">
                {roleChanges.map((interaction, index) => (
                  <InteractionCard key={index} interaction={interaction} />
                ))}
              </div>
            ) : (
              <EmptyState message="You have no role changes." />
            )}
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Points History</CardTitle>
            <CardDescription>History of your point changes</CardDescription>
          </CardHeader>
          <CardContent>
            {user?.pointsHistory && user.pointsHistory.length > 0 ? (
              <div className="space-y-4">
                {user.pointsHistory.map((entry, index) => (
                  <PointHistoryCard key={index} entry={entry} />
                ))}
              </div>
            ) : (
              <EmptyState message="You have no points history." />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function InteractionCard({ interaction }: { interaction: UserInteraction }) {
  const getIcon = () => {
    switch (interaction.type) {
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "point_deduction":
        return <TrendingDown className="h-5 w-5 text-red-500" />
      case "role_change":
        return <Shield className="h-5 w-5 text-blue-500" />
      case "ban":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      default:
        return <Info className="h-5 w-5" />
    }
  }

  const getTitle = () => {
    switch (interaction.type) {
      case "warning":
        return "Warning"
      case "point_deduction":
        return `Point Deduction (${interaction.points} points)`
      case "role_change":
        return "Role Change"
      case "ban":
        return "Account Ban"
      default:
        return "Interaction"
    }
  }

  const performedBy = getUserById(interaction.performedBy)?.username || "System"

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {getIcon()}
            <CardTitle className="text-lg">{getTitle()}</CardTitle>
          </div>
          <Badge variant="outline">{new Date(interaction.timestamp).toLocaleDateString()}</Badge>
        </div>
        <CardDescription>Performed by {performedBy}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{interaction.reason}</p>
        {interaction.details && <p className="text-xs text-muted-foreground mt-1">{interaction.details}</p>}
      </CardContent>
    </Card>
  )
}

function PointHistoryCard({ entry }: { entry: PointsHistoryEntry }) {
  return (
    <div className="flex items-start space-x-4 border-b pb-4 last:border-0">
      <div
        className={`rounded-full h-8 w-8 flex items-center justify-center ${entry.amount > 0 ? "bg-green-500" : "bg-red-500"} text-white`}
      >
        {entry.amount > 0 ? "+" : "-"}
      </div>
      <div className="space-y-1 flex-1">
        <div className="flex justify-between">
          <p className="text-sm font-medium">{entry.reason}</p>
          <p className={`text-sm font-bold ${entry.amount > 0 ? "text-green-500" : "text-red-500"}`}>
            {entry.amount > 0 ? `+${entry.amount}` : entry.amount} Points
          </p>
        </div>
        <p className="text-xs text-muted-foreground">{new Date(entry.timestamp).toLocaleString()}</p>
        {entry.awardedBy && <p className="text-xs text-muted-foreground">Awarded by: {entry.awardedBy}</p>}
      </div>
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-10">
      <Info className="mx-auto h-10 w-10 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-medium">No Records Found</h3>
      <p className="mt-2 text-sm text-muted-foreground">{message}</p>
    </div>
  )
}


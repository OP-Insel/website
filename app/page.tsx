import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Crown, Users, CheckSquare, CalendarDays } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="container py-10">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold">Welcome to OP Insel</h1>
        <p className="text-xl text-muted-foreground">Minecraft Server Team Management System</p>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Team Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Active members in the team</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">Tasks in progress</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Events this week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Your Role</CardTitle>
              <Crown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Owner</div>
              <p className="text-xs text-muted-foreground">∞ Points Available</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and actions</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button asChild className="w-full">
                <Link href="/tasks/new">Create New Task</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/calendar/new">Schedule Event</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/team">Manage Team</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest actions and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium">New task created</p>
                    <p className="text-sm text-muted-foreground">Build new spawn area</p>
                  </div>
                  <div className="ml-auto text-sm text-muted-foreground">Just now</div>
                </div>
                <div className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium">Points updated</p>
                    <p className="text-sm text-muted-foreground">Monthly points reset</p>
                  </div>
                  <div className="ml-auto text-sm text-muted-foreground">2h ago</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Team Overview</CardTitle>
              <CardDescription>Current team status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Co-Owners</p>
                    <p className="text-sm text-muted-foreground">2 members</p>
                  </div>
                  <div className="text-sm font-medium">750 points each</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Admins</p>
                    <p className="text-sm text-muted-foreground">3 members</p>
                  </div>
                  <div className="text-sm font-medium">500 points each</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Moderators</p>
                    <p className="text-sm text-muted-foreground">4 members</p>
                  </div>
                  <div className="text-sm font-medium">300 points each</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


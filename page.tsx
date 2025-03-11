import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, CheckCircle, Users } from "lucide-react"
import { TaskList } from "@/components/dashboard/task-list"
import { UpcomingEvents } from "@/components/dashboard/upcoming-events"
import { TeamActivity } from "@/components/dashboard/team-activity"
import { ServerStatus } from "@/components/dashboard/server-status"
import { QuickActions } from "@/components/dashboard/quick-actions"

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader
        heading="OP Insel Dashboard"
        text={
          <>
            Willkommen zurück! Server-IP: <span className="font-semibold">OPinsel.de</span>
          </>
        }
      />
      <main className="flex-1 p-6 pt-0">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <ServerStatus />
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">4 tasks completed this week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">2 new members this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Characters</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">3 characters added this week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
              <p className="text-xs text-muted-foreground">Next event in 2 days</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 mt-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Tabs defaultValue="tasks" className="mt-0">
              <TabsList>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="events">Upcoming Events</TabsTrigger>
                <TabsTrigger value="activity">Team Activity</TabsTrigger>
              </TabsList>
              <TabsContent value="tasks" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">Assigned Tasks</h2>
                  <Button>Create Task</Button>
                </div>
                <TaskList />
              </TabsContent>
              <TabsContent value="events" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">Upcoming Events</h2>
                  <Button>Add Event</Button>
                </div>
                <UpcomingEvents />
              </TabsContent>
              <TabsContent value="activity" className="space-y-4">
                <h2 className="text-xl font-bold">Recent Team Activity</h2>
                <TeamActivity />
              </TabsContent>
            </Tabs>
          </div>
          <div>
            <QuickActions />
          </div>
        </div>
      </main>
    </div>
  )
}


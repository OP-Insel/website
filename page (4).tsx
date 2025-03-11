import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentTasks } from "@/components/dashboard/recent-tasks"
import { UpcomingEvents } from "@/components/dashboard/upcoming-events"
import { UserActivity } from "@/components/dashboard/user-activity"

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-6">
      <DashboardHeader />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <DashboardStats />
        <RecentTasks />
        <UpcomingEvents />
      </div>
      <div className="mt-6">
        <UserActivity />
      </div>
    </div>
  )
}


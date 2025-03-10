import { SidebarTrigger } from "@/components/sidebar-provider";
import { Button } from "@/components/ui/button";
import { Bell, MessageSquare, Plus } from 'lucide-react';
import { UserNav } from "@/components/user-nav";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <SidebarTrigger className="md:hidden" />
      <div className="flex-1">
        <h1 className="text-xl font-semibold">Dashboard</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon">
          <Bell className="h-4 w-4" />
          <span className="sr-only">Notifications</span>
        </Button>
        <Button variant="outline" size="icon">
          <MessageSquare className="h-4 w-4" />
          <span className="sr-only">Messages</span>
        </Button>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
        <UserNav />
      </div>
    </header>
  );
}

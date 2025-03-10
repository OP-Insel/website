import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from 'lucide-react';
import { TaskList } from "@/components/task-list";
import { CreateTaskForm } from "@/components/create-task-form";

export default function TasksPage() {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div>
          <h1 className="text-xl font-semibold">Task Management</h1>
          <p className="text-sm text-muted-foreground">
            Create, assign, and track tasks for your Minecraft server team
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>
      <div className="container py-6">
        <Tabs defaultValue="all" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">All Tasks</TabsTrigger>
              <TabsTrigger value="my-tasks">My Tasks</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>All Tasks</CardTitle>
                <CardDescription>
                  View and manage all tasks in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TaskList />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="my-tasks" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>My Tasks</CardTitle>
                <CardDescription>
                  Tasks assigned to you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TaskList />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="completed" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Completed Tasks</CardTitle>
                <CardDescription>
                  Tasks that have been completed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TaskList />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

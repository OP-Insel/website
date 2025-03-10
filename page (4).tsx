import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from 'lucide-react';
import { StoryEditor } from "@/components/story-editor";
import { StoryList } from "@/components/story-list";

export default function StoryPage() {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div>
          <h1 className="text-xl font-semibold">Story System</h1>
          <p className="text-sm text-muted-foreground">
            Create and manage storylines for your Minecraft server
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Story
        </Button>
      </div>
      <div className="container py-6">
        <Tabs defaultValue="stories" className="space-y-4">
          <TabsList>
            <TabsTrigger value="stories">Stories</TabsTrigger>
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="archive">Archive</TabsTrigger>
          </TabsList>
          <TabsContent value="stories" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>All Stories</CardTitle>
                <CardDescription>
                  Browse and manage all storylines
                </CardDescription>
              </CardHeader>
              <CardContent>
                <StoryList />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="editor" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Story Editor</CardTitle>
                <CardDescription>
                  Create or edit a storyline
                </CardDescription>
              </CardHeader>
              <CardContent>
                <StoryEditor />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="archive" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Archived Stories</CardTitle>
                <CardDescription>
                  View and restore archived storylines
                </CardDescription>
              </CardHeader>
              <CardContent>
                <StoryList archived />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

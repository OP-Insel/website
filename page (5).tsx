import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from 'lucide-react';
import { CharacterList } from "@/components/character-list";
import { CharacterForm } from "@/components/character-form";

export default function CharactersPage() {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div>
          <h1 className="text-xl font-semibold">Character Database</h1>
          <p className="text-sm text-muted-foreground">
            Create and manage characters for your Minecraft server storyline
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Character
        </Button>
      </div>
      <div className="container py-6">
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Characters</TabsTrigger>
            <TabsTrigger value="alive">Alive</TabsTrigger>
            <TabsTrigger value="deceased">Deceased</TabsTrigger>
            <TabsTrigger value="create">Create Character</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>All Characters</CardTitle>
                <CardDescription>
                  Browse and manage all characters in your storyline
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CharacterList />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="alive" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Alive Characters</CardTitle>
                <CardDescription>
                  Characters that are currently alive in your storyline
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CharacterList filterAlive={true} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="deceased" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Deceased Characters</CardTitle>
                <CardDescription>
                  Characters that are deceased in your storyline
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CharacterList filterAlive={false} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="create" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Create Character</CardTitle>
                <CardDescription>
                  Add a new character to your storyline
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CharacterForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

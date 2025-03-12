import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, BookOpen, Users, FileText } from "lucide-react"

export default function StoryPlannerPage() {
  // Mock data for stories and characters
  const stories = [
    {
      id: 1,
      title: "Die Legende von OP-Insel",
      author: "Spieler1",
      excerpt: "Eine epische Geschichte über die Entstehung der OP-Insel und ihre ersten Bewohner.",
      lastEdited: "Vor 2 Tagen",
      chapters: 5,
    },
    {
      id: 2,
      title: "Der verlorene Schatz",
      author: "Spieler3",
      excerpt: "Die Suche nach einem legendären Schatz führt zu unerwarteten Abenteuern.",
      lastEdited: "Vor 5 Tagen",
      chapters: 3,
    },
    {
      id: 3,
      title: "Dunkle Geheimnisse",
      author: "Spieler2",
      excerpt: "Mysteriöse Ereignisse erschüttern den Frieden auf der Insel.",
      lastEdited: "Vor 1 Woche",
      chapters: 2,
    },
  ]

  const characters = [
    {
      id: 1,
      name: "Kapitän Blitz",
      creator: "Spieler1",
      description: "Der mutige Anführer der ersten Expedition zur OP-Insel.",
      stories: ["Die Legende von OP-Insel"],
    },
    {
      id: 2,
      name: "Luna",
      creator: "Spieler3",
      description: "Eine geheimnisvolle Inselbewohnerin mit magischen Fähigkeiten.",
      stories: ["Der verlorene Schatz", "Dunkle Geheimnisse"],
    },
    {
      id: 3,
      name: "Professor Funke",
      creator: "Spieler2",
      description: "Ein zerstreuter Wissenschaftler auf der Suche nach altem Wissen.",
      stories: ["Dunkle Geheimnisse"],
    },
  ]

  return (
    <div className="container py-6 space-y-8 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Story-Planer</h1>
          <p className="text-muted-foreground mt-2">Erstelle und verwalte Charaktere und Geschichten.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Users className="h-4 w-4" />
            Neuer Charakter
          </Button>
          <Button className="gap-2">
            <BookOpen className="h-4 w-4" />
            Neue Geschichte
          </Button>
        </div>
      </div>

      <Tabs defaultValue="stories" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="stories" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Geschichten
          </TabsTrigger>
          <TabsTrigger value="characters" className="gap-2">
            <Users className="h-4 w-4" />
            Charaktere
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stories" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {stories.map((story) => (
              <Card key={story.id} className="border border-border hover:border-primary/50 transition-all">
                <CardHeader>
                  <CardTitle>{story.title}</CardTitle>
                  <CardDescription>
                    Von {story.author} • {story.lastEdited}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{story.excerpt}</p>
                  <div className="flex items-center mt-4 text-sm">
                    <FileText className="h-4 w-4 mr-2" />
                    <span>{story.chapters} Kapitel</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    Öffnen
                  </Button>
                </CardFooter>
              </Card>
            ))}

            <Card className="border border-dashed border-border hover:border-primary/50 transition-all flex flex-col items-center justify-center p-6">
              <div className="rounded-full bg-secondary p-3 mb-4">
                <Plus className="h-6 w-6" />
              </div>
              <h3 className="font-medium mb-2">Neue Geschichte</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Erstelle eine neue Geschichte für deine Charaktere
              </p>
              <Button variant="outline" size="sm">
                Geschichte erstellen
              </Button>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="characters" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {characters.map((character) => (
              <Card key={character.id} className="border border-border hover:border-primary/50 transition-all">
                <CardHeader>
                  <CardTitle>{character.name}</CardTitle>
                  <CardDescription>Erstellt von {character.creator}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{character.description}</p>
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Erscheint in:</h4>
                    <div className="flex flex-wrap gap-2">
                      {character.stories.map((story, index) => (
                        <Badge key={index} variant="secondary">
                          {story}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    Bearbeiten
                  </Button>
                </CardFooter>
              </Card>
            ))}

            <Card className="border border-dashed border-border hover:border-primary/50 transition-all flex flex-col items-center justify-center p-6">
              <div className="rounded-full bg-secondary p-3 mb-4">
                <Plus className="h-6 w-6" />
              </div>
              <h3 className="font-medium mb-2">Neuer Charakter</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Erstelle einen neuen Charakter für deine Geschichten
              </p>
              <Button variant="outline" size="sm">
                Charakter erstellen
              </Button>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}


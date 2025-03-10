import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Github } from "lucide-react"

export default function ProjectsPage() {
  const projects = [
    {
      title: "E-commerce Platform",
      description: "A full-featured online store with payment processing, inventory management, and admin dashboard.",
      longDescription:
        "This e-commerce platform provides businesses with everything they need to sell products online. Features include product management, inventory tracking, secure payment processing with Stripe, order management, and a comprehensive admin dashboard with analytics.",
      tags: ["React", "Node.js", "Express", "MongoDB", "Stripe", "Redux", "JWT"],
      image: "/placeholder.svg?height=200&width=400",
      demoUrl: "https://example.com",
      githubUrl: "https://github.com",
    },
    {
      title: "Task Management App",
      description: "A collaborative task manager with real-time updates and team features.",
      longDescription:
        "This task management application helps teams organize their work efficiently. It includes features like task creation and assignment, due dates, priority levels, comments, file attachments, and real-time updates. The app also provides team collaboration features and project progress tracking.",
      tags: ["Next.js", "Firebase", "Tailwind CSS", "React Query", "Zustand"],
      image: "/placeholder.svg?height=200&width=400",
      demoUrl: "https://example.com",
      githubUrl: "https://github.com",
    },
    {
      title: "Personal Finance Dashboard",
      description: "A dashboard to track expenses, income, and financial goals with data visualization.",
      longDescription:
        "This personal finance dashboard helps users manage their finances by tracking income, expenses, and savings goals. It includes features like transaction categorization, budget planning, financial goal setting, and data visualization with charts and graphs to provide insights into spending habits.",
      tags: ["React", "D3.js", "Express", "PostgreSQL", "Chart.js", "TypeScript"],
      image: "/placeholder.svg?height=200&width=400",
      demoUrl: "https://example.com",
      githubUrl: "https://github.com",
    },
    {
      title: "Weather Application",
      description: "A weather forecast app with location-based services and interactive maps.",
      longDescription:
        "This weather application provides users with accurate weather forecasts based on their location. It includes features like current conditions, hourly and daily forecasts, severe weather alerts, interactive maps with radar data, and the ability to save multiple locations for quick access.",
      tags: ["React", "OpenWeather API", "Mapbox", "Geolocation API", "PWA"],
      image: "/placeholder.svg?height=200&width=400",
      demoUrl: "https://example.com",
      githubUrl: "https://github.com",
    },
    {
      title: "Recipe Sharing Platform",
      description: "A community-driven platform for sharing and discovering recipes.",
      longDescription:
        "This recipe sharing platform allows users to discover, share, and save recipes. Features include recipe creation with step-by-step instructions, ingredient lists, cooking times, difficulty levels, user ratings and reviews, recipe collections, and a search function with filtering options.",
      tags: ["Vue.js", "Node.js", "MongoDB", "Express", "Authentication", "Cloudinary"],
      image: "/placeholder.svg?height=200&width=400",
      demoUrl: "https://example.com",
      githubUrl: "https://github.com",
    },
    {
      title: "Fitness Tracking App",
      description: "A mobile-responsive app to track workouts, nutrition, and fitness goals.",
      longDescription:
        "This fitness tracking application helps users monitor their fitness journey. It includes features like workout logging, exercise library with instructions, nutrition tracking, goal setting, progress visualization, and personalized workout recommendations based on user preferences and history.",
      tags: ["React Native", "Firebase", "Redux", "Health API", "Expo"],
      image: "/placeholder.svg?height=200&width=400",
      demoUrl: "https://example.com",
      githubUrl: "https://github.com",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-2">My Projects</h1>
      <p className="text-xl text-muted-foreground mb-8">A collection of my recent work and personal projects</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <Card key={index} className="flex flex-col overflow-hidden">
            <div className="relative h-48 w-full">
              <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
            </div>
            <CardHeader>
              <CardTitle>{project.title}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground mb-4">{project.longDescription.substring(0, 150)}...</p>
              <div className="flex flex-wrap gap-2">
                {project.tags.slice(0, 4).map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
                {project.tags.length > 4 && <Badge variant="outline">+{project.tags.length - 4} more</Badge>}
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button asChild variant="outline" className="flex-1">
                <Link href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" /> Code
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-16 bg-muted rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Interested in collaborating?</h2>
        <p className="text-muted-foreground max-w-lg mx-auto mb-6">
          I'm always open to discussing new projects and opportunities. Let's create something amazing together!
        </p>
        <Button asChild size="lg">
          <Link href="/contact">Get In Touch</Link>
        </Button>
      </div>
    </div>
  )
}


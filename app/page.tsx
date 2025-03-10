import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Github, Linkedin, Mail, ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-8 py-12">
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold">
            Hi, I'm <span className="text-primary">John Doe</span>
          </h1>
          <h2 className="text-2xl md:text-3xl font-medium text-muted-foreground">Full-Stack Developer</h2>
          <p className="text-lg text-muted-foreground max-w-lg">
            I build accessible, user-friendly web applications with modern technologies. Passionate about creating
            solutions that make a difference.
          </p>
          <div className="flex gap-4">
            <Button asChild>
              <Link href="/projects">View My Work</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/contact">Contact Me</Link>
            </Button>
          </div>
          <div className="flex gap-4 pt-4">
            <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Button>
            </Link>
            <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Button>
            </Link>
            <Link href="mailto:contact@example.com">
              <Button variant="ghost" size="icon">
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-primary">
            <Image src="/placeholder.svg?height=320&width=320" alt="John Doe" fill className="object-cover" priority />
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-12">
        <h2 className="text-3xl font-bold mb-8">Skills & Technologies</h2>
        <div className="flex flex-wrap gap-2">
          {[
            "JavaScript",
            "TypeScript",
            "React",
            "Next.js",
            "Node.js",
            "Express",
            "MongoDB",
            "PostgreSQL",
            "GraphQL",
            "Tailwind CSS",
            "Git",
            "Docker",
            "AWS",
            "CI/CD",
          ].map((skill) => (
            <Badge key={skill} variant="secondary" className="text-sm py-1 px-3">
              {skill}
            </Badge>
          ))}
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Projects</h2>
          <Link href="/projects" className="text-primary flex items-center hover:underline">
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "E-commerce Platform",
              description: "A full-featured online store with payment processing and inventory management.",
              tags: ["React", "Node.js", "MongoDB", "Stripe"],
              image: "/placeholder.svg?height=200&width=400",
            },
            {
              title: "Task Management App",
              description: "A collaborative task manager with real-time updates and team features.",
              tags: ["Next.js", "Firebase", "Tailwind CSS"],
              image: "/placeholder.svg?height=200&width=400",
            },
            {
              title: "Personal Finance Dashboard",
              description: "A dashboard to track expenses, income, and financial goals with data visualization.",
              tags: ["React", "D3.js", "Express", "PostgreSQL"],
              image: "/placeholder.svg?height=200&width=400",
            },
          ].map((project, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="relative h-48 w-full">
                <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
              </div>
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View Project
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="py-12">
        <h2 className="text-3xl font-bold mb-8">About Me</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <p>
              I'm a passionate full-stack developer with over 5 years of experience building web applications. I
              specialize in JavaScript technologies across the stack and have a strong focus on creating performant,
              accessible, and user-friendly experiences.
            </p>
            <p>
              When I'm not coding, you can find me hiking, reading sci-fi novels, or experimenting with new cooking
              recipes. I'm always eager to learn new technologies and contribute to open-source projects.
            </p>
            <Button asChild className="mt-4">
              <Link href="/about">Learn More About Me</Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted rounded-lg p-6 flex flex-col items-center justify-center text-center">
              <h3 className="text-xl font-bold">5+</h3>
              <p className="text-muted-foreground">Years Experience</p>
            </div>
            <div className="bg-muted rounded-lg p-6 flex flex-col items-center justify-center text-center">
              <h3 className="text-xl font-bold">20+</h3>
              <p className="text-muted-foreground">Projects Completed</p>
            </div>
            <div className="bg-muted rounded-lg p-6 flex flex-col items-center justify-center text-center">
              <h3 className="text-xl font-bold">10+</h3>
              <p className="text-muted-foreground">Happy Clients</p>
            </div>
            <div className="bg-muted rounded-lg p-6 flex flex-col items-center justify-center text-center">
              <h3 className="text-xl font-bold">5+</h3>
              <p className="text-muted-foreground">Open Source Contributions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-12">
        <div className="bg-muted rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Let's Work Together</h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-6">
            Have a project in mind or want to discuss potential opportunities? I'm always open to new challenges.
          </p>
          <Button asChild size="lg">
            <Link href="/contact">Get In Touch</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}


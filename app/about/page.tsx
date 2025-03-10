import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">About Me</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="md:col-span-2 space-y-6">
          <p className="text-lg">
            Hello! I'm John Doe, a full-stack developer with a passion for building web applications that are not only
            functional but also accessible and user-friendly.
          </p>

          <p>
            I started my journey in web development over 5 years ago, and since then, I've worked on a variety of
            projects ranging from small business websites to complex enterprise applications. My experience spans across
            different industries, including e-commerce, healthcare, and finance.
          </p>

          <p>
            My approach to development is centered around solving real problems and creating value for users. I believe
            in writing clean, maintainable code and staying up-to-date with the latest technologies and best practices
            in the field.
          </p>

          <h2 className="text-2xl font-bold mt-8">My Journey</h2>
          <p>
            I graduated with a degree in Computer Science from University of Technology in 2018. After graduation, I
            joined a startup where I got hands-on experience with modern web development technologies. This experience
            was invaluable and helped me develop a strong foundation in both frontend and backend development.
          </p>

          <p>
            In 2020, I decided to freelance full-time, which allowed me to work on diverse projects and expand my skill
            set. I've collaborated with clients from around the world, helping them bring their ideas to life through
            technology.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <div className="relative w-full h-80 rounded-lg overflow-hidden">
            <Image src="/placeholder.svg?height=320&width=240" alt="John Doe" fill className="object-cover" />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Facts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="font-medium">Location:</span> New York, USA
              </div>
              <div>
                <span className="font-medium">Experience:</span> 5+ years
              </div>
              <div>
                <span className="font-medium">Education:</span> B.S. in Computer Science
              </div>
              <div>
                <span className="font-medium">Languages:</span> English (Native), Spanish (Conversational)
              </div>
              <div>
                <span className="font-medium">Availability:</span> Open to freelance & full-time opportunities
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Skills & Expertise</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Frontend Development</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {[
                  "HTML5",
                  "CSS3",
                  "JavaScript",
                  "TypeScript",
                  "React",
                  "Next.js",
                  "Vue.js",
                  "Tailwind CSS",
                  "SASS",
                  "Redux",
                  "Responsive Design",
                  "Accessibility",
                ].map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Backend Development</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {[
                  "Node.js",
                  "Express",
                  "Python",
                  "Django",
                  "PHP",
                  "Laravel",
                  "RESTful APIs",
                  "GraphQL",
                  "WebSockets",
                  "Authentication",
                  "Authorization",
                ].map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Database & Storage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {[
                  "MongoDB",
                  "PostgreSQL",
                  "MySQL",
                  "Redis",
                  "Firebase",
                  "AWS S3",
                  "Database Design",
                  "ORM",
                  "Data Modeling",
                ].map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>DevOps & Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {[
                  "Git",
                  "GitHub",
                  "Docker",
                  "CI/CD",
                  "AWS",
                  "Vercel",
                  "Netlify",
                  "Testing",
                  "Performance Optimization",
                  "SEO",
                  "Agile Methodologies",
                ].map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Work Experience</h2>

        <div className="space-y-8">
          <div className="border-l-4 border-primary pl-6 relative">
            <div className="absolute w-4 h-4 bg-primary rounded-full -left-[10px] top-1"></div>
            <h3 className="text-xl font-bold">Senior Full-Stack Developer</h3>
            <p className="text-muted-foreground">Freelance • 2020 - Present</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Developed and maintained web applications for various clients</li>
              <li>Implemented responsive designs and ensured cross-browser compatibility</li>
              <li>Collaborated with designers and stakeholders to deliver high-quality products</li>
              <li>Provided technical consultation and solutions architecture</li>
            </ul>
          </div>

          <div className="border-l-4 border-primary pl-6 relative">
            <div className="absolute w-4 h-4 bg-primary rounded-full -left-[10px] top-1"></div>
            <h3 className="text-xl font-bold">Full-Stack Developer</h3>
            <p className="text-muted-foreground">TechStart Inc. • 2018 - 2020</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Built and maintained web applications using React, Node.js, and MongoDB</li>
              <li>Participated in code reviews and implemented best practices</li>
              <li>Collaborated with cross-functional teams in an Agile environment</li>
              <li>Mentored junior developers and conducted technical interviews</li>
            </ul>
          </div>

          <div className="border-l-4 border-primary pl-6 relative">
            <div className="absolute w-4 h-4 bg-primary rounded-full -left-[10px] top-1"></div>
            <h3 className="text-xl font-bold">Web Development Intern</h3>
            <p className="text-muted-foreground">Digital Solutions LLC • Summer 2017</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Assisted in developing and maintaining client websites</li>
              <li>Implemented responsive designs using HTML, CSS, and JavaScript</li>
              <li>Participated in team meetings and contributed to project planning</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Education</h2>

        <div className="border-l-4 border-primary pl-6 relative">
          <div className="absolute w-4 h-4 bg-primary rounded-full -left-[10px] top-1"></div>
          <h3 className="text-xl font-bold">Bachelor of Science in Computer Science</h3>
          <p className="text-muted-foreground">University of Technology • 2014 - 2018</p>
          <p className="mt-2">
            Graduated with honors. Coursework included Data Structures, Algorithms, Database Systems, Web Development,
            and Software Engineering.
          </p>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold mb-6">Interested in working together?</h2>
        <Button asChild size="lg">
          <Link href="/contact">Contact Me</Link>
        </Button>
      </div>
    </div>
  )
}


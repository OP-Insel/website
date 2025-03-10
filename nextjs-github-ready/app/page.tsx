import Link from "next/link"
import { GithubIcon, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-6 w-6" />
            <span className="text-xl font-bold">My Website</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/" className="text-sm font-medium hover:underline">
              Home
            </Link>
            <Link href="/about" className="text-sm font-medium hover:underline">
              About
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:underline">
              Contact
            </Link>
            <Button variant="outline" size="sm">
              <GithubIcon className="mr-2 h-4 w-4" />
              GitHub
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="container py-12 md:py-24">
          <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
            <h1 className="text-3xl font-bold leading-tight md:text-5xl">Welcome to My Next.js Website</h1>
            <p className="max-w-[750px] text-lg text-muted-foreground">
              A streamlined Next.js project ready for GitHub deployment.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button size="lg">Get Started</Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>
        </section>

        <section className="container py-12 md:py-24 bg-muted/50">
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Easy Setup</CardTitle>
                <CardDescription>Simple structure for quick deployment</CardDescription>
              </CardHeader>
              <CardContent>
                <p>This project is designed to be easily uploaded to GitHub with minimal configuration required.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm">
                  Learn More
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Unique Files</CardTitle>
                <CardDescription>Avoid naming conflicts</CardDescription>
              </CardHeader>
              <CardContent>
                <p>All files have unique names to prevent conflicts when uploading to your repository.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm">
                  Learn More
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Responsive Design</CardTitle>
                <CardDescription>Looks great on all devices</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Built with responsive design principles to ensure your site looks good on mobile, tablet, and desktop.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm">
                  Learn More
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} My Website. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-sm font-medium hover:underline">
              Terms
            </Link>
            <Link href="#" className="text-sm font-medium hover:underline">
              Privacy
            </Link>
            <Link href="#" className="text-sm font-medium hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}


import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <div className="container py-12">
          <div className="mx-auto max-w-[768px]">
            <h1 className="mb-6 text-3xl font-bold">About This Project</h1>

            <div className="prose prose-slate dark:prose-invert">
              <p className="lead">This is a streamlined Next.js project designed for easy GitHub deployment.</p>

              <h2>Project Features</h2>
              <ul>
                <li>Minimal file structure for easy management</li>
                <li>Unique file names to avoid conflicts</li>
                <li>Responsive design using Tailwind CSS</li>
                <li>Ready for immediate GitHub deployment</li>
                <li>Includes both HTML and Next.js components</li>
              </ul>

              <h2>Getting Started</h2>
              <p>
                To use this project, simply download all the files and upload them to your GitHub repository. The
                project is configured to work out of the box with minimal setup required.
              </p>

              <h2>File Structure</h2>
              <p>The project includes the following key files:</p>
              <ul>
                <li>
                  <code>app/page.tsx</code> - The main homepage
                </li>
                <li>
                  <code>app/about-page/page.tsx</code> - This about page
                </li>
                <li>
                  <code>app/contact-page/page.tsx</code> - A contact page
                </li>
                <li>
                  <code>public/static-page.html</code> - A static HTML file
                </li>
                <li>
                  <code>app/layout.tsx</code> - The main layout wrapper
                </li>
                <li>Various UI components in the components directory</li>
              </ul>

              <h2>Customization</h2>
              <p>You can easily customize this project by:</p>
              <ul>
                <li>Modifying the content in each page file</li>
                <li>Updating the styles in globals.css</li>
                <li>Adding new pages by creating new directories in the app folder</li>
                <li>Customizing the UI components in the components directory</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t py-6">
        <div className="container text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} My Website. All rights reserved.
        </div>
      </footer>
    </div>
  )
}


import type React from "react"
import "./globals.css"

export const metadata = {
  title: "My Website",
  description: "A minimal Next.js project for GitHub Pages",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <header className="bg-white border-b py-4">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <div className="text-xl font-bold">My Website</div>
            <nav>
              <a href="/" className="mr-4 hover:underline">
                Home
              </a>
              <a href="/about" className="mr-4 hover:underline">
                About
              </a>
              <a href="/contact" className="hover:underline">
                Contact
              </a>
            </nav>
          </div>
        </header>

        <main>{children}</main>

        <footer className="bg-gray-100 py-6 mt-12">
          <div className="container mx-auto px-4 text-center text-gray-600">
            &copy; {new Date().getFullYear()} My Website. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  )
}



import './globals.css'
import type React from "react"
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
      <body style={{ margin: 0, padding: 0 }}>
        <header
          style={{
            backgroundColor: "white",
            borderBottom: "1px solid #eaeaea",
            padding: "1rem 0",
          }}
        >
          <div
            style={{
              maxWidth: "800px",
              margin: "0 auto",
              padding: "0 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ fontWeight: "bold" }}>My Website</div>
            <nav>
              <a href="/" style={{ color: "#333", marginRight: "1rem", textDecoration: "none" }}>
                Home
              </a>
              <a href="/about" style={{ color: "#333", marginRight: "1rem", textDecoration: "none" }}>
                About
              </a>
              <a href="/contact" style={{ color: "#333", textDecoration: "none" }}>
                Contact
              </a>
            </nav>
          </div>
        </header>

        {children}
      </body>
    </html>
  )
}



import './globals.css'
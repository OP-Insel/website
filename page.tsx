export default function About() {
  return (
    <div
      style={{
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <a href="/" style={{ color: "#0070f3", textDecoration: "none", display: "inline-block", marginBottom: "1rem" }}>
        ← Back to Home
      </a>

      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>About This Project</h1>

      <p style={{ marginBottom: "1.5rem", lineHeight: 1.6 }}>
        This is a minimal Next.js project designed for GitHub Pages deployment. It uses inline styles instead of
        external CSS frameworks to minimize dependencies.
      </p>

      <h2 style={{ fontSize: "1.5rem", marginTop: "2rem", marginBottom: "1rem" }}>Features</h2>

      <ul style={{ paddingLeft: "1.5rem", marginBottom: "1.5rem", lineHeight: 1.6 }}>
        <li>Minimal file structure</li>
        <li>No external dependencies</li>
        <li>Inline styles for simplicity</li>
        <li>Ready for GitHub Pages deployment</li>
        <li>Responsive design</li>
      </ul>

      <footer
        style={{
          marginTop: "3rem",
          borderTop: "1px solid #eaeaea",
          paddingTop: "1rem",
          textAlign: "center",
          color: "#666",
        }}
      >
        © {new Date().getFullYear()} My Website. All rights reserved.
      </footer>
    </div>
  )
}


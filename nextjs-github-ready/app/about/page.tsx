import Link from "next/link"

export default function About() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="text-blue-500 hover:underline mb-6 block">
        ← Back to Home
      </Link>

      <h1 className="text-3xl font-bold mb-6">About This Project</h1>

      <div className="max-w-2xl">
        <p className="mb-4">This is a minimal Next.js project designed for easy GitHub deployment.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">Project Features</h2>
        <ul className="list-disc pl-6 mb-6">
          <li>Minimal file structure for easy management</li>
          <li>Unique file names to avoid conflicts</li>
          <li>Responsive design using Tailwind CSS</li>
          <li>Ready for immediate GitHub deployment</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-3">File Structure</h2>
        <p className="mb-2">The project includes the following key files:</p>
        <ul className="list-disc pl-6">
          <li>
            <code className="bg-gray-100 px-1 py-0.5 rounded">app/page.tsx</code> - The main homepage
          </li>
          <li>
            <code className="bg-gray-100 px-1 py-0.5 rounded">app/about/page.tsx</code> - This about page
          </li>
          <li>
            <code className="bg-gray-100 px-1 py-0.5 rounded">app/contact/page.tsx</code> - A contact page
          </li>
          <li>
            <code className="bg-gray-100 px-1 py-0.5 rounded">public/static.html</code> - A static HTML file
          </li>
          <li>
            <code className="bg-gray-100 px-1 py-0.5 rounded">public/index.html</code> - A redirect HTML file
          </li>
        </ul>
      </div>
    </div>
  )
}


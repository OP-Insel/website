import Link from "next/link"

export default function Contact() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="text-blue-500 hover:underline mb-6 block">
        ← Back to Home
      </Link>

      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <p className="mb-6">
            Have questions or feedback? We'd love to hear from you. Fill out the form or use one of our contact methods
            below.
          </p>

          <div className="space-y-4">
            <div className="border p-4 rounded-lg">
              <h3 className="font-semibold">Email</h3>
              <p>contact@example.com</p>
            </div>

            <div className="border p-4 rounded-lg">
              <h3 className="font-semibold">Phone</h3>
              <p>+1 (555) 123-4567</p>
            </div>

            <div className="border p-4 rounded-lg">
              <h3 className="font-semibold">Address</h3>
              <p>123 Main St, Anytown, USA</p>
            </div>
          </div>
        </div>

        <div className="border p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Send a Message</h2>

          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="first-name" className="block text-sm font-medium mb-1">
                  First Name
                </label>
                <input type="text" id="first-name" className="w-full px-3 py-2 border rounded-md" placeholder="John" />
              </div>

              <div>
                <label htmlFor="last-name" className="block text-sm font-medium mb-1">
                  Last Name
                </label>
                <input type="text" id="last-name" className="w-full px-3 py-2 border rounded-md" placeholder="Doe" />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="john.doe@example.com"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1">
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Your message here..."
              ></textarea>
            </div>

            <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}


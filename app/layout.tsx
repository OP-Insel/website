import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "./providers/theme-provider"
import { AuthProvider } from "./hooks/use-auth"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "OP-Insel Team Manager",
  description: "Minecraft server team management system for OP-Insel",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}



import './globals.css'
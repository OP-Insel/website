import type React from "react"
import { ServerDataProvider } from "@/components/server-data-provider"
import { ThemeProvider } from "@/components/theme-provider"

// Füge den ServerDataProvider zum Layout hinzu
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <ServerDataProvider>{children}</ServerDataProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'

export const metadata = {
      generator: 'v0.dev'
    };

"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function NotFound() {
  const router = useRouter()

  // Für GitHub Pages: Versuche, die richtige Route zu finden, wenn die Seite direkt aufgerufen wird
  useEffect(() => {
    // Extrahiere den Pfad aus der URL
    const path = window.location.pathname

    // Entferne den Basis-Pfad, falls vorhanden (z.B. /minecraft-server-manager)
    const basePath = "" // Ändere dies, wenn du einen basePath in next.config.mjs verwendest
    const cleanPath = path.replace(basePath, "")

    // Überprüfe, ob wir auf einer bekannten Route sind
    const knownRoutes = ["/dashboard", "/calendar", "/tasks", "/users", "/settings", "/login", "/register"]

    // Wenn wir auf einer bekannten Route sind, aber die 404-Seite angezeigt wird,
    // versuche, zur richtigen Seite zu navigieren
    if (knownRoutes.some((route) => cleanPath.startsWith(route))) {
      router.replace(cleanPath)
    }
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Seite nicht gefunden</CardTitle>
          <CardDescription>Die angeforderte Seite konnte nicht gefunden werden.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Möglicherweise hast du einen falschen Link verwendet oder die Seite wurde verschoben.</p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => router.push("/dashboard")} className="w-full">
            Zurück zum Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}


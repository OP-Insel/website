"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Überprüfe, ob wir von der 404.html Seite umgeleitet wurden
    const query = new URLSearchParams(window.location.search)
    const path = query.get("path")

    if (path) {
      // Entferne den Query-Parameter und navigiere zur richtigen Seite
      window.history.replaceState(null, "", path)
      router.replace(path)
    } else {
      // Standard-Weiterleitung zum Dashboard
      router.replace("/dashboard")
    }
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-lg">Lade...</p>
    </div>
  )
}


"use client"

import { useEffect } from "react"
import { useRouter } from "next/router"
import type { AppProps } from "next/app"
import "../app/globals.css"

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()

  useEffect(() => {
    // Überprüfe, ob wir von der 404.html Seite umgeleitet wurden
    const query = new URLSearchParams(window.location.search)
    const path = query.get("path")

    if (path) {
      // Entferne den Query-Parameter und navigiere zur richtigen Seite
      window.history.replaceState(null, "", path)

      // Navigiere zur richtigen Seite
      router.replace(path)
    }
  }, [router])

  return <Component {...pageProps} />
}

export default MyApp


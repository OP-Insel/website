"use client"

import { useLanguageContext } from "../providers/language-provider"

export function useLanguage() {
  const context = useLanguageContext()

  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }

  return context
}


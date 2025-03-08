"use client"

import { useContext } from "react"
import { LanguageContext } from "../providers/language-provider"
import { translations } from "../lib/translations"

export function useTranslation() {
  const { language } = useContext(LanguageContext)

  const t = (key, params = {}) => {
    // Get nested keys (e.g., "user.update_success_title")
    const keys = key.split(".")

    // Get the translation for the current language, falling back to English if not found
    let translation = translations[language] || translations.en

    // Traverse the nested keys
    for (const k of keys) {
      translation = translation[k]

      // If translation doesn't exist, fall back to English
      if (translation === undefined) {
        translation = translations.en
        for (const k of keys) {
          translation = translation[k]
          if (translation === undefined) {
            return key // Return the key itself if translation doesn't exist
          }
        }
        break
      }
    }

    // Replace parameters in the translation
    if (typeof translation === "string" && Object.keys(params).length > 0) {
      for (const [param, value] of Object.entries(params)) {
        translation = translation.replace(new RegExp(`{${param}}`, "g"), value)
      }
    }

    return translation
  }

  return { t, language }
}


import type { Locale } from "@optolith/database-schema/gen"
import { useEffect, useState } from "react"
import { LocalizationContext } from "../../contexts/localization.ts"
import { TypedEventEmitter } from "../../utils/events.ts"
import { FCC } from "../../utils/react.ts"

type Props = {
  selectedLocale: string | undefined
  selectedFallbackLocale: string | undefined
  selectedLocaleEvents: TypedEventEmitter<{
    "locale-changed": [locale: string | undefined]
    "fallback-locale-changed": [locale: string | undefined]
  }>
  systemLocale: string
  platform: NodeJS.Platform
  locales: Record<string, Locale>
}

/**
 * Provides localization information to the application and handles global
 * locale changes.
 */
export const LocalizationProvider: FCC<Props> = props => {
  const {
    children,
    locales,
    platform,
    selectedLocale: initialSelectedLocale,
    selectedFallbackLocale: initialSelectedFallbackLocale,
    selectedLocaleEvents,
    systemLocale,
  } = props

  const [selectedLocale, setSelectedLocale] = useState<string | undefined>(initialSelectedLocale)
  const [selectedFallbackLocale, setSelectedFallbackLocale] = useState<string | undefined>(
    initialSelectedFallbackLocale,
  )

  useEffect(() => {
    selectedLocaleEvents.on("locale-changed", setSelectedLocale)
    selectedLocaleEvents.on("fallback-locale-changed", setSelectedFallbackLocale)

    return () => {
      selectedLocaleEvents.removeListener("locale-changed", setSelectedLocale)
      selectedLocaleEvents.removeListener("fallback-locale-changed", setSelectedFallbackLocale)
    }
  }, [selectedLocaleEvents])

  return (
    <LocalizationContext.Provider
      value={{ locales, platform, selectedLocale, selectedFallbackLocale, systemLocale }}
    >
      {children}
    </LocalizationContext.Provider>
  )
}

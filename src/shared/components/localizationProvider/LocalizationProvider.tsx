import { Locale } from "optolith-database-schema/types/Locale"
import { UI } from "optolith-database-schema/types/UI"
import { useEffect, useState } from "react"
import { LocalizationContext } from "../../contexts/localization.ts"
import { TypedEventEmitterForEvent } from "../../utils/events.ts"
import { FCC } from "../../utils/react.ts"

type Props = {
  selectedLocale: string | undefined
  selectedFallbackLocale: string | undefined
  selectedLocaleEvents:
    TypedEventEmitterForEvent<"locale-changed", [locale: string | undefined]>
    & TypedEventEmitterForEvent<"fallback-locale-changed", [locale: string | undefined]>
  systemLocale: string
  locales: Record<string, Locale>
  ui: Record<string, UI>
}

export const LocalizationProvider: FCC<Props> = props => {
  const {
    children,
    locales,
    selectedLocale: initialSelectedLocale,
    selectedFallbackLocale: initialSelectedFallbackLocale,
    selectedLocaleEvents,
    systemLocale,
    ui,
  } = props

  const [ selectedLocale, setSelectedLocale ] =
    useState<string | undefined>(initialSelectedLocale)
  const [ selectedFallbackLocale, setSelectedFallbackLocale ] =
    useState<string | undefined>(initialSelectedFallbackLocale)

  useEffect(() => {
    selectedLocaleEvents.on("locale-changed", setSelectedLocale)
    selectedLocaleEvents.on("fallback-locale-changed", setSelectedFallbackLocale)

    return () => {
      selectedLocaleEvents.removeListener("locale-changed", setSelectedLocale)
      selectedLocaleEvents.removeListener("fallback-locale-changed", setSelectedFallbackLocale)
    }
  }, [ selectedLocaleEvents ])

  return (
    <LocalizationContext.Provider
      value={{ locales, selectedLocale, selectedFallbackLocale, systemLocale, ui }}
      >
      {children}
    </LocalizationContext.Provider>
  )
}

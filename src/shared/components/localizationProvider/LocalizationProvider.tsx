import { Locale } from "optolith-database-schema/types/Locale"
import { UI } from "optolith-database-schema/types/UI"
import { useEffect, useState } from "react"
import { LocalizationContext } from "../../contexts/localization.ts"
import { TypedEventEmitterForEvent } from "../../utils/events.ts"
import { FCC } from "../../utils/react.ts"

type Props = {
  selectedLocale: string | undefined
  selectedLocaleEvents: TypedEventEmitterForEvent<"locale-changed", [locale: string | undefined]>
  systemLocale: string
  locales: Record<string, Locale>
  ui: Record<string, UI>
}

export const LocalizationProvider: FCC<Props> = props => {
  const {
    children,
    locales,
    selectedLocale: initialSelectedLocale,
    selectedLocaleEvents,
    systemLocale,
    ui,
  } = props

  const [ selectedLocale, setSelectedLocale ] = useState<string | undefined>(initialSelectedLocale)

  useEffect(() => {
    selectedLocaleEvents.on("locale-changed", setSelectedLocale)

    return () => {
      selectedLocaleEvents.removeListener("locale-changed", setSelectedLocale)
    }
  }, [ selectedLocaleEvents ])

  return (
    <LocalizationContext.Provider value={{ locales, selectedLocale, systemLocale, ui }}>
      {children}
    </LocalizationContext.Provider>
  )
}

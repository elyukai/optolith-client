import { Locale } from "optolith-database-schema/types/Locale"
import { UI } from "optolith-database-schema/types/UI"
import { createContext } from "react"

export type LocalizationContext = {
  selectedLocale: string | undefined
  selectedFallbackLocale: string | undefined
  systemLocale: string
  locales: Record<string, Locale>
  ui: Record<string, UI>
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const LocalizationContext = createContext<LocalizationContext>({
  selectedLocale: undefined,
  selectedFallbackLocale: undefined,
  systemLocale: "en-US",
  locales: {},
  ui: {},
})

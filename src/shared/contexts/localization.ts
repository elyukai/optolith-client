import { createContext } from "react"
import { LocaleEnvironment } from "../utils/locale.ts"

/**
 * The localization context includes selected and default locales as well as
 * available locales and translations.
 */
// eslint-disable-next-line @typescript-eslint/no-redeclare
export const LocalizationContext = createContext<LocaleEnvironment>(
  new LocaleEnvironment({}, "en-US", { locale: undefined, fallbackLocale: undefined }),
)

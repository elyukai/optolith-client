import { Locale } from "optolith-database-schema/types/Locale"
import { UI } from "optolith-database-schema/types/UI"
import { PluralizationCategories } from "optolith-database-schema/types/_I18n"

const insertParams = (str: string, params: (string | number)[]): string =>
  str.replace(
    /\{(?<index>\d+)\}/gu,
    (_match, _p1, _offset, _s, { index: rawIndex }) => {
      const index = Number.parseInt(rawIndex, 10)
      return params[index]?.toString() ?? `{${rawIndex}}`
    }
  )

const matchSystemLocaleToSupported = (available: string[], system: string) => {
  const systemLocale = system.slice(0, 2)
  const matchingLocale = available.find(locale => locale.slice(0, 2) === systemLocale)
  return matchingLocale ?? "en-US"
}

export const createTranslate = (
  translations: Record<string, UI>,
  locales: Record<string, Locale>,
  selectedLocale: string | undefined,
  systemLocale: string,
) => {
  const locale = selectedLocale ?? matchSystemLocaleToSupported(Object.keys(locales), systemLocale)
  const pluralRules = new Intl.PluralRules(locale)

  const translate = <K extends keyof UI>(
    key: K,
    ...options: UI[K] extends PluralizationCategories
      ? [count: number, ...params: (string | number)[]]
      : [...params: (string | number)[]]
  ): string => {
    const value = translations[locale]?.[key] ?? key

    if (typeof value === "object" && typeof options[0] === "number") {
      const [ count, ...params ] = options
      const selectedValue = value[pluralRules.select(count)]
      return selectedValue === undefined
        ? key
        : options.length > 0
        ? insertParams(selectedValue, params)
        : selectedValue
    }
    else {
      const str = typeof value === "string" ? value : key
      return options.length > 0 ? insertParams(str, options) : str
    }
  }

  return translate
}

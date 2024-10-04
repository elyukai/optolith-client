import { Locale } from "optolith-database-schema/types/Locale"
import { UI } from "optolith-database-schema/types/UI"
import { PluralizationCategories, VaryBySystem } from "optolith-database-schema/types/_I18n"
import { LocaleMap } from "optolith-database-schema/types/_LocaleMap"

const insertParams = (str: string, params: (string | number)[]): string =>
  str.replace(/\{(?<index>\d+)\}/gu, (_match, _p1, _offset, _s, { index: rawIndex }) => {
    const index = Number.parseInt(rawIndex, 10)
    return params[index]?.toString() ?? `{${rawIndex}}`
  })

const matchSystemLocaleToSupported = (available: string[], system: string) => {
  const systemLocale = system.slice(0, 2)
  const matchingLocale = available.find(locale => locale.slice(0, 2) === systemLocale)
  return matchingLocale ?? "en-US"
}

/**
 * Translates a given key into a string, optionally with parameters.
 */
export type Translate = <K extends keyof UI>(key: K, ...params: (string | number)[]) => string

const isPluralizationCategories = (
  value: string | PluralizationCategories | VaryBySystem,
): value is PluralizationCategories => typeof value === "object" && "other" in value

const isVaryBySystem = (
  value: string | PluralizationCategories | VaryBySystem,
): value is VaryBySystem => typeof value === "object" && "mac" in value

const pluralType: {
  [K in keyof UI as UI[K] extends PluralizationCategories ? K : never]: Intl.PluralRuleType
} = {
  "{0} Adventure Points": "cardinal",
  "You are missing {0} Adventure Points to do this.": "cardinal",
  "since the {0}. printing": "ordinal",
  "removed in {0}. printing": "ordinal",
  "{0} actions": "cardinal",
  "{0} hours": "cardinal",
  "{0} minutes": "cardinal",
  "{0} rounds": "cardinal",
  "{0} seduction actions": "cardinal",
  ", {0} of which are permanent": "cardinal",
  "{0} centuries": "cardinal",
  "{0} combat rounds": "cardinal",
  "{0} days": "cardinal",
  "{0} months": "cardinal",
  "{0} mos.": "cardinal",
  "{0} seconds": "cardinal",
  "{0} weeks": "cardinal",
  "{0} wks.": "cardinal",
  "{0} years": "cardinal",
  "{0} yrs.": "cardinal",
  "{0} miles": "cardinal",
  "{0} yards": "cardinal",
}

/**
 * Creates a translate function based on the given environment, translations and
 * locales.
 */
export const createTranslate = (
  translations: Record<string, UI>,
  locales: Record<string, Locale>,
  selectedLocale: string | undefined,
  systemLocale: string,
  platform: NodeJS.Platform,
  pluralRulesOptions?: Intl.PluralRulesOptions,
) => {
  const locale = selectedLocale ?? matchSystemLocaleToSupported(Object.keys(locales), systemLocale)
  const cardinalPluralRules = new Intl.PluralRules(locale, {
    ...pluralRulesOptions,
    type: "cardinal",
  })
  const ordinalPluralRules = new Intl.PluralRules(locale, {
    ...pluralRulesOptions,
    type: "ordinal",
  })
  const getPluralRules = (key: keyof UI): Intl.PluralRules => {
    switch (pluralType[key as keyof typeof pluralType]) {
      case "cardinal":
        return cardinalPluralRules
      case "ordinal":
        return ordinalPluralRules
      default:
        return cardinalPluralRules
    }
  }

  const translate: Translate = (key, ...options) => {
    const value = translations[locale]?.[key] ?? key

    if (isVaryBySystem(value)) {
      return platform === "darwin" ? value.mac : platform === "win32" ? value.windows : value.linux
    } else if (isPluralizationCategories(value)) {
      if (typeof options[0] === "number") {
        const [count] = options
        const selectedValue = value[getPluralRules(key).select(count)] ?? value.other
        return insertParams(selectedValue, options)
      } else {
        return insertParams(value.other, options)
      }
    } else {
      const str = typeof value === "string" ? value : key
      return options.length > 0 ? insertParams(str, options) : str
    }
  }

  return translate
}

/**
 * A mocked translate function.
 */
export const translateMock: Translate = <K extends keyof UI>(
  key: K,
  ...options: (string | number)[]
) => insertParams(key, options)

/**
 * Selects a value from a locale dictionary based on the selected locale.
 */
export type TranslateMap = <T>(map: LocaleMap<T> | undefined) => T | undefined

/**
 * Creates a function that selects a value from a locale dictionary based on the
 * given environment, translations and locales.
 */
export const createTranslateMap = (
  locales: Record<string, Locale>,
  selectedLocale: string | undefined,
  fallbackLocale: string | undefined,
  systemLocale: string,
) => {
  const mainLocale =
    selectedLocale ?? matchSystemLocaleToSupported(Object.keys(locales), systemLocale)

  const translateMap: TranslateMap = map =>
    map?.[mainLocale] ?? (fallbackLocale === undefined ? undefined : map?.[fallbackLocale])

  return translateMap
}

const byteTags = ["", "K", "M", "G", "T"]

const foldByteLevels = (index: number, value: number): [number, number] =>
  index < byteTags.length - 1 && value > 1023
    ? foldByteLevels(index + 1, value / 1024)
    : [index, value]

/**
 * `bytify :: String -> Int -> String`
 *
 * `bytify id value` returns a string representation of `value`, the amount of
 * bytes, based on the locale specified by `id`. It reduces the value to KB, MB
 * etc so its readable.
 *
 * Examples:
 *
 * ```haskell
 * bytify "de-DE" 1234567 == "1,2 MB"
 * bytify "en-US" 1234567 == "1.2 MB"
 * bytify "en-US" 1024 == "1 KB"
 * bytify "de-DE" 0 == "0 B"
 * ```
 */
export const bytify = (value: number, selectedLocale: string | undefined, systemLocale: string) => {
  const [index, categorizedValue] = foldByteLevels(0, value)
  const rounded = Math.round(categorizedValue * 10) / 10
  const localizedNumber = rounded.toLocaleString(selectedLocale ?? systemLocale)

  return `${localizedNumber} ${byteTags[index] ?? ""}B`
}

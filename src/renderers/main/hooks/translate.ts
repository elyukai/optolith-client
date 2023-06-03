import { UI } from "optolith-database-schema/types/UI"
import { PluralizationCategories } from "optolith-database-schema/types/_I18n"
import { useMemo } from "react"
import { selectLocale } from "../slices/settingsSlice.ts"
import { useAppSelector } from "./redux.ts"

const insertParams = (str: string, params: (string | number)[]): string =>
  str.replace(
    /\{(?<index>\d+)\}/gu,
    (_match, _p1, _offset, _s, { index: rawIndex }) => {
      const index = Number.parseInt(rawIndex, 10)
      return params[index]?.toString() ?? `{${rawIndex}}`
    }
  )

export const useTranslate = () => {
  const translations = useAppSelector(state => state.database.ui)
  const locale = useAppSelector(selectLocale)

  const pluralRules = useMemo(() => new Intl.PluralRules(locale), [ locale ])

  const translate = <K extends keyof UI>(
    key: K,
    ...options: UI[K] extends PluralizationCategories
      ? [count: number, ...params: (string | number)[]]
      : [...params: (string | number)[]]
  ): string => {
    const value = translations[locale]?.[key]

    if (typeof value === "string") {
      return options.length > 0 ? insertParams(value, options) : value
    }
    else if (typeof value === "object" && typeof options[0] === "number") {
      const [ count, ...params ] = options
      const selectedValue = value[pluralRules.select(count)]
      return selectedValue === undefined
        ? key
        : options.length > 0
        ? insertParams(selectedValue, params)
        : selectedValue
    }
    else {
      return key
    }
  }

  return translate
}

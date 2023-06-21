import { useMemo } from "react"
import { ExternalAPI } from "../external.ts"
import { selectLocale } from "../slices/settingsSlice.ts"
import { useAppSelector } from "./redux.ts"

export const usePluralRules = (options?: Intl.PluralRulesOptions): Intl.PluralRules => {
  const locale = useAppSelector(selectLocale)
  return useMemo(
    () => new Intl.PluralRules(locale ?? ExternalAPI.systemLocale, {
      localeMatcher: options?.localeMatcher,
      type: options?.type,
      minimumIntegerDigits: options?.minimumIntegerDigits,
      minimumFractionDigits: options?.minimumFractionDigits,
      maximumFractionDigits: options?.maximumFractionDigits,
      minimumSignificantDigits: options?.minimumSignificantDigits,
      maximumSignificantDigits: options?.maximumSignificantDigits,
    }),
    [
      locale,
      options?.localeMatcher,
      options?.maximumFractionDigits,
      options?.maximumSignificantDigits,
      options?.minimumFractionDigits,
      options?.minimumIntegerDigits,
      options?.minimumSignificantDigits,
      options?.type,
    ]
  )
}

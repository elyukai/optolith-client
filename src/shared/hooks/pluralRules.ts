import { useContext, useMemo } from "react"
import { LocalizationContext } from "../contexts/localization.ts"

export const usePluralRules = (options?: Intl.PluralRulesOptions): Intl.PluralRules => {
  const localizationContext = useContext(LocalizationContext)
  return useMemo(
    () =>
      new Intl.PluralRules(localizationContext.selectedLocale ?? localizationContext.systemLocale, {
        localeMatcher: options?.localeMatcher,
        type: options?.type,
        minimumIntegerDigits: options?.minimumIntegerDigits,
        minimumFractionDigits: options?.minimumFractionDigits,
        maximumFractionDigits: options?.maximumFractionDigits,
        minimumSignificantDigits: options?.minimumSignificantDigits,
        maximumSignificantDigits: options?.maximumSignificantDigits,
      }),
    [
      localizationContext.selectedLocale,
      localizationContext.systemLocale,
      options?.localeMatcher,
      options?.maximumFractionDigits,
      options?.maximumSignificantDigits,
      options?.minimumFractionDigits,
      options?.minimumIntegerDigits,
      options?.minimumSignificantDigits,
      options?.type,
    ],
  )
}

import { LocaleMap } from "optolith-database-schema/types/_LocaleMap"
import { useContext, useMemo } from "react"
import { LocalizationContext } from "../contexts/localization.ts"

export type TranslateMap = <T>(map: LocaleMap<T> | undefined) => T | undefined

export const useTranslateMap = () => {
  const localizationContext = useContext(LocalizationContext)

  const _translateMap = useMemo(() => {
    const translateMap: TranslateMap = map =>
      map?.[localizationContext.selectedLocale ?? localizationContext.systemLocale]
    return translateMap
  }, [ localizationContext.selectedLocale, localizationContext.systemLocale ])

  return _translateMap
}

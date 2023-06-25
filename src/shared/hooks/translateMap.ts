import { useContext, useMemo } from "react"
import { LocalizationContext } from "../contexts/localization.ts"
import { createTranslateMap } from "../utils/translate.ts"

export const useTranslateMap = () => {
  const localizationContext = useContext(LocalizationContext)

  const _translateMap = useMemo(
    () => createTranslateMap(
      localizationContext.locales,
      localizationContext.selectedLocale,
      localizationContext.selectedFallbackLocale,
      localizationContext.systemLocale,
    ),
    [
      localizationContext.locales,
      localizationContext.selectedLocale,
      localizationContext.selectedFallbackLocale,
      localizationContext.systemLocale,
    ]
  )

  return _translateMap
}

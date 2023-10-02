import { useContext, useMemo } from "react"
import { LocalizationContext } from "../contexts/localization.ts"
import { createTranslateMap } from "../utils/translate.ts"

/**
 * A hook that returns a function that selects a value from a locale dictionary
 * for the current localization context.
 */
export const useTranslateMap = () => {
  const localizationContext = useContext(LocalizationContext)

  const _translateMap = useMemo(
    () =>
      createTranslateMap(
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
    ],
  )

  return _translateMap
}

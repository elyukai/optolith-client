import { useContext, useMemo } from "react"
import { LocalizationContext } from "../contexts/localization.ts"
import { createTranslate } from "../utils/translate.ts"

/**
 * A hook that returns a translate function for the current localization
 * context.
 */
export const useTranslate = () => {
  const localizationContext = useContext(LocalizationContext)

  const _translate = useMemo(
    () =>
      createTranslate(
        localizationContext.ui,
        localizationContext.locales,
        localizationContext.selectedLocale,
        localizationContext.systemLocale,
      ),
    [
      localizationContext.locales,
      localizationContext.selectedLocale,
      localizationContext.systemLocale,
      localizationContext.ui,
    ],
  )

  return _translate
}

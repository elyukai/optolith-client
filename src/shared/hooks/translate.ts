import { useContext, useMemo } from "react"
import { LocalizationContext } from "../contexts/localization.ts"
import { createTranslate } from "../utils/translate.ts"

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

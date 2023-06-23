import { useContext, useMemo } from "react"
import { LocalizationContext } from "../contexts/localization.ts"

export const useLocaleCompare = () => {
  const localizationContext = useContext(LocalizationContext)
  const collator = useMemo(
    () => new Intl.Collator(
      localizationContext.selectedLocale ?? localizationContext.systemLocale,
      { numeric: true }
    ),
    [ localizationContext.selectedLocale, localizationContext.systemLocale ]
  )
  return collator.compare
}

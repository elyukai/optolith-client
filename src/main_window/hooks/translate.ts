import { useMemo } from "react"
import { createTranslate } from "../../shared/utils/translate.ts"
import { ExternalAPI } from "../external.ts"
import { selectLocale } from "../slices/settingsSlice.ts"
import { useAppSelector } from "./redux.ts"

export const useTranslate = () => {
  const translations = useAppSelector(state => state.database.ui)
  const locales = useAppSelector(state => state.database.locales)
  const locale = useAppSelector(selectLocale)

  const _translate = useMemo(
    () => createTranslate(
      translations,
      locales,
      locale,
      ExternalAPI.systemLocale
    ),
    [ locale, locales, translations ]
  )

  return _translate
}

import { LocaleMap } from "optolith-database-schema/types/_LocaleMap"
import { selectLocale } from "../slices/settingsSlice.ts"
import { useAppSelector } from "./redux.ts"

export const useTranslateMap = () => {
  const locale = useAppSelector(selectLocale)

  const translateMap = <T>(map: LocaleMap<T>): T | undefined => map[locale]

  return translateMap
}

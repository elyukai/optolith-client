import { LocaleMap } from "optolith-database-schema/types/_LocaleMap"
import { useMemo } from "react"
import { ExternalAPI } from "../external.ts"
import { selectLocale } from "../slices/settingsSlice.ts"
import { useAppSelector } from "./redux.ts"

export type TranslateMap = <T>(map: LocaleMap<T> | undefined) => T | undefined

export const useTranslateMap = () => {
  const locale = useAppSelector(selectLocale)

  const _translateMap = useMemo(() => {
    const translateMap: TranslateMap = map => map?.[locale ?? ExternalAPI.systemLocale]
    return translateMap
  }, [ locale ])

  return _translateMap
}

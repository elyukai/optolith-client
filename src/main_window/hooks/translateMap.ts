import { LocaleMap } from "optolith-database-schema/types/_LocaleMap"
import { useMemo } from "react"
import { ExternalAPI } from "../external.ts"
import { selectLocale } from "../slices/settingsSlice.ts"
import { useAppSelector } from "./redux.ts"

export const useTranslateMap = () => {
  const locale = useAppSelector(selectLocale)

  const _translateMap = useMemo(() => {
    const translateMap = <T>(map: LocaleMap<T> | undefined): T | undefined =>
      map?.[locale ?? ExternalAPI.systemLocale]
    return translateMap
  }, [ locale ])

  return _translateMap
}

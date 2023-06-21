import { useMemo } from "react"
import { selectLocale } from "../slices/settingsSlice.ts"
import { useAppSelector } from "./redux.ts"

export const useLocaleCompare = () => {
  const locale = useAppSelector(selectLocale)
  const collator = useMemo(() => new Intl.Collator(locale, { numeric: true }), [ locale ])
  return collator.compare
}

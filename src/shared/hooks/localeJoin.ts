import { useContext } from "react"
import { LocalizationContext } from "../contexts/localization.ts"

/**
 * A hook that returns a cached {@link Intl.ListFormat} instance for the current
 * localization context.
 */
export const useLocaleJoin = () => useContext(LocalizationContext).join

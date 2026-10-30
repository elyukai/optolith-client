import { useContext } from "react"
import { LocalizationContext } from "../contexts/localization.ts"

/**
 * A hook that returns a cached {@link Intl.Collator} instance for the current
 * localization context.
 */
export const useLocaleCompare = () => useContext(LocalizationContext).compare

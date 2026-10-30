import { useContext } from "react"
import { LocalizationContext } from "../contexts/localization.ts"

/**
 * A hook that returns a function that selects a value from a locale dictionary
 * for the current localization context.
 */
export const useTranslateMap = () => useContext(LocalizationContext).translateMap

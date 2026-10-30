import { useContext } from "react"
import { LocalizationContext } from "../contexts/localization.ts"
import type { Translate } from "../utils/locale.ts"

/**
 * A hook that returns a translate function for the current localization
 * context.
 */
export const useTranslate = (): Translate => useContext(LocalizationContext).translate

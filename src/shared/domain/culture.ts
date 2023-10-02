import { Culture } from "optolith-database-schema/types/Culture"
import { TranslateMap } from "../utils/translate.ts"

/**
 * Returns a culture by id.
 */
export const getCulture = (cultures: Record<number, Culture>, id: number): Culture | undefined =>
  cultures[id]

/**
 * Returns the full name of a culture.
 */
export const getFullCultureName = (translateMap: TranslateMap, culture: Culture): string =>
  translateMap(culture.translations)?.name ?? ""

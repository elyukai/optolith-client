import { Culture } from "optolith-database-schema/types/Culture"
import { TranslateMap } from "../utils/translate.ts"

export const getCulture = (cultures: Record<number, Culture>, id: number): Culture | undefined =>
  cultures[id]

export const getFullCultureName = (translateMap: TranslateMap, culture: Culture): string =>
  translateMap(culture.translations)?.name ?? ""

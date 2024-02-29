import { Culture } from "optolith-database-schema/types/Culture"
import { ActivatableIdentifier } from "optolith-database-schema/types/_IdentifierGroup"
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

/**
 * A dependency on a culture.
 */
export type CultureDependency = Readonly<{
  /**
   * The identifier of the dependency source.
   */
  sourceId: ActivatableIdentifier

  /**
   * The top-level index of the prerequisite. If the prerequisite is part of a
   * group or disjunction, this is the index of the group or disjunction.
   */
  index: number

  /**
   * Is the source prerequisite part of a prerequisite disjunction?
   */
  isPartOfDisjunction: boolean

  /**
   * The required culture's identifier.
   */
  id: number
}>

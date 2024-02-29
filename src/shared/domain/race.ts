import { Race, RaceVariant } from "optolith-database-schema/types/Race"
import { ActivatableIdentifier } from "optolith-database-schema/types/_IdentifierGroup"
import { mapNullableDefault } from "../utils/nullable.ts"
import { TranslateMap } from "../utils/translate.ts"

/**
 * Gets a race by id.
 */
export const getRace = (races: Record<number, Race>, id: number): Race | undefined => races[id]

/**
 * Gets a race variant by id, if any.
 */
export const getRaceVariant = (race: Race, id: number | undefined): RaceVariant | undefined =>
  id === undefined ? undefined : race.variants.find(variant => variant.id === id)

/**
 * Creates the full race name for the given race and optional race variant.
 */
export const getFullRaceName = (
  translateMap: TranslateMap,
  race: Race,
  raceVariant?: RaceVariant,
): string =>
  `${translateMap(race.translations)?.name ?? ""}${mapNullableDefault(
    translateMap(raceVariant?.translations)?.name,
    str => ` (${str})`,
    "",
  )}`

/**
 * A dependency on a race.
 */
export type RaceDependency = Readonly<{
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
   * The required race's identifier.
   */
  id: number

  /**
   * Whether the required race is required to be active or inactive.
   */
  active: boolean
}>

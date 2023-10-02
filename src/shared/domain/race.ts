import { Race, RaceVariant } from "optolith-database-schema/types/Race"
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

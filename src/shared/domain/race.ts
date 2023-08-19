import { Race, RaceVariant } from "optolith-database-schema/types/Race"
import { mapNullableDefault } from "../utils/nullable.ts"
import { TranslateMap } from "../utils/translate.ts"

export const getRace = (races: Record<number, Race>, id: number): Race | undefined => races[id]

export const getRaceVariant = (race: Race, id: number | undefined): RaceVariant | undefined =>
  id === undefined ? undefined : race.variants.find(variant => variant.id === id)

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

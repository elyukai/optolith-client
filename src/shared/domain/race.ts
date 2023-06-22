import { Race, RaceVariant } from "optolith-database-schema/types/Race"
import { TranslateMap } from "../../main_window/hooks/translateMap.ts"
import { mapNullableDefault } from "../utils/nullable.ts"

export const getRace = (
  races: Record<number, Race>,
  id: number,
): Race | undefined => races[id]

export const getRaceVariant = (
  race: Race,
  id: number | undefined,
): RaceVariant | undefined =>
  id === undefined || race.variant_dependent.tag !== "HasVariants"
  ? undefined
  : race.variant_dependent.has_variants.find(variant => variant.id === id)

export const getFullRaceName = (
  translateMap: TranslateMap,
  race: Race,
  raceVariant?: RaceVariant,
): string =>
  `${translateMap(race.translations)?.name ?? ""}${
    mapNullableDefault(
      translateMap(raceVariant?.translations)?.name,
      str => ` (${str})`,
      ""
    )
  }`

import { ensureNonEmpty } from "@elyukai/utils/array/nonEmpty"
import { on } from "@elyukai/utils/function"
import { isNotNullish, mapNullableDefault } from "@elyukai/utils/nullable"
import type { Compare } from "@elyukai/utils/ordering"
import { renderActivatableNameChunk } from "@optolith/entity-descriptions/entities/partial/activatableNameChunks"
import type { TranslateMap } from "../../utils/locale.ts"
import type {
  CharacterActivatable,
  DisplayedActiveActivatable,
  DisplayedInactiveActivatable,
} from "./activatable.ts"

/**
 * Filters and sorts the displayed advantages or disadvantages.
 */
export const filterAndSortDisplayed = <
  T extends
    | DisplayedInactiveActivatable<"Advantage" | "Disadvantage">
    | DisplayedActiveActivatable<"Advantage" | "Disadvantage">,
>(
  visibleDisAdvantages: T[],
  filterText: string,
  showEntriesWithoutMetPrerequisites: boolean,
  translateMap: TranslateMap,
  localeCompare: Compare<string>,
) => {
  const getName = (c: T): string =>
    typeof c.name === "string" ? c.name : renderActivatableNameChunk(translateMap, c.name.full)

  const filters = ensureNonEmpty(
    [
      filterText === ""
        ? undefined
        : (c: T) => getName(c).toLowerCase().includes(filterText.toLowerCase()) ?? false,
      showEntriesWithoutMetPrerequisites ? undefined : (c: T) => c.active || c.isAvailable,
    ].filter(isNotNullish),
  )

  return (
    filters === undefined
      ? visibleDisAdvantages
      : visibleDisAdvantages.filter(entry => filters.every(filter => filter(entry)))
  ).toSorted(on(getName, localeCompare))
}

/**
 * The maximum number of adventure points that can be spent for advantages and
 * disadvantages.
 */
export const maximumAdventurePointsForAdventagesAndDisadvantages = 80

/**
 * Returns the maximum number of adventure points that can be spent for magical
 * advantages and disadvantages.
 */
export const getMaximumAdventurePointsForMagicalAdvantagesAndDisadvantages = (
  activeMagicalTraditions: CharacterActivatable<"MagicalTradition">[],
): number =>
  activeMagicalTraditions.reduce(
    (currentMax, tradition) =>
      mapNullableDefault(
        tradition.dbEntry.alternative_magical_adventure_points_maximum,
        altMax => Math.min(altMax, currentMax),
        currentMax,
      ),
    50,
  )

/**
 * The maximum number of adventure points that can be spent for blessed
 * advantages and disadvantages.
 */
export const maximumAdventurePointsForBlessedAdventagesAndDisadvantages = 50

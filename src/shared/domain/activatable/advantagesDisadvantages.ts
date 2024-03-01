import { Advantage } from "optolith-database-schema/types/Advantage"
import { Disadvantage } from "optolith-database-schema/types/Disadvantage"
import { MagicalTradition } from "optolith-database-schema/types/specialAbility/MagicalTradition"
import { Compare, compareAt } from "../../utils/compare.ts"
import { mapNullableDefault } from "../../utils/nullable.ts"
import { TranslateMap } from "../../utils/translate.ts"
import { DisplayedActiveActivatable } from "./activatableActive.ts"
import { DisplayedInactiveActivatable } from "./activatableInactive.ts"

/**
 * Filters and sorts the displayed advantages or disadvantages.
 */
export const filterAndSortDisplayed = <
  T extends
    | DisplayedInactiveActivatable<"Advantage", Advantage>
    | DisplayedInactiveActivatable<"Disadvantage", Disadvantage>
    | DisplayedActiveActivatable<"Advantage", Advantage>
    | DisplayedActiveActivatable<"Disadvantage", Disadvantage>,
>(
  visibleDisAdvantages: T[],
  filterText: string,
  translateMap: TranslateMap,
  localeCompare: Compare<string>,
) => {
  const getName = (c: T) => translateMap(c.static.translations)?.name ?? ""
  return (
    filterText === ""
      ? visibleDisAdvantages
      : visibleDisAdvantages.filter(
          c => getName(c).toLowerCase().includes(filterText.toLowerCase()) ?? false,
        )
  ).sort(compareAt(getName, localeCompare))
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
  activeMagicalTraditions: MagicalTradition[],
): number =>
  activeMagicalTraditions.reduce(
    (currentMax, tradition) =>
      mapNullableDefault(
        tradition.alternative_magical_adventure_points_maximum,
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

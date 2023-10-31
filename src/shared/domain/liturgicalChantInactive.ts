import { Blessing } from "optolith-database-schema/types/Blessing"
import { Ceremony } from "optolith-database-schema/types/Ceremony"
import { LiturgicalChant } from "optolith-database-schema/types/LiturgicalChant"
import { BlessingReference } from "optolith-database-schema/types/_SimpleReferences"
import { PublicationRefs } from "optolith-database-schema/types/source/_PublicationRef"
import { assertExhaustive } from "../utils/typeSafety.ts"
import { Activatable, isActive } from "./activatableEntry.ts"
import {
  ImprovementCost,
  compareImprovementCost,
  fromRaw,
} from "./adventurePoints/improvementCost.ts"
import { CombinedActiveBlessedTradition } from "./blessedTradition.ts"
import { BlessedTraditionIdentifier } from "./identifier.ts"
import { anyBlessedTradition, belongsToBlessedTradition } from "./liturgicalChant.ts"
import {
  ActivatableRatedWithEnhancements,
  ActivatableRatedWithEnhancementsMap,
  isOptionalRatedWithEnhancementsActive,
} from "./ratedEntry.ts"

/**
 * A static inactive blessing for combination with other types.
 */
export type DisplayedInactiveBlessing = {
  kind: "blessing"
  static: Blessing
}

/**
 * A combination of a static and corresponding dynamic inactive liturgical chant
 * entry, extended by whether the entry can be activated.
 */
export type DisplayedInactiveLiturgicalChant = {
  kind: "liturgicalChant"
  static: LiturgicalChant
  dynamic: ActivatableRatedWithEnhancements | undefined
  isAvailable: boolean
}

/**
 * A combination of a static and corresponding dynamic inactive ceremony entry,
 * extended by whether the entry can be activated.
 */
export type DisplayedInactiveCeremony = {
  kind: "ceremony"
  static: Ceremony
  dynamic: ActivatableRatedWithEnhancements | undefined
  isAvailable: boolean
}

/**
 * A union of all displayed inactive liturgy kinds.
 */
export type DisplayedInactiveLiturgy =
  | DisplayedInactiveBlessing
  | DisplayedInactiveLiturgicalChant
  | DisplayedInactiveCeremony

/**
 * Filters the given list of inactive blessings by tradition restrictions.
 */
export const filterInactiveBlessings = (
  visibleBlessings: DisplayedInactiveBlessing[],
  activeTradition: CombinedActiveBlessedTradition,
): DisplayedInactiveBlessing[] => {
  const restrictedBlessings = ((): BlessingReference[] => {
    switch (activeTradition.static.restricted_blessings?.tag) {
      case "Six":
        return activeTradition.static.restricted_blessings.six
      case "Three":
        return activeTradition.static.restricted_blessings.three
      case undefined:
        return []
      default:
        return assertExhaustive(activeTradition.static.restricted_blessings)
    }
  })().map(ref => ref.id.blessing)

  if (restrictedBlessings.length === 0) {
    return visibleBlessings
  }

  return visibleBlessings.filter(blessing => !restrictedBlessings.includes(blessing.static.id))
}

/**
 * Returns all liturgical chants or ceremonies with their corresponding dynamic
 * entries, extended by whether the entry can be activated.
 *
 * If parameters are documented as counting for liturgical chants **or**
 * ceremonies, the argument should count for whether liturgical chants or
 * ceremonies are returned.
 * @param kind The value for the `kind` property.
 * @param staticLiturgicalChants A map of static liturgical chants or
 * ceremonies.
 * @param dynamicLiturgicalChants A map of dynamic liturgical chants or
 * ceremonies.
 * @param activeBlessedTradition The active blessed tradition.
 * @param isMaximumCountReached Whether the maximum count of liturgical chants
 * or ceremonies based on the experience level is reached. It is always `false`
 * if the experience level does not have any effect anymore.
 * @param birdsOfPassage The dynamic *Birds of Passage* entry, if present.
 * @param huntressesOfTheWhiteMaiden The dynamic *Huntresses of the White
 * Maiden* entry, if present.
 * @param followersOfTheGoldenOne The dynamic *Followers of the Golden One*
 * entry, if present.
 * @param isEntryAvailable A function that checks whether a liturgical chant or
 * ceremony is available based on the active publications.
 * @param activeUnfamiliarLiturgicalChantsCount The number of active liturgical
 * chants or ceremonies that belong to a blessed tradition that is not the
 * active one, by tradition.
 * @param activeUnfamiliarLiturgicalChantsAndCeremoniesCount The number of
 * active liturgical chants and ceremonies that belong to a blessed tradition
 * that is not the active one, by tradition.
 * @param unfamiliarTraditionsWithHighestActiveCount A list of blessed tradition
 * identifiers that have the highest number of active liturgical chants and
 * ceremonies (i.e. there are multiple values if the count is the same for
 * multiple traditions).
 */
export const getInactiveLiturgicalChantsOrCeremonies = <
  K extends string,
  T extends LiturgicalChant | Ceremony,
>(
  kind: K,
  staticLiturgicalChants: Record<number, T>,
  dynamicLiturgicalChants: ActivatableRatedWithEnhancementsMap,
  activeBlessedTradition: CombinedActiveBlessedTradition,
  isMaximumCountReached: boolean,
  birdsOfPassage: Activatable | undefined,
  huntressesOfTheWhiteMaiden: Activatable | undefined,
  followersOfTheGoldenOne: Activatable | undefined,
  isEntryAvailable: (src: PublicationRefs) => boolean,
  activeUnfamiliarLiturgicalChantsCount: Record<number, number>,
  activeUnfamiliarLiturgicalChantsAndCeremoniesCount: Record<number, number>,
  unfamiliarTraditionsWithHighestActiveCount: number[],
): {
  kind: K
  static: T
  dynamic: ActivatableRatedWithEnhancements | undefined
  isAvailable: boolean
}[] => {
  const checkAdditionalUnlocked: (staticLiturgicalChant: T) => boolean = (() => {
    if (isActive(birdsOfPassage)) {
      const phexCount =
        activeUnfamiliarLiturgicalChantsAndCeremoniesCount[BlessedTraditionIdentifier.Phex] ?? 0

      const rahjaCount =
        activeUnfamiliarLiturgicalChantsAndCeremoniesCount[BlessedTraditionIdentifier.Rahja] ?? 0

      return ({ traditions, improvement_cost }) =>
        (phexCount === 0 &&
          anyBlessedTradition(
            traditions,
            tradition => tradition === BlessedTraditionIdentifier.Phex,
          ) &&
          compareImprovementCost(fromRaw(improvement_cost), ImprovementCost.C) <= 0) ||
        (rahjaCount === 0 &&
          anyBlessedTradition(
            traditions,
            tradition => tradition === BlessedTraditionIdentifier.Rahja,
          ) &&
          compareImprovementCost(fromRaw(improvement_cost), ImprovementCost.C) <= 0)
    }

    if (isActive(huntressesOfTheWhiteMaiden)) {
      // This checks for either liturgical chants or ceremonies, depending on
      // context the function is used in.
      const firunLiturgicalChantCount =
        activeUnfamiliarLiturgicalChantsCount[BlessedTraditionIdentifier.Firun] ?? 0

      return ({ traditions, improvement_cost }) =>
        firunLiturgicalChantCount === 0 &&
        anyBlessedTradition(
          traditions,
          tradition => tradition === BlessedTraditionIdentifier.Firun,
        ) &&
        compareImprovementCost(fromRaw(improvement_cost), ImprovementCost.C) <= 0
    }

    if (isActive(followersOfTheGoldenOne)) {
      return ({ traditions, improvement_cost }) =>
        (Object.keys(activeUnfamiliarLiturgicalChantsAndCeremoniesCount).length === 0 ||
          anyBlessedTradition(traditions, tradition =>
            unfamiliarTraditionsWithHighestActiveCount.includes(tradition),
          )) &&
        compareImprovementCost(fromRaw(improvement_cost), ImprovementCost.B) <= 0
    }

    return _ => false
  })()

  return Object.values(staticLiturgicalChants)
    .filter(
      staticLiturgicalChant =>
        isEntryAvailable(staticLiturgicalChant.src) &&
        !isOptionalRatedWithEnhancementsActive(dynamicLiturgicalChants[staticLiturgicalChant.id]) &&
        (belongsToBlessedTradition(
          staticLiturgicalChant.traditions,
          activeBlessedTradition.static,
        ) ||
          checkAdditionalUnlocked(staticLiturgicalChant)),
    )
    .map(staticLiturgicalChant => {
      const dynamicLiturgicalChant = dynamicLiturgicalChants[staticLiturgicalChant.id]

      return {
        kind,
        static: staticLiturgicalChant,
        dynamic: dynamicLiturgicalChant,
        isAvailable: !isMaximumCountReached,
      }
    })
}

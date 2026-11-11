// /**
//  * This file provides combining functions for displaying `Activatable`
//  * entries.
//  * @file src/Utilities/activatableActiveUtils.ts
//  * @author Lukas Obermann
//  * @since 1.1.0
//  */

import type { RangeBounds } from "@elyukai/utils/range"
import { assertExhaustive } from "@elyukai/utils/typeSafety"
import type {
  ActivatableNameChunk,
  ActivatableNameComponents,
} from "@optolith/entity-descriptions/entities/partial/activatableNameChunks"

// const isStyleSpecialAbilityRemovalDisabled =
//   (hero: HeroModelRecord) =>
//   (wiki_entry: Activatable): boolean =>
//     SpecialAbility.is(wiki_entry) && !isStyleValidToRemove(hero)(Just(wiki_entry))

/**
 * The cost of an activatable instance. It may be fix or varies depending on
 * other instances.
 */
export type DisplayedActiveActivatableCost =
  | { type: "Fixed"; isAutomatic: boolean; value: number }
  | {
      type: "Range"
      isAutomatic: boolean
      min: number
      max: number
      total: number
      diffWhenRemoved: number
    }

/**
 * Returns the cost difference when removing the instance.
 */
export const getCostDifferenceOnRemove = (cost: DisplayedActiveActivatableCost): number => {
  switch (cost.type) {
    case "Fixed":
      return cost.value
    case "Range":
      return cost.diffWhenRemoved
    default:
      return assertExhaustive(cost)
  }
}

/**
 * This instance has a fix AP value.
 */
export type DisplayedFixActiveActivatableCost = {
  kind: "fix"
  fix: number
}

/**
 * This instance does not have a fix AP value. Its AP value depends on other
 * instances. This way, the AP value of this instance may change when other
 * instances are removed or added.
 */
export type DisplayedVariableActiveActivatableCost = {
  kind: "variable"
  instancesTotal: number
  range: RangeBounds
  differenceOnRemove: number
}

/**
 * Returns the full name of the activatable entry as well as its components.
 */
export type ActivatableNameComponentsWithFull = ActivatableNameComponents & {
  full: ActivatableNameChunk
  fullWithoutLevel: [ActivatableNameChunk, ActivatableNameChunk?]
}

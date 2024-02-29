import { range } from "../../utils/array.ts"
import {
  AdventurePointsCache,
  addAdventurePointsCaches,
  emptyAdventurePointsCache,
} from "./cache.ts"
import { ImprovementCost, adventurePointsForIncrement } from "./improvementCost.ts"

/**
 * Bound adventure points are granted by the GM and can only be spent on the
 * entry. They don’t effect the costs of the rating at the time of granting, so
 * the rating at which they have been granted is stored as well.
 */
export type BoundAdventurePointsForRated = {
  /**
   * The rating at which they have been granted. If the adventure points have
   * been granted when the entry was not active yet, the rating is `undefined`.
   */
  rating: number | undefined

  /**
   * The granted adventure points.
   */
  adventurePoints: number
}

const groupBoundAdventurePointsByRating = (
  boundAdventurePoints: BoundAdventurePointsForRated[],
): ReadonlyMap<number | "activation", number> =>
  boundAdventurePoints.reduce((map, { rating: boundRating, adventurePoints }) => {
    const key = boundRating ?? "activation"
    return map.set(key, (map.get(key) ?? 0) + adventurePoints)
  }, new Map<number | "activation", number>())

const accumulateCache = (
  startValue: number,
  endValue: number,
  initialApplicableBoundKey: number | "activation",
  boundByValue: ReadonlyMap<number | "activation", number>,
  ic: ImprovementCost,
): AdventurePointsCache => {
  const { usedGeneral, usedBound } = range(startValue, endValue).reduce(
    (acc, currentValue) => {
      const costForStep = adventurePointsForIncrement(ic, currentValue - 1)
      const usedBoundForStep = Math.min(costForStep, acc.remainingApplicableBound)
      const usedGeneralForStep = costForStep - usedBoundForStep

      const newRemainingBound =
        acc.remainingApplicableBound - usedBoundForStep + (boundByValue.get(currentValue) ?? 0)

      return {
        usedGeneral: acc.usedGeneral + usedGeneralForStep,
        usedBound: acc.usedBound + usedBoundForStep,
        remainingApplicableBound: newRemainingBound,
      }
    },
    {
      usedGeneral: 0,
      usedBound: 0,
      remainingApplicableBound: boundByValue.get(initialApplicableBoundKey) ?? 0,
    },
  )

  return {
    general: usedGeneral,
    bound: usedBound,
  }
}

/**
 * Calculates the accumulated used adventure points value for a rated entry. It
 * takes into account the minimum value if it’s always active, bound adventure
 * points and the improvement cost of the entry.
 */
export const cachedAdventurePoints = (
  value: number,
  minValue: number,
  boundAdventurePoints: BoundAdventurePointsForRated[],
  ic: ImprovementCost,
): AdventurePointsCache => {
  if (minValue >= value) {
    return emptyAdventurePointsCache
  } else {
    const boundByValue = groupBoundAdventurePointsByRating(boundAdventurePoints)
    return accumulateCache(minValue + 1, value, minValue, boundByValue, ic)
  }
}

/**
 * Calculates the accumulated used adventure points value for an activatable
 * rated entry. It takes into account the minimum value if it’s always active,
 * bound adventure points and the improvement cost of the entry.
 */
export const cachedAdventurePointsForActivatable = (
  value: number | undefined,
  boundAdventurePoints: BoundAdventurePointsForRated[],
  ic: ImprovementCost,
): AdventurePointsCache => {
  if (value === undefined) {
    return emptyAdventurePointsCache
  } else {
    const boundByValue = groupBoundAdventurePointsByRating(boundAdventurePoints)
    return accumulateCache(0, value, "activation", boundByValue, ic)
  }
}

/**
 * Calculates the accumulated used adventure points value for an activatable
 * rated entry that has enhancements. It takes into account the minimum value if
 * it’s always active, bound adventure points and the improvement cost of the
 * entry.
 */
export const cachedAdventurePointsForActivatableWithEnhancements = (
  value: number | undefined,
  boundAdventurePoints: BoundAdventurePointsForRated[],
  ic: ImprovementCost,
  enhancements: number[],
  getAdventurePointsModifierForEnhancement: (enhancementId: number) => number,
): AdventurePointsCache => {
  if (value === undefined) {
    return emptyAdventurePointsCache
  } else {
    const boundByValue = groupBoundAdventurePointsByRating(boundAdventurePoints)
    const enhancementAdventurePoints = enhancements.reduce(
      (acc, enhancementId) => acc + getAdventurePointsModifierForEnhancement(enhancementId),
      0,
    )
    return addAdventurePointsCaches(accumulateCache(0, value, "activation", boundByValue, ic), {
      general: enhancementAdventurePoints,
      bound: 0,
    })
  }
}

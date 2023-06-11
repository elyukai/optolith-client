import { ActivatableIdentifier, SkillWithEnhancementsIdentifier } from "optolith-database-schema/types/_IdentifierGroup"
import { ImprovementCost } from "./adventurePoints/improvementCost.ts"
import { BoundAdventurePoints, RatedAdventurePointsCache, cachedAdventurePoints, cachedAdventurePointsForActivatable } from "./adventurePoints/ratedEntry.ts"
import { Enhancement } from "./enhancement.ts"

/**
 * A required value from a prerequisite. Can either require a minimum or a
 * maximum value.
 */
export type ValueRestriction =
  | {
    tag: "Minimum"
    minimum: number
  }
  | {
    tag: "Maximum"
    maximum: number
  }

/**
 * Describes a dependency on a certain rated entry.
 */
export type Dependency = {
  /**
   * The source of the dependency.
   */
  source: ActivatableIdentifier | SkillWithEnhancementsIdentifier

  /**
   * If the source prerequisite targets multiple entries, the other entries are
   * listed here.
   */
  otherTargets: ActivatableIdentifier | SkillWithEnhancementsIdentifier

  /**
   * The required value.
   */
  value: ValueRestriction
}

/**
 * The instance of an entry that is specified by a rating/value.
 */
export type Rated = {
  /**
   * The rated entry's identifier.
   */
  id: number

  /**
   * The current value.
   */
  value: number

  /**
   * The accumulated used adventure points value of all value increases.
   */
  cachedAdventurePoints: RatedAdventurePointsCache

  /**
   * The list of dependencies.
   */
  dependencies: Dependency[]

  /**
   * A list of bound adventure points. Bound adventure points are granted by the
   * GM and can only be spent on the entry. They don’t effect the costs of the
   * rating at the time of granting, so the rating at which they have been
   * granted is stored as well.
   */
  boundAdventurePoints: BoundAdventurePoints[]
}

/**
 * Create some helper functions for rated entries.
 */
export const createRatedHelpers = (config: {
  minValue: number
  getImprovementCost: (id: number) => ImprovementCost
}) => {
  const { minValue, getImprovementCost } = config

  const updateCachedAdventurePoints = (entry: Rated): Rated => ({
    ...entry,
    cachedAdventurePoints:
      cachedAdventurePoints(
        entry.value,
        minValue,
        entry.boundAdventurePoints,
        getImprovementCost(entry.id),
      ),
  })

  return {
    /**
     * Creates a new entry with an initial value if active. The initial
     * adventure points cache is calculated from the initial value.
     */
    create: (
      id: number,
      value: number = minValue,
      {
        dependencies = [],
        boundAdventurePoints = [],
      }: Partial<{
        dependencies: Dependency[]
        boundAdventurePoints: BoundAdventurePoints[]
      }> = {},
    ): Rated =>
      updateCachedAdventurePoints({
        id,
        value: Math.max(minValue, value),
        cachedAdventurePoints: {
          general: 0,
          bound: 0,
        },
        dependencies,
        boundAdventurePoints,
      }),

    /**
     * Update the value with an updater function. This also recalculates the
     * adventure points cache.
     */
    updateValue: (updater: (oldValue: number) => number, entry: Rated): Rated =>
      updateCachedAdventurePoints({
        ...entry,
        value: Math.max(minValue, updater(entry.value)),
      }),

    /**
     * Takes an entry that may not exist (because its instance has not been used
     * yet) and returns its value.
     */
    value: (entry: Rated | undefined): number => entry?.value ?? minValue,
  }
}

/**
 * The instance of an activatable entry that is specified by a rating/value.
 */
export type ActivatableRated = {
  /**
   * The rated entry's identifier.
   */
  id: number

  /**
   * The current value, if activated.
   */
  value?: number

  /**
   * The accumulated used adventure points value of all value increases.
   */
  cachedAdventurePoints: RatedAdventurePointsCache

  /**
   * The list of dependencies.
   */
  dependencies: Dependency[]

  /**
   * A list of bound adventure points. Bound adventure points are granted by the
   * GM and can only be spent on the entry. They don’t effect the costs of the
   * rating at the time of granting, so the rating at which they have been
   * granted is stored as well.
   */
  boundAdventurePoints: BoundAdventurePoints[]
}

/**
 * Create some helper functions for rated entries.
 */
export const createActivatableRatedHelpers = (config: {
  getImprovementCost: (id: number) => ImprovementCost
}) => {
  const { getImprovementCost } = config
  const minValue = 0

  const updateCachedAdventurePoints = (entry: ActivatableRated): ActivatableRated => ({
    ...entry,
    cachedAdventurePoints:
      cachedAdventurePointsForActivatable(
        entry.value,
        entry.boundAdventurePoints,
        getImprovementCost(entry.id),
      ),
  })

  return {
    /**
     * Creates a new entry with an initial value if active. The initial
     * adventure points cache is calculated from the initial value.
     */
    create: (id: number, value?: number): ActivatableRated =>
      updateCachedAdventurePoints({
        id,
        value: value === undefined ? undefined : Math.max(minValue, value),
        cachedAdventurePoints: {
          general: 0,
          bound: 0,
        },
        dependencies: [],
        boundAdventurePoints: [],
      }),

    /**
     * Update the value with an updater function. This also recalculates the
     * adventure points cache.
     */
    updateValue: (
      updater: (oldValue: number | undefined) => number | undefined,
      entry: ActivatableRated
    ): ActivatableRated => {
      const newValue = updater(entry.value)

      return updateCachedAdventurePoints({
        ...entry,
        value: newValue === undefined ? undefined : Math.max(minValue, newValue),
      })
    },

    /**
     * Takes an entry that may not exist (because its instance has not been used
     * yet) and returns its value.
     */
    value: (entry: ActivatableRated | undefined): number | undefined => entry?.value,
  }
}

/**
 * The instance of an activatable entry that is specified by a rating/value.
 */
export type ActivatableRatedWithEnhancements = {
  /**
   * The rated entry's identifier.
   */
  id: number

  /**
   * The current value, if activated.
   */
  value?: number

  /**
   * The accumulated used adventure points value of all value increases.
   */
  cachedAdventurePoints: RatedAdventurePointsCache

  /**
   * The list of dependencies.
   */
  dependencies: Dependency[]

  /**
   * A list of bound adventure points. Bound adventure points are granted by the
   * GM and can only be spent on the entry. They don’t effect the costs of the
   * rating at the time of granting, so the rating at which they have been
   * granted is stored as well.
   */
  boundAdventurePoints: BoundAdventurePoints[]

  /**
   * The currently active enhancements for that entry.
   */
  enhancements: {
    [id: number]: Enhancement
  }
}

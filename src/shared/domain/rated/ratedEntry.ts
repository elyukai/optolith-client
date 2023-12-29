import { ImprovementCost } from "../adventurePoints/improvementCost.ts"
import {
  BoundAdventurePoints,
  RatedAdventurePointsCache,
  cachedAdventurePoints,
  cachedAdventurePointsForActivatable,
} from "../adventurePoints/ratedEntry.ts"
import { Enhancement } from "./enhancement.ts"
import { RatedDependency } from "./ratedDependency.ts"

/**
 * The current value.
 */
export type RatedValue = number

/**
 * The instance of an entry that is specified by a rating/value.
 */
export type Rated = {
  /**
   * The rated entry's identifier.
   */
  readonly id: number

  /**
   * The current value.
   */
  readonly value: RatedValue

  /**
   * The accumulated used adventure points value of all value increases.
   */
  readonly cachedAdventurePoints: RatedAdventurePointsCache

  /**
   * The list of dependencies.
   */
  readonly dependencies: RatedDependency[]

  /**
   * A list of bound adventure points. Bound adventure points are granted by the
   * GM and can only be spent on the entry. They don’t effect the costs of the
   * rating at the time of granting, so the rating at which they have been
   * granted is stored as well.
   */
  readonly boundAdventurePoints: BoundAdventurePoints[]
}

/**
 * Instances of entries that are specified by a rating/value, keyed by
 * identifier.
 */
export type RatedMap = {
  [id: number]: Rated
}

/**
 * Keyed helper functions for rated entries.
 */
export type RatedHelpers = {
  /**
   * Creates a new entry with an initial value if active. The initial
   * adventure points cache is calculated from the initial value.
   */
  create: (
    id: number,
    value?: RatedValue,
    options?: Partial<{
      dependencies: RatedDependency[]
      boundAdventurePoints: BoundAdventurePoints[]
    }>,
  ) => Rated

  /**
   * Update the value with an updater function. This also recalculates the
   * adventure points cache.
   */
  updateValue: (updater: (oldValue: RatedValue) => RatedValue, entry: Rated) => Rated

  /**
   * Takes an entry that may not exist (because its instance has not been used
   * yet) and returns its value.
   */
  getValue: (entry: Rated | undefined) => RatedValue
}

/**
 * Create some helper functions for rated entries.
 */
export const createRatedHelpers = (config: {
  minValue: number
  getImprovementCost: (id: number) => ImprovementCost
}): RatedHelpers => {
  const { minValue, getImprovementCost } = config

  const updateCachedAdventurePoints = (entry: Rated): Rated => ({
    ...entry,
    cachedAdventurePoints: cachedAdventurePoints(
      entry.value,
      minValue,
      entry.boundAdventurePoints,
      getImprovementCost(entry.id),
    ),
  })

  const create: RatedHelpers["create"] = (
    id,
    value = minValue,
    { dependencies = [], boundAdventurePoints = [] } = {},
  ) =>
    updateCachedAdventurePoints({
      id,
      value: Math.max(minValue, value),
      cachedAdventurePoints: {
        general: 0,
        bound: 0,
      },
      dependencies,
      boundAdventurePoints,
    })

  const updateValue: RatedHelpers["updateValue"] = (updater, entry) =>
    updateCachedAdventurePoints({
      ...entry,
      value: Math.max(minValue, updater(entry.value)),
    })

  const getValue: RatedHelpers["getValue"] = entry => entry?.value ?? minValue

  return {
    create,
    updateValue,
    getValue,
  }
}

/**
 * The current value, if activated.
 */
export type ActivatableRatedValue = number | undefined

/**
 * The instance of an activatable entry that is specified by a rating/value.
 */
export type ActivatableRated = {
  /**
   * The rated entry's identifier.
   */
  readonly id: number

  /**
   * The current value, if activated.
   */
  readonly value: ActivatableRatedValue

  /**
   * The accumulated used adventure points value of all value increases.
   */
  readonly cachedAdventurePoints: RatedAdventurePointsCache

  /**
   * The list of dependencies.
   */
  readonly dependencies: RatedDependency[]

  /**
   * A list of bound adventure points. Bound adventure points are granted by the
   * GM and can only be spent on the entry. They don’t effect the costs of the
   * rating at the time of granting, so the rating at which they have been
   * granted is stored as well.
   */
  readonly boundAdventurePoints: BoundAdventurePoints[]
}

/**
 * The active instance of an activatable entry that is specified by a
 * rating/value.
 */
export type ActiveActivatableRated = Omit<ActivatableRated, "value"> & {
  /**
   * The current value.
   */
  value: number
}

/**
 * Checks whether the entry is active.
 */
export const isRatedActive = (entry: ActivatableRated): entry is ActiveActivatableRated =>
  entry.value !== undefined

/**
 * Checks whether the entry that may not exist is active.
 */
export const isOptionalRatedActive = (
  entry: ActivatableRated | undefined,
): entry is ActiveActivatableRated => entry?.value !== undefined

/**
 * Instances of activatable entries that are specified by a rating/value, keyed
 * by identifier.
 */
export type ActivatableRatedMap = {
  [id: number]: ActivatableRated
}

/**
 * Keyed helper functions for activatable rated entries.
 */
export type ActivatableRatedHelpers = {
  /**
   * Creates a new entry with an initial value if active. The initial
   * adventure points cache is calculated from the initial value.
   */
  create: (
    id: number,
    value?: ActivatableRatedValue,
    options?: Partial<{
      dependencies: RatedDependency[]
      boundAdventurePoints: BoundAdventurePoints[]
    }>,
  ) => ActivatableRated

  /**
   * Update the value with an updater function. This also recalculates the
   * adventure points cache.
   */
  updateValue: (
    updater: (oldValue: ActivatableRatedValue) => ActivatableRatedValue,
    entry: ActivatableRated,
  ) => ActivatableRated

  /**
   * Takes an entry that may not exist (because its instance has not been used
   * yet) and returns its value.
   */
  getValue: (entry: ActivatableRated | undefined) => ActivatableRatedValue
}

/**
 * Create some helper functions for rated entries.
 */
export const createActivatableRatedHelpers = (config: {
  getImprovementCost: (id: number) => ImprovementCost
}): ActivatableRatedHelpers => {
  const { getImprovementCost } = config
  const minValue = 0

  const updateCachedAdventurePoints = (entry: ActivatableRated): ActivatableRated => ({
    ...entry,
    cachedAdventurePoints: cachedAdventurePointsForActivatable(
      entry.value,
      entry.boundAdventurePoints,
      getImprovementCost(entry.id),
    ),
  })

  const create: ActivatableRatedHelpers["create"] = (
    id,
    value,
    { dependencies = [], boundAdventurePoints = [] } = {},
  ) =>
    updateCachedAdventurePoints({
      id,
      value: value === undefined ? undefined : Math.max(minValue, value),
      cachedAdventurePoints: {
        general: 0,
        bound: 0,
      },
      dependencies,
      boundAdventurePoints,
    })

  const updateValue: ActivatableRatedHelpers["updateValue"] = (updater, entry) => {
    const newValue = updater(entry.value)

    return updateCachedAdventurePoints({
      ...entry,
      value: newValue === undefined ? undefined : Math.max(minValue, newValue),
    })
  }

  const getValue: ActivatableRatedHelpers["getValue"] = entry => entry?.value

  return {
    create,
    updateValue,
    getValue,
  }
}

/**
 * The instance of an activatable entry with enhancements that is specified by a
 * rating/value.
 */
export type ActivatableRatedWithEnhancements = {
  /**
   * The rated entry's identifier.
   */
  readonly id: number

  /**
   * The current value, if activated.
   */
  readonly value: ActivatableRatedValue

  /**
   * The accumulated used adventure points value of all value increases and
   * enhancements.
   */
  readonly cachedAdventurePoints: RatedAdventurePointsCache

  /**
   * The list of dependencies.
   */
  readonly dependencies: RatedDependency[]

  /**
   * A list of bound adventure points. Bound adventure points are granted by the
   * GM and can only be spent on the entry. They don’t effect the costs of the
   * rating at the time of granting, so the rating at which they have been
   * granted is stored as well.
   */
  readonly boundAdventurePoints: BoundAdventurePoints[]

  /**
   * The currently active enhancements for that entry.
   */
  readonly enhancements: {
    [id: number]: Enhancement
  }
}

/**
 * The active instance of an activatable entry with enhancements that is
 * specified by a rating/value.
 */
export type ActiveActivatableRatedWithEnhancements = Omit<
  ActivatableRatedWithEnhancements,
  "value"
> & {
  /**
   * The current value.
   */
  value: number
}

/**
 * Checks whether the entry is active.
 */
export const isRatedWithEnhancementsActive = (
  entry: ActivatableRatedWithEnhancements,
): entry is ActiveActivatableRatedWithEnhancements => entry.value !== undefined

/**
 * Checks whether the entry that may not exist is active.
 */
export const isOptionalRatedWithEnhancementsActive = (
  entry: ActivatableRatedWithEnhancements | undefined,
): entry is ActiveActivatableRatedWithEnhancements => entry?.value !== undefined

/**
 * Instances of activatable entries with enhancements that are specified by a
 * rating/value, keyed by identifier.
 */
export type ActivatableRatedWithEnhancementsMap = {
  [id: number]: ActivatableRatedWithEnhancements
}

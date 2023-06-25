import { ActivatableIdentifier, SkillWithEnhancementsIdentifier } from "optolith-database-schema/types/_IdentifierGroup"
import { ImprovementCost } from "./adventurePoints/improvementCost.ts"
import { BoundAdventurePoints, RatedAdventurePointsCache, cachedAdventurePoints, cachedAdventurePointsForActivatable } from "./adventurePoints/ratedEntry.ts"
import { Enhancement } from "./enhancement.ts"

/**
 * A required value from a prerequisite. Can either require a minimum or a
 * maximum value.
 */
export type ValueRestriction =
  | MinimumValueRestriction
  | MaximumValueRestriction

export type MinimumValueRestriction = {
  readonly tag: "Minimum"
  readonly minimum: number
}

export type MaximumValueRestriction = {
  readonly tag: "Maximum"
  readonly maximum: number
}

export const isMinimumRestriction = (x: ValueRestriction): x is MinimumValueRestriction =>
  x.tag === "Minimum"

export const isMaximumRestriction = (x: ValueRestriction): x is MaximumValueRestriction =>
  x.tag === "Maximum"

/**
 * Describes a dependency on a certain rated entry.
 */
export type Dependency = {
  /**
   * The source of the dependency.
   */
  readonly source: ActivatableIdentifier | SkillWithEnhancementsIdentifier

  /**
   * If the source prerequisite targets multiple entries, the other entries are
   * listed here.
   */
  readonly otherTargets?: ActivatableIdentifier | SkillWithEnhancementsIdentifier

  /**
   * The required value.
   */
  readonly value: ValueRestriction
}

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
  readonly dependencies: Dependency[]

  /**
   * A list of bound adventure points. Bound adventure points are granted by the
   * GM and can only be spent on the entry. They don’t effect the costs of the
   * rating at the time of granting, so the rating at which they have been
   * granted is stored as well.
   */
  readonly boundAdventurePoints: BoundAdventurePoints[]
}

export type RatedHelpers = {
  /**
   * Creates a new entry with an initial value if active. The initial
   * adventure points cache is calculated from the initial value.
   */
  create: (
    id: number,
    value?: RatedValue,
    options?: Partial<{
      dependencies: Dependency[]
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
    cachedAdventurePoints:
      cachedAdventurePoints(
        entry.value,
        minValue,
        entry.boundAdventurePoints,
        getImprovementCost(entry.id),
      ),
  })

  const create: RatedHelpers["create"] = (
    id,
    value = minValue,
    {
      dependencies = [],
      boundAdventurePoints = [],
    } = {},
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
  readonly dependencies: Dependency[]

  /**
   * A list of bound adventure points. Bound adventure points are granted by the
   * GM and can only be spent on the entry. They don’t effect the costs of the
   * rating at the time of granting, so the rating at which they have been
   * granted is stored as well.
   */
  readonly boundAdventurePoints: BoundAdventurePoints[]
}

export type ActivatableRatedHelpers = {
  /**
   * Creates a new entry with an initial value if active. The initial
   * adventure points cache is calculated from the initial value.
   */
  create: (
    id: number,
    value?: ActivatableRatedValue,
    options?: Partial<{
      dependencies: Dependency[]
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
    cachedAdventurePoints:
      cachedAdventurePointsForActivatable(
        entry.value,
        entry.boundAdventurePoints,
        getImprovementCost(entry.id),
      ),
  })

  const create: ActivatableRatedHelpers["create"] = (
    id,
    value,
    {
      dependencies = [],
      boundAdventurePoints = [],
    } = {},
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
 * The instance of an activatable entry that is specified by a rating/value.
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
   * The accumulated used adventure points value of all value increases.
   */
  readonly cachedAdventurePoints: RatedAdventurePointsCache

  /**
   * The list of dependencies.
   */
  readonly dependencies: Dependency[]

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

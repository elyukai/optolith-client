import {
  ActivatableIdentifier,
  SkillWithEnhancementsIdentifier,
} from "optolith-database-schema/types/_IdentifierGroup"

/**
 * A required value from a prerequisite. Can either require a minimum or a
 * maximum value.
 */
export type ValueRestriction = MinimumValueRestriction | MaximumValueRestriction

/**
 * A minimum value restriction.
 */
export type MinimumValueRestriction = {
  readonly tag: "Minimum"
  readonly minimum: number
}

/**
 * A maximum value restriction.
 */
export type MaximumValueRestriction = {
  readonly tag: "Maximum"
  readonly maximum: number
}

/**
 * Checks if a value restriction is a minimum value restriction.
 */
export const isMinimumRestriction = (x: ValueRestriction): x is MinimumValueRestriction =>
  x.tag === "Minimum"

/**
 * Checks if a value restriction is a maximum value restriction.
 */
export const isMaximumRestriction = (x: ValueRestriction): x is MaximumValueRestriction =>
  x.tag === "Maximum"

/**
 * Checks if a value satisfies a restriction.
 */
export const compareWithRestriction = (
  restriction: ValueRestriction,
  value: number | undefined,
): boolean =>
  isMinimumRestriction(restriction)
    ? value === undefined
      ? false
      : value >= restriction.minimum
    : value === undefined
    ? true
    : value <= restriction.maximum

/**
 * Describes a dependency on a certain rated entry.
 */
export type RatedDependency = {
  /**
   * The source of the dependency.
   */
  readonly source: ActivatableIdentifier | SkillWithEnhancementsIdentifier

  /**
   * The top-level index of the prerequisite. If the prerequisite is part of a
   * group or disjunction, this is the index of the group or disjunction.
   */
  readonly index: number

  /**
   * Is the source prerequisite is part of a prerequisite disjunction?
   */
  readonly isPartOfDisjunction: boolean

  /**
   * The required value.
   */
  readonly value: ValueRestriction
}

/**
 * Flattens the minimum restrictions of a list of dependencies.
 */
export const flattenMinimumRestrictions = (dependencies: RatedDependency[]): number[] =>
  dependencies.flatMap(dep => (isMinimumRestriction(dep.value) ? [dep.value.minimum] : []))

/**
 * Flattens the maximum restrictions of a list of dependencies.
 */
export const flattenMaximumRestrictions = (dependencies: RatedDependency[]): number[] =>
  dependencies.flatMap(dep => (isMaximumRestriction(dep.value) ? [dep.value.maximum] : []))

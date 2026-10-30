import type {
  ActivatableIdentifier,
  RatedMinimumNumberPrerequisiteTarget,
  Skill_ID,
  SkillWithEnhancementsIdentifier,
} from "@optolith/database-schema/gen"

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

type FixedValue = {
  tag: "Fixed"
  value: ValueRestriction
}

type MinimumNumberAtMinimumValue = {
  tag: "MinimumNumberAtMinimumValue"
  minimumCount: number
  minimumValue: number
  target: RatedMinimumNumberPrerequisiteTarget
}

type Sum = {
  tag: "Sum"
  sum: number
  targetIds: Skill_ID[]
}

/**
 * Describes a dependency on a certain rated entry.
 */
export type RatedDependency = Readonly<{
  /**
   * The identifier of the dependency source.
   */
  source: ActivatableIdentifier | SkillWithEnhancementsIdentifier

  /**
   * The top-level index of the prerequisite. If the prerequisite is part of a
   * group or disjunction, this is the index of the group or disjunction.
   */
  index: number

  /**
   * Is the source prerequisite part of a prerequisite disjunction?
   */
  isPartOfDisjunction: boolean

  /**
   * The required value.
   */
  value: FixedValue | MinimumNumberAtMinimumValue | Sum
}>

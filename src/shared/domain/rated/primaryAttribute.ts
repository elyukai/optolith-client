import type { ActivatableIdentifier } from "@optolith/database-schema/gen"
import type { RatedDependency, ValueRestriction } from "./ratedDependency.ts"

/**
 * Describes a dependency on a certain rated entry.
 */
export type PrimaryAttributeDependency = Readonly<{
  /**
   * The source of the dependency.
   */
  sourceId: ActivatableIdentifier

  /**
   * The top-level index of the prerequisite. If the prerequisite is part of a
   * group or disjunction, this is the index of the group or disjunction.
   */
  index: number

  /**
   * Is the source prerequisite is part of a prerequisite disjunction?
   */
  isPartOfDisjunction: boolean

  /**
   * The required value.
   */
  value: ValueRestriction
}>

/**
 * Converts a primary attribute dependency to a rated dependency.
 */
export const primaryAttributeDependencyToRatedDependency = (
  dep: PrimaryAttributeDependency,
): RatedDependency => ({
  source: dep.sourceId,
  index: dep.index,
  isPartOfDisjunction: dep.isPartOfDisjunction,
  value: { tag: "Fixed", value: dep.value },
})

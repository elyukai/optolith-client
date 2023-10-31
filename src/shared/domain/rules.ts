import {
  ActivatableIdentifier,
  SkillWithEnhancementsIdentifier,
} from "optolith-database-schema/types/_IdentifierGroup"

/**
 * An active focus rule instance.
 */
export type ActiveFocusRule = {
  /**
   * The focus rule identifier.
   */
  id: number

  /**
   * Dependencies on the focus rule being active.
   */
  dependencies: RuleDependency[]
}

/**
 * An active optional rule instance.
 */
export type ActiveOptionalRule = {
  /**
   * The optional rule identifier.
   */
  id: number

  /**
   * An array of one or more options. The exact meaning of each option varies based on the optional rule.
   */
  options?: number[]

  /**
   * Dependencies on the optional rule being active.
   */
  dependencies: RuleDependency[]
}

/**
 * A dependency on a rule being active.
 */
export type RuleDependency = {
  /**
   * The identifier of the entry that depends on the rule.
   */
  sourceId: ActivatableIdentifier | SkillWithEnhancementsIdentifier

  /**
   * The index of the prerequisite in the source entry.
   */
  index: number

  /**
   * Whether the prerequisite is part of a disjunction. This is used as a cache
   * to avoid having to check the source entry every time you need to check
   * whether the prerequisite is part of a disjunction.
   */
  isPartOfDisjunction: boolean
}

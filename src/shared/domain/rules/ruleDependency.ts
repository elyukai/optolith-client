import {
  ActivatableIdentifier,
  SkillWithEnhancementsIdentifier,
} from "optolith-database-schema/types/_IdentifierGroup"

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

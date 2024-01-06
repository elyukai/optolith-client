import { GetById } from "../getTypes.ts"
import { RuleDependency } from "./ruleDependency.ts"

/**
 * An character’s optional rule instance.
 */
export type OptionalRuleInstance = {
  /**
   * The optional rule identifier.
   */
  id: number

  active: boolean

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
 * Creates an instance of an active optional rule.
 */
export const createOptionalRule = (id: number): OptionalRuleInstance => ({
  id,
  active: false,
  dependencies: [],
})

/**
 * Checks if an optional rule is active.
 */
export const isOptionalRuleActive = (
  getDynamicOptionalRuleById: GetById.Dynamic.OptionalRule,
  optionalRuleId: number,
): boolean => getDynamicOptionalRuleById(optionalRuleId)?.active ?? false

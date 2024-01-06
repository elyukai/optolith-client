import { GetById } from "../getTypes.ts"
import { RuleDependency } from "./ruleDependency.ts"

/**
 * A character’s focus rule instance.
 */
export type FocusRuleInstance = {
  /**
   * The focus rule identifier.
   */
  id: number

  active: boolean

  /**
   * Dependencies on the focus rule being active.
   */
  dependencies: RuleDependency[]
}

/**
 * Creates an instance of an active focus rule.
 */
export const createFocusRule = (id: number): FocusRuleInstance => ({
  id,
  active: false,
  dependencies: [],
})

/**
 * Checks if a focus rule is active.
 */
export const isFocusRuleActive = (
  getDynamicFocusRuleById: GetById.Dynamic.FocusRule,
  focusRuleId: number,
): boolean => getDynamicFocusRuleById(focusRuleId)?.active ?? false

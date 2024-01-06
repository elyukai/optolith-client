import { RulePrerequisite } from "optolith-database-schema/types/prerequisites/single/RulePrerequisite"
import { assertExhaustive } from "../../../utils/typeSafety.ts"
import { GetById } from "../../getTypes.ts"
import { isFocusRuleActive } from "../../rules/focusRule.ts"
import { isOptionalRuleActive } from "../../rules/optionalRule.ts"

/**
 * Checks a single rule prerequisite if it’s matched.
 */
export const checkRulePrerequisite = (
  caps: {
    getDynamicFocusRuleById: GetById.Dynamic.FocusRule
    getDynamicOptionalRuleById: GetById.Dynamic.OptionalRule
  },
  p: RulePrerequisite,
): boolean => {
  switch (p.id.tag) {
    case "FocusRule":
      return isFocusRuleActive(caps.getDynamicFocusRuleById, p.id.focus_rule)
    case "OptionalRule":
      return isOptionalRuleActive(caps.getDynamicOptionalRuleById, p.id.optional_rule)
    default:
      return assertExhaustive(p.id)
  }
}

import { RulePrerequisite } from "optolith-database-schema/types/prerequisites/single/RulePrerequisite"
import { assertExhaustive } from "../../../utils/typeSafety.ts"
import { GetById } from "../../getTypes.ts"

/**
 * Checks a single rule prerequisite if it’s matched.
 */
export const checkRulePrerequisite = (
  caps: {
    getDynamicFocusRule: GetById.Dynamic.FocusRule
    getDynamicOptionalRule: GetById.Dynamic.OptionalRule
  },
  p: RulePrerequisite,
): boolean => {
  switch (p.id.tag) {
    case "FocusRule":
      return caps.getDynamicFocusRule(p.id.focus_rule) !== undefined
    case "OptionalRule":
      return caps.getDynamicOptionalRule(p.id.optional_rule) !== undefined
    default:
      return assertExhaustive(p.id)
  }
}

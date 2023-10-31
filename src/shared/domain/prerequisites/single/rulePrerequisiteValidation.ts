import { RulePrerequisite } from "optolith-database-schema/types/prerequisites/single/RulePrerequisite"
import { assertExhaustive } from "../../../utils/typeSafety.ts"
import { ActiveFocusRule, ActiveOptionalRule } from "../../rules.ts"

/**
 * Checks a single rule prerequisite if it’s matched.
 */
export const checkRulePrerequisite = (
  caps: {
    getDynamicFocusRule: (id: number) => ActiveFocusRule | undefined
    getDynamicOptionalRule: (id: number) => ActiveOptionalRule | undefined
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

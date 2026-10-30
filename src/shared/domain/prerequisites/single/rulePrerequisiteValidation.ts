import type { FocusRule_ID, OptionalRule_ID, RulePrerequisite } from "@optolith/database-schema/gen"
import { assertExhaustive } from "@elyukai/utils/typeSafety"

/**
 * Checks a single rule prerequisite if it’s matched.
 */
export const checkRulePrerequisite = (
  caps: {
    isFocusRuleActive: (id: FocusRule_ID) => boolean
    isOptionalRuleActive: (id: OptionalRule_ID) => boolean
  },
  p: RulePrerequisite,
): boolean => {
  switch (p.id.kind) {
    case "FocusRule":
      return caps.isFocusRuleActive(p.id.FocusRule) === p.active
    case "OptionalRule":
      return caps.isOptionalRuleActive(p.id.OptionalRule) === p.active
    default:
      return assertExhaustive(p.id)
  }
}

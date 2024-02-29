import {
  ActivatableIdentifier,
  SkillWithEnhancementsIdentifier,
} from "optolith-database-schema/types/_IdentifierGroup"
import { RulePrerequisite } from "optolith-database-schema/types/prerequisites/single/RulePrerequisite"
import { assertExhaustive } from "../../../utils/typeSafety.ts"
import { createFocusRule } from "../../rules/focusRule.ts"
import { createOptionalRule } from "../../rules/optionalRule.ts"
import { RuleDependency } from "../../rules/ruleDependency.ts"
import { RegistrationFunction, addOrRemoveDependencyInSlice } from "../registrationHelpers.ts"

/**
 * Registers or unregisters a {@link RulePrerequisite} as a dependency on the
 * character's draft.
 */
export const registerOrUnregisterRulePrerequisiteAsDependency: RegistrationFunction<
  RulePrerequisite,
  ActivatableIdentifier | SkillWithEnhancementsIdentifier
> = (method, character, p, sourceId, index, isPartOfDisjunction): void => {
  const dependency: RuleDependency = {
    sourceId,
    index,
    isPartOfDisjunction,
  }

  switch (p.id.tag) {
    case "FocusRule":
      return addOrRemoveDependencyInSlice(
        method,
        character.rules.focusRules,
        p.id.focus_rule,
        createFocusRule,
        dependency,
      )
    case "OptionalRule":
      return addOrRemoveDependencyInSlice(
        method,
        character.rules.optionalRules,
        p.id.optional_rule,
        createOptionalRule,
        dependency,
      )
    default:
      return assertExhaustive(p.id)
  }
}

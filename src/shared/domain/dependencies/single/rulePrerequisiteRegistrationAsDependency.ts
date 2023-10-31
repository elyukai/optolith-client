import {
  ActivatableIdentifier,
  SkillWithEnhancementsIdentifier,
} from "optolith-database-schema/types/_IdentifierGroup"
import { RulePrerequisite } from "optolith-database-schema/types/prerequisites/single/RulePrerequisite"
import { assertExhaustive } from "../../../utils/typeSafety.ts"
import { RuleDependency } from "../../rules.ts"
import { RegistrationFunction, addOrRemoveDependency } from "../registrationHelpers.ts"

/**
 * Registers or unregisters a {@link RulePrerequisite} as a dependency on the character's draft.
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
      return addOrRemoveDependency(
        method,
        character.rules.activeFocusRules,
        p.id.focus_rule,
        id => ({ id, dependencies: [] }),
        dependency,
      )
    case "OptionalRule":
      return addOrRemoveDependency(
        method,
        character.rules.activeOptionalRules,
        p.id.optional_rule,
        id => ({ id, dependencies: [] }),
        dependency,
      )
    default:
      return assertExhaustive(p.id)
  }
}

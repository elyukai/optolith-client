import type {
  ActivatableIdentifier,
  RulePrerequisite,
  SkillWithEnhancementsIdentifier,
} from "@optolith/database-schema/gen"
import type { RuleDependency } from "../../rules.ts"
import type { RegistrationFunction } from "../registrationHelpers.ts"

/**
 * Registers or unregisters a {@link RulePrerequisite} as a dependency on the
 * character's draft.
 */
export const registerOrUnregisterRulePrerequisiteAsDependency: RegistrationFunction<
  RulePrerequisite,
  ActivatableIdentifier | SkillWithEnhancementsIdentifier
> = (p, method, character, sourceId, index, isPartOfDisjunction): void => {
  const dependency: RuleDependency = {
    sourceId,
    index,
    isPartOfDisjunction,
    active: p.active,
  }

  character.rules.addOrRemoveRuleDependency(p.id, method, dependency)
}

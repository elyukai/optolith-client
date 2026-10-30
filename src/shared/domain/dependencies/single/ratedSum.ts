import type {
  ActivatableIdentifier,
  RatedSumPrerequisite,
  SkillWithEnhancementsIdentifier,
} from "@optolith/database-schema/gen"
import type { RatedDependency } from "../../rated/ratedDependency.ts"
import type { RegistrationFunction } from "../registrationHelpers.ts"

/**
 * Registers or unregisters a {@link RatedSumPrerequisite} as a dependency on the
 * character's draft.
 */
export const registerOrUnregisterRatedSumPrerequisiteAsDependency: RegistrationFunction<
  RatedSumPrerequisite,
  ActivatableIdentifier | SkillWithEnhancementsIdentifier
> = (p, method, character, sourceId, index, isPartOfDisjunction): void => {
  const dependency: RatedDependency = {
    source: sourceId,
    index,
    isPartOfDisjunction,
    value: {
      tag: "Sum",
      sum: p.sum,
      targetIds: p.targets,
    },
  }

  p.targets.forEach(id => character.skills.addOrRemoveDependency(id, method, dependency))
}

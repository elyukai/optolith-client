import {
  ActivatableIdentifier,
  SkillWithEnhancementsIdentifier,
} from "optolith-database-schema/types/_IdentifierGroup"
import { RatedSumPrerequisite } from "optolith-database-schema/types/prerequisites/single/RatedSumPrerequisite"
import { RatedDependency } from "../../rated/ratedDependency.ts"
import { createEmptyDynamicSkill } from "../../rated/skill.ts"
import { RegistrationFunction, addOrRemoveDependencyInSlice } from "../registrationHelpers.ts"

/**
 * Registers or unregisters a {@link RatedSumPrerequisite} as a dependency on the
 * character's draft.
 */
export const registerOrUnregisterRatedSumPrerequisiteAsDependency: RegistrationFunction<
  RatedSumPrerequisite,
  ActivatableIdentifier | SkillWithEnhancementsIdentifier
> = (method, character, p, sourceId, index, isPartOfDisjunction): void => {
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

  p.targets.forEach(id =>
    addOrRemoveDependencyInSlice(
      method,
      character.skills,
      id.skill,
      createEmptyDynamicSkill,
      dependency,
    ),
  )
}

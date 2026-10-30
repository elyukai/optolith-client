import type {
  ActivatableIdentifier,
  RatedPrerequisite,
  SkillWithEnhancementsIdentifier,
} from "@optolith/database-schema/gen"
import { fromUniformCase } from "../../databaseEnum.ts"
import type { RatedDependency } from "../../rated/ratedDependency.ts"
import type { RegistrationFunction } from "../registrationHelpers.ts"

/**
 * Registers or unregisters a {@link RatedPrerequisite} as a dependency on the
 * character's draft.
 */
export const registerOrUnregisterRatedPrerequisiteAsDependency: RegistrationFunction<
  RatedPrerequisite,
  ActivatableIdentifier | SkillWithEnhancementsIdentifier
> = (p, method, character, sourceId, index, isPartOfDisjunction): void => {
  const dependency: RatedDependency = {
    source: sourceId,
    index,
    isPartOfDisjunction,
    value: {
      tag: "Fixed",
      value: {
        tag: "Minimum",
        minimum: p.value,
      },
    },
  }

  character
    .getRatedCollection(p.id.kind)
    .addOrRemoveDependency(fromUniformCase(p.id), method, dependency)
}

import type { ActivatableIdentifier, SocialStatusPrerequisite } from "@optolith/database-schema/gen"
import type { SocialStatusDependency } from "../../socialStatus.ts"
import { type RegistrationFunction, addOrRemoveDependency } from "../registrationHelpers.ts"

/**
 * Registers or unregisters a {@link SocialStatusPrerequisite} as a dependency
 * on the character's draft.
 */
export const registerOrUnregisterSocialStatusPrerequisiteAsDependency: RegistrationFunction<
  SocialStatusPrerequisite,
  ActivatableIdentifier
> = (p, method, character, sourceId, index, isPartOfDisjunction): void => {
  const dependency: SocialStatusDependency = {
    id: p.id,
    sourceId,
    index,
    isPartOfDisjunction,
  }

  addOrRemoveDependency(method, character.personalData.socialStatusDependencies, dependency)
}

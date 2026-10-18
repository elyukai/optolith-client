import { ActivatableIdentifier } from "@optolith/database-schema/gen"
import { SocialStatusPrerequisite } from "@optolith/database-schema/gen"
import { SocialStatusDependency } from "../../socialStatus.ts"
import { RegistrationFunction, addOrRemoveDependency } from "../registrationHelpers.ts"

/**
 * Registers or unregisters a {@link SocialStatusPrerequisite} as a dependency
 * on the character's draft.
 */
export const registerOrUnregisterSocialStatusPrerequisiteAsDependency: RegistrationFunction<
  SocialStatusPrerequisite,
  ActivatableIdentifier
> = (method, character, p, sourceId, index, isPartOfDisjunction): void => {
  const dependency: SocialStatusDependency = {
    id: p.id.social_status,
    sourceId,
    index,
    isPartOfDisjunction,
  }

  addOrRemoveDependency(method, character.personalData.socialStatus.dependencies, dependency)
}

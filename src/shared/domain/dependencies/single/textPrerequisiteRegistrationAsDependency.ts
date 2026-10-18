import {
  ActivatableIdentifier,
  SkillWithEnhancementsIdentifier,
} from "@optolith/database-schema/gen"
import { TextPrerequisite } from "@optolith/database-schema/gen"
import { RegistrationFunction } from "../registrationHelpers.ts"

/**
 * Registers or unregisters a {@link TextPrerequisite} as a dependency on the
 * character's draft.
 */
export const registerOrUnregisterTextPrerequisiteAsDependency: RegistrationFunction<
  TextPrerequisite,
  ActivatableIdentifier | SkillWithEnhancementsIdentifier
> = (): void => {
  // no op
}

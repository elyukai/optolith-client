import type {
  ActivatableIdentifier,
  SkillWithEnhancementsIdentifier,
  TextPrerequisite,
} from "@optolith/database-schema/gen"
import type { RegistrationFunction } from "../registrationHelpers.ts"

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

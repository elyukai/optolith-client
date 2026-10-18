import { AnimistPowerIdentifier } from "@optolith/database-schema/gen"
import { AnimistPowerPrerequisite } from "@optolith/database-schema/gen"
import { RegistrationFunction } from "../registrationHelpers.ts"

/**
 * Registers or unregisters a {@link AnimistPowerPrerequisite} as a dependency on the
 * character's draft.
 */
export const registerOrUnregisterAnimistPowerPrerequisiteAsDependency: RegistrationFunction<
  AnimistPowerPrerequisite,
  AnimistPowerIdentifier
> = (): void => {
  // TODO: Missing implementation
}

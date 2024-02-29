import { AnimistPowerIdentifier } from "optolith-database-schema/types/_Identifier"
import { AnimistPowerPrerequisite } from "optolith-database-schema/types/prerequisites/single/AnimistPowerPrerequisite"
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

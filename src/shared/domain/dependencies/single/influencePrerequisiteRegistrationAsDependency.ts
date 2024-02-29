import { InfluenceIdentifier } from "optolith-database-schema/types/_Identifier"
import { InfluencePrerequisite } from "optolith-database-schema/types/prerequisites/single/InfluencePrerequisite"
import { RegistrationFunction } from "../registrationHelpers.ts"

/**
 * Registers or unregisters a {@link InfluencePrerequisite} as a dependency on the
 * character's draft.
 */
export const registerOrUnregisterInfluencePrerequisiteAsDependency: RegistrationFunction<
  InfluencePrerequisite,
  InfluenceIdentifier
> = (): void => {
  // TODO: Missing implementation
}

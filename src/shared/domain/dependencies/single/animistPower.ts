import type { AnimistPowerPrerequisite } from "@optolith/database-schema/gen"
import type { Case } from "../../databaseEnum.ts"
import type { RegistrationFunction } from "../registrationHelpers.ts"

/**
 * Registers or unregisters a {@link AnimistPowerPrerequisite} as a dependency on the
 * character's draft.
 */
export const registerOrUnregisterAnimistPowerPrerequisiteAsDependency: RegistrationFunction<
  AnimistPowerPrerequisite,
  Case<"AnimistPower", string>
> = (): void => {
  // TODO: Missing implementation
}

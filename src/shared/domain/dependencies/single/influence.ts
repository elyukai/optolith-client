import type { InfluencePrerequisite } from "@optolith/database-schema/gen"
import type { Case } from "../../databaseEnum.ts"
import type { RegistrationFunction } from "../registrationHelpers.ts"

/**
 * Registers or unregisters a {@link InfluencePrerequisite} as a dependency on the
 * character's draft.
 */
export const registerOrUnregisterInfluencePrerequisiteAsDependency: RegistrationFunction<
  InfluencePrerequisite,
  Case<"Influence", string>
> = (): void => {
  // TODO: Missing implementation
}

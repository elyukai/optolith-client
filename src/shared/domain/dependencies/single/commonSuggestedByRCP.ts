import type { Case } from "../../databaseEnum.ts"
import type { RegistrationFunction } from "../registrationHelpers.ts"

/**
 * Registers or unregisters a {@link CommonSuggestedByRCPPrerequisite} as a
 * dependency on the character's draft.
 */
export const registerOrUnregisterCommonSuggestedByRCPPrerequisiteAsDependency: RegistrationFunction<
  undefined,
  Case<"Advantage" | "Disadvantage", string>
> = (): void => {
  // no op
}

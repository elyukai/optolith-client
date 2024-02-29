import {
  AdvantageIdentifier,
  DisadvantageIdentifier,
} from "optolith-database-schema/types/_Identifier"
import { RegistrationFunction } from "../registrationHelpers.ts"

/**
 * Registers or unregisters a {@link CommonSuggestedByRCPPrerequisite} as a
 * dependency on the character's draft.
 */
export const registerOrUnregisterCommonSuggestedByRCPPrerequisiteAsDependency: RegistrationFunction<
  Record<string, never>,
  AdvantageIdentifier | DisadvantageIdentifier
> = (): void => {
  // no op
}

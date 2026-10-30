import type { ActivatableIdentifier, StatePrerequisite } from "@optolith/database-schema/gen"
import type { StateDependency } from "../../state.ts"
import type { RegistrationFunction } from "../registrationHelpers.ts"

/**
 * Registers or unregisters a {@link StatePrerequisite} as a dependency on the
 * character's draft.
 */
export const registerOrUnregisterStatePrerequisiteAsDependency: RegistrationFunction<
  StatePrerequisite,
  ActivatableIdentifier
> = (p, method, character, sourceId, index, isPartOfDisjunction): void => {
  const dependency: StateDependency = {
    sourceId,
    index,
    isPartOfDisjunction,
  }

  character.states.addOrRemoveDependency(p.id, method, dependency)
}

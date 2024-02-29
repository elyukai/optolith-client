import { ActivatableIdentifier } from "optolith-database-schema/types/_IdentifierGroup"
import { StatePrerequisite } from "optolith-database-schema/types/prerequisites/single/StatePrerequisite"
import { StateDependency, createState } from "../../state.ts"
import { RegistrationFunction, addOrRemoveDependencyInSlice } from "../registrationHelpers.ts"

/**
 * Registers or unregisters a {@link StatePrerequisite} as a dependency on the
 * character's draft.
 */
export const registerOrUnregisterStatePrerequisiteAsDependency: RegistrationFunction<
  StatePrerequisite,
  ActivatableIdentifier
> = (method, character, p, sourceId, index, isPartOfDisjunction): void => {
  const dependency: StateDependency = {
    sourceId,
    index,
    isPartOfDisjunction,
  }

  addOrRemoveDependencyInSlice(method, character.states, p.id.state, createState, dependency)
}

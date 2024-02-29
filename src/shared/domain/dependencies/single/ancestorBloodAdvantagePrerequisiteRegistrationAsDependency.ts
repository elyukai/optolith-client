import { ActivatableIdentifier } from "optolith-database-schema/types/_IdentifierGroup"
import { AncestorBloodPrerequisite } from "optolith-database-schema/types/prerequisites/single/AncestorBloodPrerequisite"
import { ActivatableDependency } from "../../activatable/activatableDependency.ts"
import { createEmptyDynamicActivatable } from "../../activatable/activatableEntry.ts"
import { RegistrationFunction, addOrRemoveDependencyInSlice } from "../registrationHelpers.ts"

/**
 * Registers or unregisters a {@link AncestorBloodPrerequisite} as a dependency
 * on the character's draft.
 */
export const registerOrUnregisterNoOtherAncestorBloodAdvantagePrerequisiteAsDependency: RegistrationFunction<
  AncestorBloodPrerequisite,
  ActivatableIdentifier,
  { ancestorBloodAdvantageIds: number[] }
> = (
  method,
  character,
  _p,
  sourceId,
  index,
  isPartOfDisjunction,
  { ancestorBloodAdvantageIds },
): void => {
  const dependency: ActivatableDependency = {
    sourceId,
    index,
    isPartOfDisjunction,
    active: false,
  }

  ancestorBloodAdvantageIds.forEach(id => {
    if (sourceId.tag !== "Advantage" || sourceId.advantage !== id) {
      addOrRemoveDependencyInSlice(
        method,
        character.advantages,
        id,
        createEmptyDynamicActivatable,
        dependency,
      )
    }
  })
}

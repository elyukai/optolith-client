import type { ActivatableIdentifier } from "@optolith/database-schema/gen"
import type { ActivatableDependency } from "../../activatable/activatableDependency.ts"
import type { RegistrationFunction } from "../registrationHelpers.ts"

/**
 * Registers or unregisters a {@link AncestorBloodPrerequisite} as a dependency
 * on the character's draft.
 */
export const registerOrUnregisterNoOtherAncestorBloodAdvantagePrerequisiteAsDependency: RegistrationFunction<
  undefined,
  ActivatableIdentifier
> = (_p, method, character, sourceId, index, isPartOfDisjunction): void => {
  const dependency: ActivatableDependency = {
    sourceId,
    index,
    isPartOfDisjunction,
    active: false,
  }

  for (const ancestorBloodAdvantageId of character.global.cache.ancestorBloodAdvantages) {
    if (sourceId.kind !== "Advantage" || sourceId.Advantage !== ancestorBloodAdvantageId) {
      character.advantages.addOrRemoveDependency(ancestorBloodAdvantageId, method, dependency)
    }
  }
}

import type { ActivatableIdentifier, CulturePrerequisite } from "@optolith/database-schema/gen"
import type { CultureDependency } from "../../culture.ts"
import { type RegistrationFunction, addOrRemoveDependency } from "../registrationHelpers.ts"

/**
 * Registers or unregisters a {@link CulturePrerequisite} as a dependency on the
 * character's draft.
 */
export const registerOrUnregisterCulturePrerequisiteAsDependency: RegistrationFunction<
  CulturePrerequisite,
  ActivatableIdentifier
> = (p, method, character, sourceId, index, isPartOfDisjunction): void => {
  const dependency: CultureDependency = {
    sourceId,
    index,
    isPartOfDisjunction,
    id: p.id,
  }

  if (character.culture) {
    addOrRemoveDependency(method, character.culture.dependencies, dependency)
  }
}

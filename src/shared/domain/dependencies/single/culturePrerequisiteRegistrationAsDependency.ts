import { ActivatableIdentifier } from "optolith-database-schema/types/_IdentifierGroup"
import { CulturePrerequisite } from "optolith-database-schema/types/prerequisites/single/CulturePrerequisite"
import { CultureDependency } from "../../culture.ts"
import { RegistrationFunction, addOrRemoveDependency } from "../registrationHelpers.ts"

/**
 * Registers or unregisters a {@link CulturePrerequisite} as a dependency on the
 * character's draft.
 */
export const registerOrUnregisterCulturePrerequisiteAsDependency: RegistrationFunction<
  CulturePrerequisite,
  ActivatableIdentifier
> = (method, character, p, sourceId, index, isPartOfDisjunction): void => {
  const dependency: CultureDependency = {
    sourceId,
    index,
    isPartOfDisjunction,
    id: p.id.culture,
  }

  addOrRemoveDependency(method, character.culture.dependencies, dependency)
}

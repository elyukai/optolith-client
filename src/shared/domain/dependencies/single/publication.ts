import type { Publication_ID, PublicationPrerequisite } from "@optolith/database-schema/gen"
import type { PublicationDependency } from "../../sources/publicationDependency.ts"
import { type RegistrationFunction, addOrRemoveDependency } from "../registrationHelpers.ts"

/**
 * Registers or unregisters a {@link PublicationPrerequisite} as a dependency on the
 * character's draft.
 */
export const registerOrUnregisterPublicationPrerequisiteAsDependency: RegistrationFunction<
  PublicationPrerequisite,
  Publication_ID
> = (p, method, character, sourceId, index, isPartOfDisjunction): void => {
  const dependency: PublicationDependency = {
    sourceId,
    index,
    isPartOfDisjunction,
    id: p.id,
  }

  addOrRemoveDependency(method, character.rules.publicationDependencies, dependency)
}

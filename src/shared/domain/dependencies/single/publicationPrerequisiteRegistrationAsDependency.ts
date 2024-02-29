import { PublicationIdentifier } from "optolith-database-schema/types/_Identifier"
import { PublicationPrerequisite } from "optolith-database-schema/types/prerequisites/single/PublicationPrerequisite"
import { PublicationDependency } from "../../sources/publicationDependency.ts"
import { RegistrationFunction, addOrRemoveDependency } from "../registrationHelpers.ts"

/**
 * Registers or unregisters a {@link PublicationPrerequisite} as a dependency on the
 * character's draft.
 */
export const registerOrUnregisterPublicationPrerequisiteAsDependency: RegistrationFunction<
  PublicationPrerequisite,
  PublicationIdentifier
> = (method, character, p, sourceId, index, isPartOfDisjunction): void => {
  const dependency: PublicationDependency = {
    sourceId,
    index,
    isPartOfDisjunction,
    id: p.id,
  }

  addOrRemoveDependency(method, character.rules.publicationDependencies, dependency)
}

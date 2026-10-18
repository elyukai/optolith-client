import { ActivatableIdentifier } from "@optolith/database-schema/gen"
import { PactPrerequisite } from "@optolith/database-schema/gen"
import { PactDependency } from "../../pact.ts"
import { RegistrationFunction, addOrRemoveDependency } from "../registrationHelpers.ts"

/**
 * Registers or unregisters a {@link PactPrerequisite} as a dependency on the
 * character's draft.
 */
export const registerOrUnregisterPactPrerequisiteAsDependency: RegistrationFunction<
  PactPrerequisite,
  ActivatableIdentifier
> = (method, character, p, sourceId, index, isPartOfDisjunction): void => {
  const dependency: PactDependency = {
    sourceId,
    index,
    isPartOfDisjunction,
    category: p.category,
    domain: p.domain_id,
    level: p.level,
  }

  addOrRemoveDependency(method, character.pactDependencies, dependency)
}

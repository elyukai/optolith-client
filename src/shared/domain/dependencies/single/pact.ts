import type { ActivatableIdentifier, PactPrerequisite } from "@optolith/database-schema/gen"
import type { PactDependency } from "../../pact.ts"
import { type RegistrationFunction, addOrRemoveDependency } from "../registrationHelpers.ts"

/**
 * Registers or unregisters a {@link PactPrerequisite} as a dependency on the
 * character's draft.
 */
export const registerOrUnregisterPactPrerequisiteAsDependency: RegistrationFunction<
  PactPrerequisite,
  ActivatableIdentifier
> = (p, method, character, sourceId, index, isPartOfDisjunction): void => {
  const dependency: PactDependency = {
    sourceId,
    index,
    isPartOfDisjunction,
    category: p.category,
    domain: p.domain,
    level: p.level,
  }

  if (character.pact) {
    addOrRemoveDependency(method, character.pact.dependencies, dependency)
  }
}

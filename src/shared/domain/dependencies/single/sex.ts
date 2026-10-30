import type { ActivatableIdentifier, SexPrerequisite } from "@optolith/database-schema/gen"
import type { SexDependency } from "../../sex.ts"
import { type RegistrationFunction, addOrRemoveDependency } from "../registrationHelpers.ts"

/**
 * Registers or unregisters a {@link SexPrerequisite} as a dependency on the
 * character's draft.
 */
export const registerOrUnregisterSexPrerequisiteAsDependency: RegistrationFunction<
  SexPrerequisite,
  ActivatableIdentifier
> = (p, method, character, sourceId, index, isPartOfDisjunction): void => {
  const dependency: SexDependency = {
    value: {
      kind: "BinarySex",
      value: p.id,
    },
    sourceId,
    index,
    isPartOfDisjunction,
  }

  addOrRemoveDependency(method, character.personalData.sexDependencies, dependency)
}

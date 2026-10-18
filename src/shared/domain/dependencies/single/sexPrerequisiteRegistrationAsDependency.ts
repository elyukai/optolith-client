import { ActivatableIdentifier } from "@optolith/database-schema/gen"
import { SexPrerequisite } from "@optolith/database-schema/gen"
import { SexDependency } from "../../sex.ts"
import { RegistrationFunction, addOrRemoveDependency } from "../registrationHelpers.ts"

/**
 * Registers or unregisters a {@link SexPrerequisite} as a dependency on the
 * character's draft.
 */
export const registerOrUnregisterSexPrerequisiteAsDependency: RegistrationFunction<
  SexPrerequisite,
  ActivatableIdentifier
> = (method, character, p, sourceId, index, isPartOfDisjunction): void => {
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

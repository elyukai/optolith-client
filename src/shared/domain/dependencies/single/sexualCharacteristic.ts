import type {
  ActivatableIdentifier,
  SexualCharacteristicPrerequisite,
} from "@optolith/database-schema/gen"
import type { SexDependency } from "../../sex.ts"
import { type RegistrationFunction, addOrRemoveDependency } from "../registrationHelpers.ts"

/**
 * Registers or unregisters a {@link SexualCharacteristicPrerequisite} as a
 * dependency on the character's draft.
 */
export const registerOrUnregisterSexualCharacteristicPrerequisiteAsDependency: RegistrationFunction<
  SexualCharacteristicPrerequisite,
  ActivatableIdentifier
> = (p, method, character, sourceId, index, isPartOfDisjunction): void => {
  const dependency: SexDependency = {
    value: {
      kind: "SexualCharacteristic",
      value: p.id,
    },
    sourceId,
    index,
    isPartOfDisjunction,
  }

  addOrRemoveDependency(method, character.personalData.sexDependencies, dependency)
}

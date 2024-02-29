import { ActivatableIdentifier } from "optolith-database-schema/types/_IdentifierGroup"
import { SexualCharacteristicPrerequisite } from "optolith-database-schema/types/prerequisites/single/SexualCharacteristicPrerequisite"
import { SexDependency } from "../../sex.ts"
import { RegistrationFunction, addOrRemoveDependency } from "../registrationHelpers.ts"

/**
 * Registers or unregisters a {@link SexualCharacteristicPrerequisite} as a
 * dependency on the character's draft.
 */
export const registerOrUnregisterSexualCharacteristicPrerequisiteAsDependency: RegistrationFunction<
  SexualCharacteristicPrerequisite,
  ActivatableIdentifier
> = (method, character, p, sourceId, index, isPartOfDisjunction): void => {
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

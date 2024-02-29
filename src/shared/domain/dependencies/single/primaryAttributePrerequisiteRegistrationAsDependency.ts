import { ActivatableIdentifier } from "optolith-database-schema/types/_IdentifierGroup"
import { PrimaryAttributePrerequisite } from "optolith-database-schema/types/prerequisites/single/PrimaryAttributePrerequisite"
import { assertExhaustive } from "../../../utils/typeSafety.ts"
import { PrimaryAttributeDependency } from "../../rated/primaryAttribute.ts"
import { RegistrationFunction, addOrRemoveDependency } from "../registrationHelpers.ts"

/**
 * Registers or unregisters a {@link PrimaryAttributePrerequisite} as a
 * dependency on the character's draft.
 */
export const registerOrUnregisterPrimaryAttributePrerequisiteAsDependency: RegistrationFunction<
  PrimaryAttributePrerequisite,
  ActivatableIdentifier
> = (method, character, p, sourceId, index, isPartOfDisjunction): void => {
  const dependency: PrimaryAttributeDependency = {
    sourceId,
    index,
    isPartOfDisjunction,
    value: {
      tag: "Minimum",
      minimum: p.value,
    },
  }

  switch (p.category) {
    case "Blessed":
      return addOrRemoveDependency(
        method,
        character.blessedPrimaryAttributeDependencies,
        dependency,
      )
    case "Magical":
      return addOrRemoveDependency(
        method,
        character.magicalPrimaryAttributeDependencies,
        dependency,
      )
    default:
      return assertExhaustive(p.category)
  }
}

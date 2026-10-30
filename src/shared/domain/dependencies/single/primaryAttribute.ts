import { assertExhaustive } from "@elyukai/utils/typeSafety"
import type {
  ActivatableIdentifier,
  PrimaryAttributePrerequisite,
} from "@optolith/database-schema/gen"
import type { PrimaryAttributeDependency } from "../../rated/primaryAttribute.ts"
import { type RegistrationFunction, addOrRemoveDependency } from "../registrationHelpers.ts"

/**
 * Registers or unregisters a {@link PrimaryAttributePrerequisite} as a
 * dependency on the character's draft.
 */
export const registerOrUnregisterPrimaryAttributePrerequisiteAsDependency: RegistrationFunction<
  PrimaryAttributePrerequisite,
  ActivatableIdentifier
> = (p, method, character, sourceId, index, isPartOfDisjunction): void => {
  const dependency: PrimaryAttributeDependency = {
    sourceId,
    index,
    isPartOfDisjunction,
    value: {
      tag: "Minimum",
      minimum: p.value,
    },
  }

  switch (p.category.kind) {
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

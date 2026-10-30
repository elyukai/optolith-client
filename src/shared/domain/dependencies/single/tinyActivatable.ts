import { assertExhaustive } from "@elyukai/utils/typeSafety"
import type {
  ActivatableIdentifier,
  TinyActivatablePrerequisite,
} from "@optolith/database-schema/gen"
import type { TinyActivatableDependency } from "../../activatable/tinyActivatable.ts"
import type { RegistrationFunction } from "../registrationHelpers.ts"

/**
 * Registers or unregisters a {@link TinyActivatablePrerequisite} as a
 * dependency on the character's draft.
 */
export const registerOrUnregisterTinyActivatablePrerequisiteAsDependency: RegistrationFunction<
  TinyActivatablePrerequisite,
  ActivatableIdentifier
> = (p, method, character, sourceId, index, isPartOfDisjunction): void => {
  const dependency: TinyActivatableDependency = {
    sourceId,
    index,
    isPartOfDisjunction,
  }

  switch (p.id.kind) {
    case "Blessing":
      return character.blessings.addOrRemoveDependency(p.id.Blessing, method, dependency)
    case "Cantrip":
      return character.cantrips.addOrRemoveDependency(p.id.Cantrip, method, dependency)
    default:
      return assertExhaustive(p.id)
  }
}

import type { ActivatableIdentifier, EnhancementPrerequisite } from "@optolith/database-schema/gen"
import { fromUniformCase } from "../../databaseEnum.ts"
import type { EnhancementDependency } from "../../rated/ratedEntry.ts"
import type { RegistrationFunction } from "../registrationHelpers.ts"

/**
 * Registers or unregisters an {@link EnhancementPrerequisite} as a
 * dependency on the character's draft.
 */
export const registerOrUnregisterEnhancementPrerequisiteAsDependency: RegistrationFunction<
  EnhancementPrerequisite,
  ActivatableIdentifier
> = (p, method, character, sourceId, index, isPartOfDisjunction): void => {
  const dependency: EnhancementDependency = {
    sourceId,
    index,
    isPartOfDisjunction,
  }

  const enhancement = character.global.db.getInstanceOfEntityById("Enhancement", p.id)
  const parent = enhancement?.parent

  if (parent !== undefined) {
    character
      .getRatedCollection(parent.kind)
      .addOrRemoveEnhancementDependency(fromUniformCase(parent), p.id, method, dependency)
  }
}

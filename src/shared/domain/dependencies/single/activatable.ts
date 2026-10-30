import type { ActivatableIdentifier, ActivatablePrerequisite } from "@optolith/database-schema/gen"
import type { ActivatableDependency } from "../../activatable/activatableDependency.ts"
import { fromUniformCase } from "../../databaseEnum.ts"
import type { RegistrationFunction } from "../registrationHelpers.ts"

/**
 * Registers or unregisters a {@link ActivatablePrerequisite} as a dependency on
 * the character's draft.
 */
export const registerOrUnregisterActivatablePrerequisiteAsDependency: RegistrationFunction<
  ActivatablePrerequisite,
  ActivatableIdentifier
> = (p, method, character, sourceId, index, isPartOfDisjunction): void => {
  const dependency: ActivatableDependency = {
    sourceId,
    index,
    isPartOfDisjunction,
    active: p.active,
    level: p.level,
    options: p.options,
    when: p.when,
  }

  character
    .getActivatableCollection(p.id.kind)
    .addOrRemoveDependency(fromUniformCase(p.id), method, dependency)
}

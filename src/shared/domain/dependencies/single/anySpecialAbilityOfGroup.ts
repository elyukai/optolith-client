import type {
  ActivatableIdentifier,
  AnySpecialAbilityOfGroupPrerequisite,
  SpecialAbilityGroup,
} from "@optolith/database-schema/gen"
import { addOrRemoveDependency, type RegistrationFunction } from "../registrationHelpers.ts"

export type AnySpecialAbilityOfGroupDependency = {
  sourceId: ActivatableIdentifier
  index: number
  isPartOfDisjunction: boolean
  group: SpecialAbilityGroup["kind"]
}

/**
 * Registers or unregisters a {@link AnySpecialAbilityOfGroupPrerequisite} as a
 * dependency on the character's draft.
 */
export const registerOrUnregisterAnySpecialAbilityOfGroupPrerequisiteAsDependency: RegistrationFunction<
  AnySpecialAbilityOfGroupPrerequisite,
  ActivatableIdentifier
> = (p, method, character, sourceId, index, isPartOfDisjunction): void => {
  const dependency: AnySpecialAbilityOfGroupDependency = {
    sourceId,
    index,
    isPartOfDisjunction,
    group: p.group.kind,
  }

  addOrRemoveDependency(method, character.specialAbilities.dependencies, dependency)
}

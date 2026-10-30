import type {
  ActivatableIdentifier,
  BlessedTraditionPrerequisite,
} from "@optolith/database-schema/gen"
import type { ActivatableDependency } from "../../activatable/activatableDependency.ts"
import { addOrRemoveDependency, type RegistrationFunction } from "../registrationHelpers.ts"
import type { AnySpecialAbilityOfGroupDependency } from "./anySpecialAbilityOfGroup.ts"

/**
 * Registers or unregisters a {@link BlessedTraditionPrerequisite} as a
 * dependency on the character's draft.
 */
export const registerOrUnregisterBlessedTraditionPrerequisiteAsDependency: RegistrationFunction<
  BlessedTraditionPrerequisite,
  ActivatableIdentifier
> = ({ restriction }, method, character, sourceId, index, isPartOfDisjunction): void => {
  if (restriction !== undefined) {
    const dependency: ActivatableDependency = {
      sourceId,
      index,
      isPartOfDisjunction: true, // TODO: Can be part of a disjunction while being a disjunction itself, so this would be misleading then. maybe implement like AnySpecialAbilityOfGroup
      active: true,
    }

    return character.global.db
      .getAllInstanceContainersOfEntity("BlessedTradition")
      .forEach(({ id, content: { type } }) => {
        if (type.kind === restriction.kind) {
          character.specialAbilities
            .getSpecialAbilitiesCollection("BlessedTradition")
            .addOrRemoveDependency(id, method, dependency)
        }
      })
  }

  const dependency: AnySpecialAbilityOfGroupDependency = {
    sourceId,
    index,
    isPartOfDisjunction,
    group: "BlessedTradition",
  }

  return addOrRemoveDependency(method, character.specialAbilities.dependencies, dependency)
}

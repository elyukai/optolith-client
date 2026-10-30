import { assertExhaustive } from "@elyukai/utils/typeSafety"
import type {
  ActivatableIdentifier,
  MagicalTraditionPrerequisite,
} from "@optolith/database-schema/gen"
import type { ActivatableDependency } from "../../activatable/activatableDependency.ts"
import { addOrRemoveDependency, type RegistrationFunction } from "../registrationHelpers.ts"
import type { AnySpecialAbilityOfGroupDependency } from "./anySpecialAbilityOfGroup.ts"

/**
 * Registers or unregisters a {@link MagicalTraditionPrerequisite} as a
 * dependency on the character's draft.
 */
export const registerOrUnregisterMagicalTraditionPrerequisiteAsDependency: RegistrationFunction<
  MagicalTraditionPrerequisite,
  ActivatableIdentifier
> = (p, method, character, sourceId, index, isPartOfDisjunction): void => {
  if (p.restriction !== undefined) {
    const dependency: ActivatableDependency = {
      sourceId,
      index,
      isPartOfDisjunction: true, // TODO: Can be part of a disjunction while being a disjunction itself, so this would be misleading then. maybe implement like AnySpecialAbilityOfGroup
      active: true,
    }

    switch (p.restriction.kind) {
      case "CanLearnRituals":
        return character.global.db
          .getAllInstanceContainersOfEntity("MagicalTradition")
          .forEach(({ id, content: { can_learn_rituals } }) => {
            if (can_learn_rituals) {
              character.specialAbilities
                .getSpecialAbilitiesCollection("MagicalTradition")
                .addOrRemoveDependency(id, method, dependency)
            }
          })
      case "CanBindFamiliars":
        return character.global.db
          .getAllInstanceContainersOfEntity("MagicalTradition")
          .forEach(({ id, content: { can_bind_familiars } }) => {
            if (can_bind_familiars) {
              character.specialAbilities
                .getSpecialAbilitiesCollection("MagicalTradition")
                .addOrRemoveDependency(id, method, dependency)
            }
          })
      default:
        return assertExhaustive(p.restriction)
    }
  }

  const dependency: AnySpecialAbilityOfGroupDependency = {
    sourceId,
    index,
    isPartOfDisjunction,
    group: "MagicalTradition",
  }

  return addOrRemoveDependency(method, character.specialAbilities.dependencies, dependency)
}

import type {
  ActivatableIdentifier,
  PersonalityTrait_ID,
  PersonalityTraitPrerequisite,
} from "@optolith/database-schema/gen"
import type { Case } from "../../databaseEnum.ts"
import type { PersonalityTraitDependency } from "../../personalityTraits.ts"
import { addOrRemoveDependency, type RegistrationFunction } from "../registrationHelpers.ts"

/**
 * Registers or unregisters a {@link PersonalityTraitPrerequisite} as a
 * dependency on the character's draft.
 */
export const registerOrUnregisterPersonalityTraitPrerequisiteAsDependency: RegistrationFunction<
  PersonalityTraitPrerequisite,
  ActivatableIdentifier | Case<"PersonalityTrait", PersonalityTrait_ID>
> = (p, method, character, sourceId, index, isPartOfDisjunction): void => {
  const dependency: PersonalityTraitDependency = {
    sourceId,
    id: p.id,
    active: p.active,
    index,
    isPartOfDisjunction,
  }

  addOrRemoveDependency(method, character.personalityTraits.dependencies, dependency)
}

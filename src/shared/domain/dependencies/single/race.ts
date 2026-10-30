import type { ActivatableIdentifier, RacePrerequisite } from "@optolith/database-schema/gen"
import type { RaceDependency } from "../../race.ts"
import { type RegistrationFunction, addOrRemoveDependency } from "../registrationHelpers.ts"

/**
 * Registers or unregisters a {@link RacePrerequisite} as a dependency on the
 * character's draft.
 */
export const registerOrUnregisterRacePrerequisiteAsDependency: RegistrationFunction<
  RacePrerequisite,
  ActivatableIdentifier
> = (p, method, character, sourceId, index, isPartOfDisjunction): void => {
  const dependency: RaceDependency = {
    sourceId,
    index,
    isPartOfDisjunction,
    id: p.id,
    active: p.active,
  }

  if (character.race) {
    addOrRemoveDependency(method, character.race.dependencies, dependency)
  }
}

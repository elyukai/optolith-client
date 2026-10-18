import { ActivatableIdentifier } from "@optolith/database-schema/gen"
import { RacePrerequisite } from "@optolith/database-schema/gen"
import { RaceDependency } from "../../race.ts"
import { RegistrationFunction, addOrRemoveDependency } from "../registrationHelpers.ts"

/**
 * Registers or unregisters a {@link RacePrerequisite} as a dependency on the
 * character's draft.
 */
export const registerOrUnregisterRacePrerequisiteAsDependency: RegistrationFunction<
  RacePrerequisite,
  ActivatableIdentifier
> = (method, character, p, sourceId, index, isPartOfDisjunction): void => {
  const dependency: RaceDependency = {
    sourceId,
    index,
    isPartOfDisjunction,
    id: p.id.race,
    active: p.active,
  }

  addOrRemoveDependency(method, character.race.dependencies, dependency)
}

import { ActivatableIdentifier } from "optolith-database-schema/types/_IdentifierGroup"
import {
  BlessedTraditionPrerequisite,
  MagicalTraditionPrerequisite,
} from "optolith-database-schema/types/prerequisites/single/TraditionPrerequisite"
import { assertExhaustive } from "../../../utils/typeSafety.ts"
import { ActivatableDependency } from "../../activatable/activatableDependency.ts"
import { createEmptyDynamicActivatable } from "../../activatable/activatableEntry.ts"
import { RegistrationFunction, addOrRemoveDependencyInSlice } from "../registrationHelpers.ts"

/**
 * Registers or unregisters a {@link BlessedTraditionPrerequisite} as a
 * dependency on the character's draft.
 */
export const registerOrUnregisterBlessedTraditionPrerequisiteAsDependency: RegistrationFunction<
  BlessedTraditionPrerequisite,
  ActivatableIdentifier,
  {
    blessedTraditionChurchIds: number[]
    blessedTraditionShamanisticIds: number[]
  }
> = (
  method,
  character,
  p,
  sourceId,
  index,
  _isPartOfDisjunction,
  { blessedTraditionChurchIds, blessedTraditionShamanisticIds },
): void => {
  const dependency: ActivatableDependency = {
    sourceId,
    index,
    isPartOfDisjunction: true,
    active: true,
  }

  switch (p.restriction) {
    case "Church":
      return blessedTraditionChurchIds.forEach(id =>
        addOrRemoveDependencyInSlice(
          method,
          character.specialAbilities.blessedTraditions,
          id,
          createEmptyDynamicActivatable,
          dependency,
        ),
      )
    case "Shamanistic":
      return blessedTraditionShamanisticIds.forEach(id =>
        addOrRemoveDependencyInSlice(
          method,
          character.specialAbilities.blessedTraditions,
          id,
          createEmptyDynamicActivatable,
          dependency,
        ),
      )
    case undefined:
      return [...blessedTraditionChurchIds, ...blessedTraditionShamanisticIds].forEach(id =>
        addOrRemoveDependencyInSlice(
          method,
          character.specialAbilities.blessedTraditions,
          id,
          createEmptyDynamicActivatable,
          dependency,
        ),
      )
    default:
      return assertExhaustive(p.restriction)
  }
}

/**
 * Registers or unregisters a {@link MagicalTraditionPrerequisite} as a
 * dependency on the character's draft.
 */
export const registerOrUnregisterMagicalTraditionPrerequisiteAsDependency: RegistrationFunction<
  MagicalTraditionPrerequisite,
  ActivatableIdentifier,
  {
    magicalTraditionIds: number[]
    magicalTraditionIdsThatCanLearnRituals: number[]
    magicalTraditionIdsThatCanBindFamiliars: number[]
  }
> = (
  method,
  character,
  p,
  sourceId,
  index,
  _isPartOfDisjunction,
  {
    magicalTraditionIds,
    magicalTraditionIdsThatCanLearnRituals,
    magicalTraditionIdsThatCanBindFamiliars,
  },
): void => {
  const dependency: ActivatableDependency = {
    sourceId,
    index,
    isPartOfDisjunction: true,
    active: true,
  }

  switch (p.restriction) {
    case "CanLearnRituals":
      return magicalTraditionIdsThatCanLearnRituals.forEach(id =>
        addOrRemoveDependencyInSlice(
          method,
          character.specialAbilities.magicalTraditions,
          id,
          createEmptyDynamicActivatable,
          dependency,
        ),
      )
    case "CanBindFamiliars":
      return magicalTraditionIdsThatCanBindFamiliars.forEach(id =>
        addOrRemoveDependencyInSlice(
          method,
          character.specialAbilities.magicalTraditions,
          id,
          createEmptyDynamicActivatable,
          dependency,
        ),
      )
    case undefined:
      return magicalTraditionIds.forEach(id =>
        addOrRemoveDependencyInSlice(
          method,
          character.specialAbilities.magicalTraditions,
          id,
          createEmptyDynamicActivatable,
          dependency,
        ),
      )
    default:
      return assertExhaustive(p.restriction)
  }
}

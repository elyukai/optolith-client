import { registerOrUnregisterPrerequisitesOfGeneralAsDependencies } from "../../../shared/domain/dependencies/fullPrerequisiteRegistrationAsDependencyForType.ts"
import { getCreateIdentifierObject } from "../../../shared/domain/identifier.ts"
import { createActivatableSlice } from "../activatableSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  actions: {
    addInstance: addAdvancedCombatSpecialAbility,
    changeInstanceLevel: changeAdvancedCombatSpecialAbilityLevel,
    removeInstance: removeAdvancedCombatSpecialAbility,
  },
  reducer: advancedCombatSpecialAbilitiesReducer,
} = createActivatableSlice({
  entityName: "AdvancedCombatSpecialAbility",
  getState: state => state.specialAbilities.advancedCombatSpecialAbilities,
  getPrerequisites: (id, database) =>
    database.advancedCombatSpecialAbilities[id]?.prerequisites ?? [],
  getAdventurePointsValue: staticEntry => staticEntry.ap_value,
  createIdentifierObject: getCreateIdentifierObject("AdvancedCombatSpecialAbility"),
  registerOrUnregisterPrerequisitesAsDependencies:
    registerOrUnregisterPrerequisitesOfGeneralAsDependencies,
})

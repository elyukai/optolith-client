import { registerOrUnregisterPrerequisitesOfGeneralAsDependencies } from "../../../shared/domain/dependencies/fullPrerequisiteRegistrationAsDependencyForType.ts"
import { getCreateIdentifierObject } from "../../../shared/domain/identifier.ts"
import { createActivatableSlice } from "../activatableSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  actions: {
    addInstance: addCombatStyleSpecialAbility,
    changeInstanceLevel: changeCombatStyleSpecialAbilityLevel,
    removeInstance: removeCombatStyleSpecialAbility,
  },
  reducer: combatStyleSpecialAbilitiesReducer,
} = createActivatableSlice({
  entityName: "CombatStyleSpecialAbility",
  getState: state => state.specialAbilities.combatStyleSpecialAbilities,
  getPrerequisites: (id, database) => database.combatStyleSpecialAbilities[id]?.prerequisites ?? [],
  getAdventurePointsValue: staticEntry => staticEntry.ap_value,
  createIdentifierObject: getCreateIdentifierObject("CombatStyleSpecialAbility"),
  registerOrUnregisterPrerequisitesAsDependencies:
    registerOrUnregisterPrerequisitesOfGeneralAsDependencies,
})

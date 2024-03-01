import { registerOrUnregisterPrerequisitesOfGeneralAsDependencies } from "../../../shared/domain/dependencies/fullPrerequisiteRegistrationAsDependencyForType.ts"
import { getCreateIdentifierObject } from "../../../shared/domain/identifier.ts"
import { createActivatableSlice } from "../activatableSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  actions: {
    addInstance: addCombatSpecialAbility,
    changeInstanceLevel: changeCombatSpecialAbilityLevel,
    removeInstance: removeCombatSpecialAbility,
  },
  reducer: combatSpecialAbilitiesReducer,
} = createActivatableSlice({
  entityName: "CombatSpecialAbility",
  getState: state => state.specialAbilities.combatSpecialAbilities,
  getPrerequisites: (id, database) => database.combatSpecialAbilities[id]?.prerequisites ?? [],
  getAdventurePointsValue: staticEntry => staticEntry.ap_value,
  createIdentifierObject: getCreateIdentifierObject("CombatSpecialAbility"),
  registerOrUnregisterPrerequisitesAsDependencies:
    registerOrUnregisterPrerequisitesOfGeneralAsDependencies,
})

import { registerOrUnregisterPrerequisitesOfGeneralAsDependencies } from "../../../shared/domain/dependencies/fullPrerequisiteRegistrationAsDependencyForType.ts"
import { getCreateIdentifierObject } from "../../../shared/domain/identifier.ts"
import { createActivatableSlice } from "../activatableSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  actions: {
    addInstance: addCommandSpecialAbility,
    changeInstanceLevel: changeCommandSpecialAbilityLevel,
    removeInstance: removeCommandSpecialAbility,
  },
  reducer: commandSpecialAbilitiesReducer,
} = createActivatableSlice({
  entityName: "CommandSpecialAbility",
  getState: state => state.specialAbilities.commandSpecialAbilities,
  getPrerequisites: (id, database) => database.commandSpecialAbilities[id]?.prerequisites ?? [],
  getAdventurePointsValue: staticEntry => staticEntry.ap_value,
  createIdentifierObject: getCreateIdentifierObject("CommandSpecialAbility"),
  registerOrUnregisterPrerequisitesAsDependencies:
    registerOrUnregisterPrerequisitesOfGeneralAsDependencies,
})

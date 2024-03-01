import { registerOrUnregisterPrerequisitesOfGeneralAsDependencies } from "../../../shared/domain/dependencies/fullPrerequisiteRegistrationAsDependencyForType.ts"
import { getCreateIdentifierObject } from "../../../shared/domain/identifier.ts"
import { createActivatableSlice } from "../activatableSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  actions: {
    addInstance: addGeneralSpecialAbility,
    changeInstanceLevel: changeGeneralSpecialAbilityLevel,
    removeInstance: removeGeneralSpecialAbility,
  },
  reducer: generalSpecialAbilitiesReducer,
} = createActivatableSlice({
  entityName: "GeneralSpecialAbility",
  getState: state => state.specialAbilities.generalSpecialAbilities,
  getPrerequisites: (id, database) => database.generalSpecialAbilities[id]?.prerequisites ?? [],
  getAdventurePointsValue: staticEntry => staticEntry.ap_value,
  createIdentifierObject: getCreateIdentifierObject("GeneralSpecialAbility"),
  registerOrUnregisterPrerequisitesAsDependencies:
    registerOrUnregisterPrerequisitesOfGeneralAsDependencies,
})

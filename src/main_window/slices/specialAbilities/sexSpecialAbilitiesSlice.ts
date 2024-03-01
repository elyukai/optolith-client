import { registerOrUnregisterPrerequisitesOfGeneralAsDependencies } from "../../../shared/domain/dependencies/fullPrerequisiteRegistrationAsDependencyForType.ts"
import { getCreateIdentifierObject } from "../../../shared/domain/identifier.ts"
import { createActivatableSlice } from "../activatableSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  actions: {
    addInstance: addSexSpecialAbility,
    changeInstanceLevel: changeSexSpecialAbilityLevel,
    removeInstance: removeSexSpecialAbility,
  },
  reducer: sexSpecialAbilitiesReducer,
} = createActivatableSlice({
  entityName: "SexSpecialAbility",
  getState: state => state.specialAbilities.sexSpecialAbilities,
  getPrerequisites: (id, database) => database.sexSpecialAbilities[id]?.prerequisites ?? [],
  getAdventurePointsValue: staticEntry => staticEntry.ap_value,
  createIdentifierObject: getCreateIdentifierObject("SexSpecialAbility"),
  registerOrUnregisterPrerequisitesAsDependencies:
    registerOrUnregisterPrerequisitesOfGeneralAsDependencies,
})

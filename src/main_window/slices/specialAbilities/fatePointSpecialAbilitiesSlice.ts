import { registerOrUnregisterPrerequisitesOfGeneralAsDependencies } from "../../../shared/domain/dependencies/fullPrerequisiteRegistrationAsDependencyForType.ts"
import { getCreateIdentifierObject } from "../../../shared/domain/identifier.ts"
import { createActivatableSlice } from "../activatableSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  actions: {
    addInstance: addFatePointSpecialAbility,
    changeInstanceLevel: changeFatePointSpecialAbilityLevel,
    removeInstance: removeFatePointSpecialAbility,
  },
  reducer: fatePointSpecialAbilitiesReducer,
} = createActivatableSlice({
  entityName: "FatePointSpecialAbility",
  getState: state => state.specialAbilities.fatePointSpecialAbilities,
  getPrerequisites: (id, database) => database.fatePointSpecialAbilities[id]?.prerequisites ?? [],
  getAdventurePointsValue: staticEntry => staticEntry.ap_value,
  createIdentifierObject: getCreateIdentifierObject("FatePointSpecialAbility"),
  registerOrUnregisterPrerequisitesAsDependencies:
    registerOrUnregisterPrerequisitesOfGeneralAsDependencies,
})

import { registerOrUnregisterPrerequisitesOfGeneralAsDependencies } from "../../../shared/domain/dependencies/fullPrerequisiteRegistrationAsDependencyForType.ts"
import { getCreateIdentifierObject } from "../../../shared/domain/identifier.ts"
import { createActivatableSlice } from "../activatableSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  actions: {
    addInstance: addFatePointSexSpecialAbility,
    changeInstanceLevel: changeFatePointSexSpecialAbilityLevel,
    removeInstance: removeFatePointSexSpecialAbility,
  },
  reducer: fatePointSexSpecialAbilitiesReducer,
} = createActivatableSlice({
  entityName: "FatePointSexSpecialAbility",
  getState: state => state.specialAbilities.fatePointSexSpecialAbilities,
  getPrerequisites: (id, database) =>
    database.fatePointSexSpecialAbilities[id]?.prerequisites ?? [],
  getAdventurePointsValue: staticEntry => staticEntry.ap_value,
  createIdentifierObject: getCreateIdentifierObject("FatePointSexSpecialAbility"),
  registerOrUnregisterPrerequisitesAsDependencies:
    registerOrUnregisterPrerequisitesOfGeneralAsDependencies,
})

import { registerOrUnregisterPrerequisitesOfGeneralAsDependencies } from "../../../shared/domain/dependencies/fullPrerequisiteRegistrationAsDependencyForType.ts"
import { getCreateIdentifierObject } from "../../../shared/domain/identifier.ts"
import { createActivatableSlice } from "../activatableSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  actions: {
    addInstance: addFamiliarSpecialAbility,
    changeInstanceLevel: changeFamiliarSpecialAbilityLevel,
    removeInstance: removeFamiliarSpecialAbility,
  },
  reducer: familiarSpecialAbilitiesReducer,
} = createActivatableSlice({
  entityName: "FamiliarSpecialAbility",
  getState: state => state.specialAbilities.familiarSpecialAbilities,
  getPrerequisites: (id, database) => database.familiarSpecialAbilities[id]?.prerequisites ?? [],
  getAdventurePointsValue: staticEntry => staticEntry.ap_value,
  createIdentifierObject: getCreateIdentifierObject("FamiliarSpecialAbility"),
  registerOrUnregisterPrerequisitesAsDependencies:
    registerOrUnregisterPrerequisitesOfGeneralAsDependencies,
})

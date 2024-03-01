import { registerOrUnregisterPrerequisitesOfGeneralAsDependencies } from "../../../shared/domain/dependencies/fullPrerequisiteRegistrationAsDependencyForType.ts"
import { getCreateIdentifierObject } from "../../../shared/domain/identifier.ts"
import { createActivatableSlice } from "../activatableSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  actions: {
    addInstance: addBrawlingSpecialAbility,
    changeInstanceLevel: changeBrawlingSpecialAbilityLevel,
    removeInstance: removeBrawlingSpecialAbility,
  },
  reducer: brawlingSpecialAbilitiesReducer,
} = createActivatableSlice({
  entityName: "BrawlingSpecialAbility",
  getState: state => state.specialAbilities.brawlingSpecialAbilities,
  getPrerequisites: (id, database) => database.brawlingSpecialAbilities[id]?.prerequisites ?? [],
  getAdventurePointsValue: staticEntry => staticEntry.ap_value,
  createIdentifierObject: getCreateIdentifierObject("BrawlingSpecialAbility"),
  registerOrUnregisterPrerequisitesAsDependencies:
    registerOrUnregisterPrerequisitesOfGeneralAsDependencies,
})

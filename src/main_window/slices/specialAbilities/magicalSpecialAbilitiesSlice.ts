import { registerOrUnregisterPrerequisitesOfGeneralAsDependencies } from "../../../shared/domain/dependencies/fullPrerequisiteRegistrationAsDependencyForType.ts"
import { getCreateIdentifierObject } from "../../../shared/domain/identifier.ts"
import { createActivatableSlice } from "../activatableSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  actions: {
    addInstance: addMagicalSpecialAbility,
    changeInstanceLevel: changeMagicalSpecialAbilityLevel,
    removeInstance: removeMagicalSpecialAbility,
  },
  reducer: magicalSpecialAbilitiesReducer,
} = createActivatableSlice({
  entityName: "MagicalSpecialAbility",
  getState: state => state.specialAbilities.magicalSpecialAbilities,
  getPrerequisites: (id, database) => database.magicalSpecialAbilities[id]?.prerequisites ?? [],
  getAdventurePointsValue: staticEntry => staticEntry.ap_value,
  createIdentifierObject: getCreateIdentifierObject("MagicalSpecialAbility"),
  registerOrUnregisterPrerequisitesAsDependencies:
    registerOrUnregisterPrerequisitesOfGeneralAsDependencies,
})

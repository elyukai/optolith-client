import { registerOrUnregisterPrerequisitesOfGeneralAsDependencies } from "../../../shared/domain/dependencies/fullPrerequisiteRegistrationAsDependencyForType.ts"
import { getCreateIdentifierObject } from "../../../shared/domain/identifier.ts"
import { createActivatableSlice } from "../activatableSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  actions: {
    addInstance: addMagicStyleSpecialAbility,
    changeInstanceLevel: changeMagicStyleSpecialAbilityLevel,
    removeInstance: removeMagicStyleSpecialAbility,
  },
  reducer: magicStyleSpecialAbilitiesReducer,
} = createActivatableSlice({
  entityName: "MagicStyleSpecialAbility",
  getState: state => state.specialAbilities.magicStyleSpecialAbilities,
  getPrerequisites: (id, database) => database.magicStyleSpecialAbilities[id]?.prerequisites ?? [],
  getAdventurePointsValue: staticEntry => staticEntry.ap_value,
  createIdentifierObject: getCreateIdentifierObject("MagicStyleSpecialAbility"),
  registerOrUnregisterPrerequisitesAsDependencies:
    registerOrUnregisterPrerequisitesOfGeneralAsDependencies,
})

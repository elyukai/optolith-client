import { registerOrUnregisterPrerequisitesOfGeneralAsDependencies } from "../../../shared/domain/dependencies/fullPrerequisiteRegistrationAsDependencyForType.ts"
import { getCreateIdentifierObject } from "../../../shared/domain/identifier.ts"
import { createActivatableSlice } from "../activatableSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  actions: {
    addInstance: addAdvancedMagicalSpecialAbility,
    changeInstanceLevel: changeAdvancedMagicalSpecialAbilityLevel,
    removeInstance: removeAdvancedMagicalSpecialAbility,
  },
  reducer: advancedMagicalSpecialAbilitiesReducer,
} = createActivatableSlice({
  entityName: "AdvancedMagicalSpecialAbility",
  getState: state => state.specialAbilities.advancedMagicalSpecialAbilities,
  getPrerequisites: (id, database) =>
    database.advancedMagicalSpecialAbilities[id]?.prerequisites ?? [],
  getAdventurePointsValue: staticEntry => staticEntry.ap_value,
  createIdentifierObject: getCreateIdentifierObject("AdvancedMagicalSpecialAbility"),
  registerOrUnregisterPrerequisitesAsDependencies:
    registerOrUnregisterPrerequisitesOfGeneralAsDependencies,
})

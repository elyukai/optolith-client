import { registerOrUnregisterPrerequisitesOfGeneralAsDependencies } from "../../../shared/domain/dependencies/fullPrerequisiteRegistrationAsDependencyForType.ts"
import { getCreateIdentifierObject } from "../../../shared/domain/identifier.ts"
import { createActivatableSlice } from "../activatableSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  actions: {
    addInstance: addAdvancedKarmaSpecialAbility,
    changeInstanceLevel: changeAdvancedKarmaSpecialAbilityLevel,
    removeInstance: removeAdvancedKarmaSpecialAbility,
  },
  reducer: advancedKarmaSpecialAbilitiesReducer,
} = createActivatableSlice({
  entityName: "AdvancedKarmaSpecialAbility",
  getState: state => state.specialAbilities.advancedKarmaSpecialAbilities,
  getPrerequisites: (id, database) =>
    database.advancedKarmaSpecialAbilities[id]?.prerequisites ?? [],
  getAdventurePointsValue: staticEntry => staticEntry.ap_value,
  createIdentifierObject: getCreateIdentifierObject("AdvancedKarmaSpecialAbility"),
  registerOrUnregisterPrerequisitesAsDependencies:
    registerOrUnregisterPrerequisitesOfGeneralAsDependencies,
})

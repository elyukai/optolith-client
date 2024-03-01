import { registerOrUnregisterPrerequisitesOfGeneralAsDependencies } from "../../../shared/domain/dependencies/fullPrerequisiteRegistrationAsDependencyForType.ts"
import { getCreateIdentifierObject } from "../../../shared/domain/identifier.ts"
import { createActivatableSlice } from "../activatableSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  actions: {
    addInstance: addKarmaSpecialAbility,
    changeInstanceLevel: changeKarmaSpecialAbilityLevel,
    removeInstance: removeKarmaSpecialAbility,
  },
  reducer: karmaSpecialAbilitiesReducer,
} = createActivatableSlice({
  entityName: "KarmaSpecialAbility",
  getState: state => state.specialAbilities.karmaSpecialAbilities,
  getPrerequisites: (id, database) => database.karmaSpecialAbilities[id]?.prerequisites ?? [],
  getAdventurePointsValue: staticEntry => staticEntry.ap_value,
  createIdentifierObject: getCreateIdentifierObject("KarmaSpecialAbility"),
  registerOrUnregisterPrerequisitesAsDependencies:
    registerOrUnregisterPrerequisitesOfGeneralAsDependencies,
})

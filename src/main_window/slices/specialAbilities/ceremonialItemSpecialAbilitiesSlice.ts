import { registerOrUnregisterPrerequisitesOfGeneralAsDependencies } from "../../../shared/domain/dependencies/fullPrerequisiteRegistrationAsDependencyForType.ts"
import { getCreateIdentifierObject } from "../../../shared/domain/identifier.ts"
import { createActivatableSlice } from "../activatableSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  actions: {
    addInstance: addCeremonialItemSpecialAbility,
    changeInstanceLevel: changeCeremonialItemSpecialAbilityLevel,
    removeInstance: removeCeremonialItemSpecialAbility,
  },
  reducer: ceremonialItemSpecialAbilitiesReducer,
} = createActivatableSlice({
  entityName: "CeremonialItemSpecialAbility",
  getState: state => state.specialAbilities.ceremonialItemSpecialAbilities,
  getPrerequisites: (id, database) =>
    database.ceremonialItemSpecialAbilities[id]?.prerequisites ?? [],
  getAdventurePointsValue: staticEntry => staticEntry.ap_value,
  createIdentifierObject: getCreateIdentifierObject("CeremonialItemSpecialAbility"),
  registerOrUnregisterPrerequisitesAsDependencies:
    registerOrUnregisterPrerequisitesOfGeneralAsDependencies,
})

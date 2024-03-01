import { registerOrUnregisterPrerequisitesOfGeneralAsDependencies } from "../../../shared/domain/dependencies/fullPrerequisiteRegistrationAsDependencyForType.ts"
import { getCreateIdentifierObject } from "../../../shared/domain/identifier.ts"
import { createActivatableSlice } from "../activatableSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  actions: {
    addInstance: addSikaryanDrainSpecialAbility,
    changeInstanceLevel: changeSikaryanDrainSpecialAbilityLevel,
    removeInstance: removeSikaryanDrainSpecialAbility,
  },
  reducer: sikaryanDrainSpecialAbilitiesReducer,
} = createActivatableSlice({
  entityName: "SikaryanDrainSpecialAbility",
  getState: state => state.specialAbilities.sikaryanDrainSpecialAbilities,
  getPrerequisites: (id, database) =>
    database.sikaryanDrainSpecialAbilities[id]?.prerequisites ?? [],
  getAdventurePointsValue: staticEntry => staticEntry.ap_value,
  createIdentifierObject: getCreateIdentifierObject("SikaryanDrainSpecialAbility"),
  registerOrUnregisterPrerequisitesAsDependencies:
    registerOrUnregisterPrerequisitesOfGeneralAsDependencies,
})

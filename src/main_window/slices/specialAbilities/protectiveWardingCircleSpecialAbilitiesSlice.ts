import { registerOrUnregisterPrerequisitesOfGeneralAsDependencies } from "../../../shared/domain/dependencies/fullPrerequisiteRegistrationAsDependencyForType.ts"
import { getCreateIdentifierObject } from "../../../shared/domain/identifier.ts"
import { createActivatableSlice } from "../activatableSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  actions: {
    addInstance: addProtectiveWardingCircleSpecialAbility,
    changeInstanceLevel: changeProtectiveWardingCircleSpecialAbilityLevel,
    removeInstance: removeProtectiveWardingCircleSpecialAbility,
  },
  reducer: protectiveWardingCircleSpecialAbilitiesReducer,
} = createActivatableSlice({
  entityName: "ProtectiveWardingCircleSpecialAbility",
  getState: state => state.specialAbilities.protectiveWardingCircleSpecialAbilities,
  getPrerequisites: (id, database) =>
    database.protectiveWardingCircleSpecialAbilities[id]?.prerequisites ?? [],
  getAdventurePointsValue: staticEntry => staticEntry.ap_value,
  createIdentifierObject: getCreateIdentifierObject("ProtectiveWardingCircleSpecialAbility"),
  registerOrUnregisterPrerequisitesAsDependencies:
    registerOrUnregisterPrerequisitesOfGeneralAsDependencies,
})

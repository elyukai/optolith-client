import { registerOrUnregisterPrerequisitesOfGeneralAsDependencies } from "../../../shared/domain/dependencies/fullPrerequisiteRegistrationAsDependencyForType.ts"
import { getCreateIdentifierObject } from "../../../shared/domain/identifier.ts"
import { createActivatableSlice } from "../activatableSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  actions: {
    addInstance: addLiturgicalStyleSpecialAbility,
    changeInstanceLevel: changeLiturgicalStyleSpecialAbilityLevel,
    removeInstance: removeLiturgicalStyleSpecialAbility,
  },
  reducer: liturgicalStyleSpecialAbilitiesReducer,
} = createActivatableSlice({
  entityName: "LiturgicalStyleSpecialAbility",
  getState: state => state.specialAbilities.liturgicalStyleSpecialAbilities,
  getPrerequisites: (id, database) =>
    database.liturgicalStyleSpecialAbilities[id]?.prerequisites ?? [],
  getAdventurePointsValue: staticEntry => staticEntry.ap_value,
  createIdentifierObject: getCreateIdentifierObject("LiturgicalStyleSpecialAbility"),
  registerOrUnregisterPrerequisitesAsDependencies:
    registerOrUnregisterPrerequisitesOfGeneralAsDependencies,
})

import { registerOrUnregisterPrerequisitesOfGeneralAsDependencies } from "../../../shared/domain/dependencies/fullPrerequisiteRegistrationAsDependencyForType.ts"
import { getCreateIdentifierObject } from "../../../shared/domain/identifier.ts"
import { createActivatableSlice } from "../activatableSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  actions: {
    addInstance: addSkillStyleSpecialAbility,
    changeInstanceLevel: changeSkillStyleSpecialAbilityLevel,
    removeInstance: removeSkillStyleSpecialAbility,
  },
  reducer: skillStyleSpecialAbilitiesReducer,
} = createActivatableSlice({
  entityName: "SkillStyleSpecialAbility",
  getState: state => state.specialAbilities.skillStyleSpecialAbilities,
  getPrerequisites: (id, database) => database.skillStyleSpecialAbilities[id]?.prerequisites ?? [],
  getAdventurePointsValue: staticEntry => staticEntry.ap_value,
  createIdentifierObject: getCreateIdentifierObject("SkillStyleSpecialAbility"),
  registerOrUnregisterPrerequisitesAsDependencies:
    registerOrUnregisterPrerequisitesOfGeneralAsDependencies,
})

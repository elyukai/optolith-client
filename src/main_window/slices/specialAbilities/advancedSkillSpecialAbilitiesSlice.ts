import { registerOrUnregisterPrerequisitesOfGeneralAsDependencies } from "../../../shared/domain/dependencies/fullPrerequisiteRegistrationAsDependencyForType.ts"
import { getCreateIdentifierObject } from "../../../shared/domain/identifier.ts"
import { createActivatableSlice } from "../activatableSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  actions: {
    addInstance: addAdvancedSkillSpecialAbility,
    changeInstanceLevel: changeAdvancedSkillSpecialAbilityLevel,
    removeInstance: removeAdvancedSkillSpecialAbility,
  },
  reducer: advancedSkillSpecialAbilitiesReducer,
} = createActivatableSlice({
  entityName: "AdvancedSkillSpecialAbility",
  getState: state => state.specialAbilities.advancedSkillSpecialAbilities,
  getPrerequisites: (id, database) =>
    database.advancedSkillSpecialAbilities[id]?.prerequisites ?? [],
  getAdventurePointsValue: staticEntry => staticEntry.ap_value,
  createIdentifierObject: getCreateIdentifierObject("AdvancedSkillSpecialAbility"),
  registerOrUnregisterPrerequisitesAsDependencies:
    registerOrUnregisterPrerequisitesOfGeneralAsDependencies,
})

import { registerOrUnregisterPrerequisitesOfGeneralAsDependencies } from "../../../shared/domain/dependencies/fullPrerequisiteRegistrationAsDependencyForType.ts"
import { getCreateIdentifierObject } from "../../../shared/domain/identifier.ts"
import { createActivatableSlice } from "../activatableSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  actions: {
    addInstance: addSickleRitual,
    changeInstanceLevel: changeSickleRitualLevel,
    removeInstance: removeSickleRitual,
  },
  reducer: sickleRitualsReducer,
} = createActivatableSlice({
  entityName: "SickleRitual",
  getState: state => state.specialAbilities.sickleRituals,
  getPrerequisites: (id, database) => database.sickleRituals[id]?.prerequisites ?? [],
  getAdventurePointsValue: staticEntry => staticEntry.ap_value,
  createIdentifierObject: getCreateIdentifierObject("SickleRitual"),
  registerOrUnregisterPrerequisitesAsDependencies:
    registerOrUnregisterPrerequisitesOfGeneralAsDependencies,
})

import { registerOrUnregisterPrerequisitesOfGeneralAsDependencies } from "../../../shared/domain/dependencies/fullPrerequisiteRegistrationAsDependencyForType.ts"
import { getCreateIdentifierObject } from "../../../shared/domain/identifier.ts"
import { createActivatableSlice } from "../activatableSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  actions: {
    addInstance: addDaggerRitual,
    changeInstanceLevel: changeDaggerRitualLevel,
    removeInstance: removeDaggerRitual,
  },
  reducer: daggerRitualsReducer,
} = createActivatableSlice({
  entityName: "DaggerRitual",
  getState: state => state.specialAbilities.daggerRituals,
  getPrerequisites: (id, database) => database.daggerRituals[id]?.prerequisites ?? [],
  getAdventurePointsValue: staticEntry => staticEntry.ap_value,
  createIdentifierObject: getCreateIdentifierObject("DaggerRitual"),
  registerOrUnregisterPrerequisitesAsDependencies:
    registerOrUnregisterPrerequisitesOfGeneralAsDependencies,
})

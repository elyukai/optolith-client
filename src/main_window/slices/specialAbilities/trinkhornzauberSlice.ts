import { registerOrUnregisterPrerequisitesOfGeneralAsDependencies } from "../../../shared/domain/dependencies/fullPrerequisiteRegistrationAsDependencyForType.ts"
import { getCreateIdentifierObject } from "../../../shared/domain/identifier.ts"
import { createActivatableSlice } from "../activatableSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  actions: {
    addInstance: addTrinkhornzauber,
    changeInstanceLevel: changeTrinkhornzauberLevel,
    removeInstance: removeTrinkhornzauber,
  },
  reducer: trinkhornzauberReducer,
} = createActivatableSlice({
  entityName: "Trinkhornzauber",
  getState: state => state.specialAbilities.trinkhornzauber,
  getPrerequisites: (id, database) => database.trinkhornzauber[id]?.prerequisites ?? [],
  getAdventurePointsValue: staticEntry => staticEntry.ap_value,
  createIdentifierObject: getCreateIdentifierObject("Trinkhornzauber"),
  registerOrUnregisterPrerequisitesAsDependencies:
    registerOrUnregisterPrerequisitesOfGeneralAsDependencies,
})

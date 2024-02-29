import { registerOrUnregisterPrerequisitesOfAdvantageOrDisadvantageAsDependencies } from "../../shared/domain/dependencies/fullPrerequisiteRegistrationAsDependencyForType.ts"
import { createIdentifierObject } from "../../shared/domain/identifier.ts"
import { createActivatableSlice } from "./activatableSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  actions: {
    addInstance: addDisadvantage,
    changeInstanceLevel: changeDisadvantageLevel,
    removeInstance: removeDisadvantage,
  },
  reducer: disadvantagesReducer,
} = createActivatableSlice({
  entityName: "Disadvantage",
  getState: state => state.disadvantages,
  getPrerequisites: (id, database) => database.disadvantages[id]?.prerequisites ?? [],
  getAdventurePointsValue: staticEntry => staticEntry.ap_value,
  createIdentifierObject: id => createIdentifierObject("Disadvantage", id),
  registerOrUnregisterPrerequisitesAsDependencies:
    registerOrUnregisterPrerequisitesOfAdvantageOrDisadvantageAsDependencies,
})

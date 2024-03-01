import { registerOrUnregisterPrerequisitesOfGeneralAsDependencies } from "../../../shared/domain/dependencies/fullPrerequisiteRegistrationAsDependencyForType.ts"
import { getCreateIdentifierObject } from "../../../shared/domain/identifier.ts"
import { createActivatableSlice } from "../activatableSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  actions: {
    addInstance: addVampiricGift,
    changeInstanceLevel: changeVampiricGiftLevel,
    removeInstance: removeVampiricGift,
  },
  reducer: vampiricGiftsReducer,
} = createActivatableSlice({
  entityName: "VampiricGift",
  getState: state => state.specialAbilities.vampiricGifts,
  getPrerequisites: (id, database) => database.vampiricGifts[id]?.prerequisites ?? [],
  getAdventurePointsValue: staticEntry => staticEntry.ap_value,
  createIdentifierObject: getCreateIdentifierObject("VampiricGift"),
  registerOrUnregisterPrerequisitesAsDependencies:
    registerOrUnregisterPrerequisitesOfGeneralAsDependencies,
})

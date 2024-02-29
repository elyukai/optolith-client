import { ImprovementCost, fromRaw } from "../../../shared/domain/adventurePoints/improvementCost.ts"
import { createEmptyDynamicMagicalAction } from "../../../shared/domain/rated/magicalActions.ts"
import { createActivatableRatedSlice } from "../activatableRatedSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  actions: {
    addAction: addElvenMagicalSong,
    removeAction: removeElvenMagicalSong,
    incrementAction: incrementElvenMagicalSong,
    decrementAction: decrementElvenMagicalSong,
    setAction: setElvenMagicalSong,
  },
  reducer: elvenMagicalSongsReducer,
} = createActivatableRatedSlice({
  namespace: "elvenMagicalSongs",
  entityName: "ElvenMagicalSong",
  getState: state => state.magicalActions.elvenMagicalSongs,
  getImprovementCost: (id, database) =>
    fromRaw(database.elvenMagicalSongs[id]?.improvement_cost) ?? ImprovementCost.D,
  createEmptyActivatableRated: createEmptyDynamicMagicalAction,
})

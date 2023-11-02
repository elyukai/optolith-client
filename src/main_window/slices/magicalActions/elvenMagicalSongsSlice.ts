import { ImprovementCost, fromRaw } from "../../../shared/domain/adventurePoints/improvementCost.ts"
import { createActivatableRatedSlice } from "../activatableRatedSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  create: createDynamicElvenMagicalSong,
  createInitial: createInitialDynamicElvenMagicalSong,
  getValue: getElvenMagicalSongValue,
  actions: {
    addAction: addElvenMagicalSong,
    removeAction: removeElvenMagicalSong,
    incrementAction: incrementElvenMagicalSong,
    decrementAction: decrementElvenMagicalSong,
  },
  reducer: elvenMagicalSongsReducer,
} = createActivatableRatedSlice({
  namespace: "elvenMagicalSongs",
  entityName: "ElvenMagicalSong",
  getState: state => state.magicalActions.elvenMagicalSongs,
  getImprovementCost: (id, database) =>
    fromRaw(database.elvenMagicalSongs[id]?.improvement_cost) ?? ImprovementCost.D,
})
import { createTinyActivatableSlice } from "./tinyActivatableSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  actions: { addAction: addBlessing, removeAction: removeBlessing },
  reducer: blessingsReducer,
} = createTinyActivatableSlice({
  namespace: "blessings",
  entityName: "Blessing",
  getState: state => state.blessings,
})

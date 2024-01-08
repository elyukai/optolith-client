import { createTinyActivatableSlice } from "./tinyActivatableSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  actions: { addAction: addCantrip, removeAction: removeCantrip },
  reducer: cantripsReducer,
} = createTinyActivatableSlice({
  namespace: "cantrips",
  entityName: "Cantrip",
  getState: state => state.cantrips,
})

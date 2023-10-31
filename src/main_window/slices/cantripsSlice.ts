import { createSimpleActivatableSlice } from "./simpleActivatableSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  actions: { addAction: addCantrip, removeAction: removeCantrip },
  reducer: cantripsReducer,
} = createSimpleActivatableSlice({
  namespace: "cantrips",
  entityName: "Cantrip",
  getState: state => state.cantrips,
})

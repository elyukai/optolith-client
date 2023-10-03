import { createSimpleActivatableSlice } from "./simpleActivatableSlice.ts"

export const {
  actions: { addAction: addBlessing, removeAction: removeBlessing },
  reducer: blessingsReducer,
} = createSimpleActivatableSlice({
  namespace: "blessings",
  entityName: "Blessing",
  getState: state => state.blessings,
})

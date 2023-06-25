import { ImprovementCost } from "../../shared/domain/adventurePoints/improvementCost.ts"
import { createRatedSlice } from "./ratedSlice.ts"

const {
  create,
  createInitial,
  getValue,
  actions: {
    incrementAction,
    decrementAction,
  },
  reducer,
} = createRatedSlice({
  namespace: "attributes",
  entityName: "Attribute",
  getState: state => state.attributes,
  minValue: 8,
  getImprovementCost: () => ImprovementCost.E,
})

export {
  getValue as attributeValue,
  reducer as attributesReducer,
  create as createDynamicAttribute,
  createInitial as createInitialDynamicAttribute,
  decrementAction as decrementAttribute,
  incrementAction as incrementAttribute,
}
